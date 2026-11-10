/**
 * consultarBooking — Cloud Function (callable) · modelo unificado v2
 *
 * Devuelve el estado de UNA reserva, exigiendo DOS datos que solo tiene el
 * titular: su cédula/documento + el número de reserva (CSK-XXXXX; las
 * reservas anteriores al rebrand con CDL-XXXXX siguen siendo válidas —
 * validación dual, ver lib/numeros.js).
 *
 * SEGURIDAD: antes bastaba la cédula (enumerable) para listar las
 * reservas de una persona → fuga de metadatos de PII. Ahora se busca por el
 * número de reserva (único) y solo se devuelve si la cédula coincide. La
 * respuesta ante cualquier desajuste es UNIFORME (vacía): no revela si el
 * número existe ni a quién pertenece. Solo expone campos NO sensibles.
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { candidatosNumero } = require("./lib/numeros");

exports.consultarBooking = onCall({ region: "us-central1", invoker: "public" }, async (request) => {
  logger.info("consultarBooking invoked");
  const cedula = String((request.data && request.data.cedula) || "").trim();
  // Sin prefijo se prueban CSK- y CDL-; el contador global único garantiza
  // que a lo sumo un candidato existe.
  const candidatos = candidatosNumero(request.data && request.data.numero);

  if (cedula.length < 4 || candidatos.length === 0) {
    throw new HttpsError("invalid-argument", "Ingresa tu documento y el número de reserva (CSK-XXXXX).");
  }

  const db = admin.firestore();
  // Búsqueda por número de reserva (único). Igualdad/`in` simple → auto-indexada.
  const snap = await db.collection("bookings").where("numero", "in", candidatos).limit(1).get();
  if (snap.empty) return { reservas: [] };

  const r = snap.docs[0].data();
  // La cédula DEBE coincidir. Si no, respuesta vacía idéntica (sin filtrar información).
  if (String((r.cliente && r.cliente.cedula) || "").trim() !== cedula) {
    return { reservas: [] };
  }

  return {
    reservas: [
      {
        numero: r.numero,
        estado: r.estado,
        pagoEstado: r.pago ? r.pago.estado : null,
        fecha: r.fecha ? r.fecha.toDate().toISOString().slice(0, 10) : null,
        sede: r.sede,
      },
    ],
  };
});
