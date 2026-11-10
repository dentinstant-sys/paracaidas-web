/**
 * Núcleo de montos de pago (pasarela: Bold).
 *
 * Aquí vive, una sola vez, la regla de cuánto se cobra por una reserva:
 * la usan `crearBooking` (al registrar la modalidad) y `generateBoldHash`
 * (al firmar el monto que se le pide cobrar a Bold).
 */

/**
 * Porcentaje del abono. CONSTANTE, no configuración: está escrito en los
 * Términos y Condiciones publicados del sitio (`src/pages/Terminos.jsx`).
 * Cambiarlo no es mover un campo, es reescribir un documento legal.
 */
const PORCENTAJE_ABONO = 50;

/**
 * Cuánto se cobra en línea y cuánto queda pendiente para la sede.
 *
 * `saldoPendiente` se deriva por RESTA, no por un segundo redondeo: así
 * `montoACobrar + saldoPendiente === total` exactamente, sin hueco de un peso.
 *
 * Tolerante a entradas raras porque lee un documento crudo de Firestore: si el
 * total viene ausente o mal tipado cuenta como cero, y un tipo desconocido cae
 * a "total" — nunca cobra de menos por un error de escritura.
 */
function calcularMontos(total, tipo) {
  const bruto = Number(total);
  const base = Number.isFinite(bruto) && bruto > 0 ? Math.round(bruto) : 0;
  const esAbono = tipo === "abono";
  const montoACobrar = esAbono ? Math.round((base * PORCENTAJE_ABONO) / 100) : base;
  return {
    tipo: esAbono ? "abono" : "total",
    montoACobrar,
    saldoPendiente: base - montoACobrar,
  };
}

/**
 * Cuánto hay que cobrar AHORA por esta reserva.
 *
 * Deliberadamente NO mira `pago.montoPreferencia` (campo histórico que algunos
 * bookings de producción conservan de intentos de pago anteriores): ese campo
 * registra lo que se pidió cobrar en un intento previo y queda pegado al
 * documento. Si el precio de la reserva se corrigiera, mirarlo haría que un
 * cobro nuevo saliera por el monto viejo, en silencio. Siempre se cobra por
 * la modalidad vigente (`pago.montoACobrar`) o, para reservas anteriores al
 * abono, por el total.
 */
function montoACobrarAhora(booking) {
  const pago = (booking && booking.pago) || {};
  const bruto = pago.montoACobrar != null ? pago.montoACobrar : (booking && booking.total);
  const n = Number(bruto);
  return Number.isFinite(n) ? Math.round(n) : NaN;
}

module.exports = {
  PORCENTAJE_ABONO,
  calcularMontos,
  montoACobrarAhora,
};
