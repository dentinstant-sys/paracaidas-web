/**
 * Números de reserva — Condor Sky.
 *
 * PREFIJO vigente: CSK- (Condor Sky). Las reservas creadas antes del rebrand
 * llevan CDL- (Condor Sky) y SIGUEN siendo válidas: la consulta acepta ambos
 * prefijos (validación dual). El consecutivo sale de un contador global único
 * (settings/contador), así que un mismo número nunca existe con dos prefijos
 * a la vez y la búsqueda por candidatos encuentra a lo sumo una reserva.
 */
const PREFIJO = "CSK";
const PREFIJOS_VALIDOS = ["CSK", "CDL"];

/**
 * Candidatos de búsqueda para el número que escribió el cliente.
 * Acepta "48050", "CSK-48050", "csk48050", "CDL-48050", "cdl 48050"…
 * Sin prefijo → se prueban ambos (el vigente primero). Devuelve [] si el
 * texto no tiene forma de número de reserva.
 */
function candidatosNumero(raw) {
  const n = String(raw || "").trim().toUpperCase().replace(/\s+/g, "");
  if (/^\d+$/.test(n)) return PREFIJOS_VALIDOS.map((p) => `${p}-${n}`);
  const m = n.match(/^(CSK|CDL)-?(\d+)$/);
  return m ? [`${m[1]}-${m[2]}`] : [];
}

module.exports = { PREFIJO, PREFIJOS_VALIDOS, candidatosNumero };
