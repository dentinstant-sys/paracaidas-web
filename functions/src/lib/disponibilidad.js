/**
 * disponibilidad.js — confirmación de pago Bold (modelo de disponibilidad MANUAL).
 *
 * El cupo automático fue ELIMINADO: las reservas NUNCA ocupan ni descuentan
 * cupo. La ÚNICA forma de cerrar/abrir una fecha es el bloqueo manual desde el
 * panel (colección `blocked/{sede}/dates/{fechaId}`). Un pago aprobado solo
 * deja la reserva en "confirmada" para que el admin la gestione a mano desde
 * el calendario.
 */

/**
 * Confirma un pago Bold ya aprobado. La transacción se mantiene SOLO por
 * idempotencia/atomicidad (no para contar cupo).
 *
 * Devuelve { accion: "confirmada" | "noop" }.
 *   - noop: el booking no existe o ya no está "pendiente" (idempotencia).
 *   - confirmada: estaba "pendiente" → estado "confirmada" + pago "aprobado".
 */
async function confirmarPagoBold(db, bookingId) {
  const admin = require("firebase-admin");
  const FieldValue = admin.firestore.FieldValue;
  const bookingRef = db.collection("bookings").doc(bookingId);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(bookingRef);
    if (!snap.exists) return { accion: "noop", razon: "no-existe" };
    const b = snap.data();
    if (b.estado !== "pendiente") return { accion: "noop", razon: "no-pendiente" };

    const pago = {
      ...(b.pago || {}),
      estado: "aprobado",
      boldPaidAt: FieldValue.serverTimestamp(),
    };
    tx.set(
      bookingRef,
      { estado: "confirmada", pago, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
    return { accion: "confirmada" };
  });
}

module.exports = { confirmarPagoBold };
