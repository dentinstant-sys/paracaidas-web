/**
 * crearBooking — Cloud Function (callable) · modelo unificado v2
 *
 * Único punto de creación de reservas desde el sitio. Valida la entrada,
 * recalcula el total en el servidor, verifica disponibilidad (solo bloqueo
 * MANUAL de la fecha) y genera el número de reserva.
 *
 * ESTA FUNCIÓN YA NO INICIA EL PAGO. El cobro se hace después:
 *   - Si metodoPago === "pasarela": el frontend llama `generateBoldHash`
 *     con el bookingId devuelto, inyecta el script de Bold y el SDK abre
 *     el checkout en el navegador. El estado real lo cambia el webhook.
 *   - Si metodoPago === "whatsapp": el sitio muestra la confirmación
 *     directa y el operador coordina el pago por chat.
 *
 * Escribe en la colección `bookings`.
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { calcularTotal } = require("./lib/catalogo");
const { calcularMontos } = require("./lib/pagos");
const { PREFIJO } = require("./lib/numeros");

// Respaldo si settings/sedes no está disponible — NO es la fuente de verdad.
const SEDES_FALLBACK = ["bogota", "cali", "medellin", "bucaramanga", "santamarta"];
const METODOS = ["pasarela", "whatsapp"];
const TIPOS_PAGO = ["total", "abono"];

/**
 * Ids de sedes válidas (active) leídos de settings/sedes — la misma fuente
 * que edita el panel y consume el sitio. Si el documento no existe o la
 * lectura falla, cae a SEDES_FALLBACK para no bloquear las reservas.
 */
async function obtenerSedesValidas(db) {
  try {
    const snap = await db.collection("settings").doc("sedes").get();
    const items = snap.exists ? snap.data().items : null;
    if (Array.isArray(items) && items.length) {
      const activas = items.filter((s) => s && s.active !== false).map((s) => s.id);
      if (activas.length) return new Set(activas);
    }
  } catch (e) {
    logger.warn("No se pudo leer settings/sedes; usando respaldo", { error: e.message });
  }
  return new Set(SEDES_FALLBACK);
}

exports.crearBooking = onCall({ region: "us-central1", invoker: "public" }, async (request) => {
  logger.info("crearBooking invoked", { metodo: request.data && request.data.metodoPago });
  const d = request.data || {};
  const cliente = d.cliente || {};

  // ---- Validación de forma ----
  if (!d.fecha || !d.sede || !d.servicioBase || !d.metodoPago) {
    throw new HttpsError("invalid-argument", "Faltan campos obligatorios.");
  }
  if (!METODOS.includes(d.metodoPago)) {
    throw new HttpsError("invalid-argument", "Método de pago inválido.");
  }
  if (!cliente.nombre || !cliente.telefono || !cliente.cedula) {
    throw new HttpsError("invalid-argument", "Datos de contacto incompletos.");
  }
  if (d.aceptaTerminos !== true) {
    throw new HttpsError("failed-precondition", "Debes aceptar los Términos y Condiciones.");
  }

  const db = admin.firestore();

  // Sede válida y activa según settings/sedes (fuente única editable en el panel).
  const sedesValidas = await obtenerSedesValidas(db);
  if (!sedesValidas.has(d.sede)) {
    throw new HttpsError("invalid-argument", "Sede inválida o no disponible.");
  }

  const fecha = new Date(d.fecha);
  if (isNaN(fecha.getTime()) || fecha < new Date()) {
    throw new HttpsError("invalid-argument", "Fecha inválida.");
  }
  const fechaId = fecha.toISOString().slice(0, 10);
  // Fecha normalizada a medianoche UTC — un solo instante por día.
  const fechaDia = admin.firestore.Timestamp.fromDate(new Date(fechaId + "T00:00:00.000Z"));

  // ---- Disponibilidad (modelo MANUAL) ----
  // El cupo automático fue eliminado: las reservas NUNCA descuentan cupo.
  // La única regla que bloquea una reserva es el bloqueo MANUAL de la fecha
  // desde el panel (colección `blocked/{sede}/dates/{fechaId}`).
  const blkSnap = await db.collection("blocked").doc(d.sede)
    .collection("dates").doc(fechaId).get();
  if (blkSnap.exists) {
    throw new HttpsError("failed-precondition", "La fecha seleccionada no está disponible.");
  }

  // ---- Total: recalculado en el servidor ----
  let total, desglose;
  try {
    ({ total, desglose } = await calcularTotal({
      servicioBase: d.servicioBase,
      servicioFotos: d.servicioFotos || "none",
      adicionales: Array.isArray(d.adicionales) ? d.adicionales : [],
    }));
  } catch (e) {
    throw new HttpsError("invalid-argument", e.message);
  }

  // Modalidad de pago (T&C: total o abono del 50%). Si no llega o es inválida
  // se toma "total": el sitio viejo no manda el campo y debe seguir cobrando
  // el 100% como siempre.
  const tipoPago = TIPOS_PAGO.includes(d.tipoPago) ? d.tipoPago : "total";
  const { montoACobrar, saldoPendiente } = calcularMontos(total, tipoPago);

  // ---- Número de booking (contador transaccional) ----
  const contadorRef = db.collection("settings").doc("contador");
  const numero = await db.runTransaction(async (tx) => {
    const snap = await tx.get(contadorRef);
    const ultimo = snap.exists ? snap.data().ultimoNumero || 48000 : 48000;
    const siguiente = ultimo + 1;
    tx.set(contadorRef, { ultimoNumero: siguiente }, { merge: true });
    return `${PREFIJO}-${siguiente}`;
  });

  // ---- Crear el booking ----
  const now = admin.firestore.FieldValue.serverTimestamp();
  const bookingRef = db.collection("bookings").doc();
  const bookingData = {
    numero,
    estado: "pendiente", // estado operativo
    fecha: fechaDia,
    sede: d.sede,
    cliente: {
      nombre: String(cliente.nombre),
      telefono: String(cliente.telefono),
      cedula: String(cliente.cedula),
      email: cliente.email ? String(cliente.email) : "",
      edad: cliente.edad ? Number(cliente.edad) : null,
    },
    servicioBase: d.servicioBase,
    servicioFotos: d.servicioFotos || null,
    adicionales: Array.isArray(d.adicionales) ? d.adicionales : [],
    total,
    desglose,
    pago: {
      metodo: d.metodoPago,
      estado: "iniciado",
      // Qué pasarela procesa se decide al iniciar el cobro, no aquí.
      pasarela: null,
      tipo: tipoPago,
      montoACobrar,
      saldoPendiente,
    },
    notasInternas: "",
    origen: "sitio",
    aceptaTerminos: true,
    aceptaTerminosAt: now,
    createdAt: now,
    updatedAt: now,
  };
  await bookingRef.set(bookingData);

  // Respuesta mínima. El cobro lo dispara el frontend:
  //   - pasarela → llama generateBoldHash(bookingId) y monta el botón Bold.
  //   - whatsapp → muestra confirmación directa.
  return {
    bookingId: bookingRef.id,
    numero,
    total,
    metodoPago: d.metodoPago,
    tipoPago,
    montoACobrar,
    saldoPendiente,
  };
});
