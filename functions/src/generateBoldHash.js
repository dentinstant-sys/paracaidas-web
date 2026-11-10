/**
 * generateBoldHash — Cloud Function (callable) · Condor Sky
 *
 * Genera la firma de integridad para iniciar un pago Bold en el frontend.
 *
 * Patrón (alineado al SDK oficial de Bold):
 *   1. El frontend llama esta función con el bookingId de una reserva ya
 *      persistida en `bookings` por `crearBooking`.
 *   2. Aquí se carga la reserva, se calcula el monto en servidor (la
 *      fuente de verdad es Firestore — el cliente NO manda monto), y se
 *      firma con SHA-256(orderId + amount + currency + secretKey).
 *   3. Se devuelven { orderId, amount, currency, integritySignature, apiKey }
 *      al frontend, que con eso inyecta el script oficial de Bold y
 *      el SDK abre el checkout en el navegador del usuario.
 *
 * SEGURIDAD: la llaveSecreta nunca sale del servidor. Se lee desde
 * `secrets/bold` (colección con regla `if false`, inaccesible al cliente).
 */
const crypto = require("crypto");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getBoldConfig } = require("./lib/bold");
const { montoACobrarAhora } = require("./lib/pagos");

exports.generateBoldHash = onCall({ region: "us-central1", invoker: "public" }, async (request) => {
  logger.info("generateBoldHash invoked");
  const { bookingId } = request.data || {};
  if (!bookingId || typeof bookingId !== "string") {
    throw new HttpsError("invalid-argument", "bookingId requerido.");
  }

  const db = admin.firestore();
  const bookingRef = db.collection("bookings").doc(bookingId);
  const bookingSnap = await bookingRef.get();
  if (!bookingSnap.exists) {
    throw new HttpsError("not-found", "Reserva no encontrada.");
  }
  const booking = bookingSnap.data();
  if (booking.estado === "cancelada") {
    throw new HttpsError("failed-precondition", "La reserva está cancelada.");
  }

  const cfg = await getBoldConfig();
  if (!cfg.activo) {
    throw new HttpsError("failed-precondition", "Pasarela Bold inactiva.");
  }
  if (!cfg.llavePublica || !cfg.llaveSecreta) {
    throw new HttpsError(
      "failed-precondition",
      "Bold no está configurado. Pídele al admin que cargue las llaves."
    );
  }

  // Monto: SIEMPRE recalculado desde Firestore. El cliente no envía monto.
  // Se cobra lo que fija la modalidad elegida (total o abono del 50%).
  // Las reservas viejas no tienen `montoACobrar`: para ellas el monto a cobrar
  // ES el total, que es literalmente lo que fueron.
  const amount = montoACobrarAhora(booking);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new HttpsError("failed-precondition", "Monto inválido en la reserva.");
  }
  const currency = "COP";
  // orderId = número de booking (estable, único, idempotente para el webhook).
  const orderId = booking.numero || bookingId;

  // Formato Bold: SHA-256(orderId + amount + currency + secret), hex lowercase,
  // concatenación directa sin separadores.
  const integritySignature = crypto
    .createHash("sha256")
    .update(`${orderId}${amount}${currency}${cfg.llaveSecreta}`)
    .digest("hex");

  // Registramos el intento de pago. El estado REAL lo cambia el webhook.
  //
  // Rutas punteadas y NO un spread de `pago`: el spread reescribiría cada
  // clave con el valor leído hace un momento y pisaría lo que el webhook
  // hubiera escrito en esa ventana — incluido `pago.saldo.estado`, que
  // volvería de "cobrado" a "pendiente" y haría cobrar dos veces en sede.
  const update = {
    "pago.metodo": "pasarela",
    "pago.pasarela": "bold",
    "pago.boldOrderId": orderId,
    "pago.boldAmount": amount,
    "pago.boldAttemptAt": admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  // Conserva el estado si ya existe uno (podría ser un "aprobado" que el
  // webhook ya escribió); solo lo inicializa si la reserva nunca lo tuvo.
  if (!(booking.pago && booking.pago.estado)) {
    update["pago.estado"] = "iniciado";
  }
  await bookingRef.update(update);

  logger.info("generateBoldHash ok", { bookingId, orderId, amount, currency });

  return {
    orderId,
    amount,
    currency,
    integritySignature,
    apiKey: cfg.llavePublica,
  };
});
