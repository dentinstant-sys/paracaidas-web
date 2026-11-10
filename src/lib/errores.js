/**
 * Errores de Cloud Functions → mensajes amables.
 *
 * El backend lanza HttpsError con mensajes en español SOLO en códigos de
 * negocio (validación, disponibilidad). Cualquier otro código — o un mensaje
 * vacío — cae al genérico: el usuario nunca ve un error crudo de Firebase
 * ("internal", "The service is currently unavailable…", etc.).
 */
const CODIGOS_CON_MENSAJE_PROPIO = new Set([
  "functions/invalid-argument",
  "functions/failed-precondition",
  "functions/not-found",
  "functions/already-exists",
  "functions/out-of-range",
]);

export function mensajeAmable(e, generico) {
  const codigo = e?.code || "";
  const mensaje = (e?.message || "").trim();
  return CODIGOS_CON_MENSAJE_PROPIO.has(codigo) && mensaje ? mensaje : generico;
}
