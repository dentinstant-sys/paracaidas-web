/**
 * Integración Bold — Condor Sky · helpers
 *
 * La configuración de Bold se gestiona desde el panel admin:
 *   - lo público  (activo, llavePublica)        → settings/bold
 *   - lo secreto  (llaveSecreta, webhookSecret) → secrets/bold
 *     (colección cerrada: la lee solo el Admin SDK, nunca el navegador)
 *
 * Sin llaveSecreta configurada:
 *   - `generateBoldHash` rechaza con failed-precondition.
 *   - `boldWebhook` rechaza con 503.
 *
 * El flujo de pago NO se inicia desde el backend (no se llama la API
 * de Bold para crear órdenes). Bold genera el checkout en el frontend
 * mediante su SDK oficial; aquí solo firmamos el hash de integridad
 * (generateBoldHash) y verificamos los webhooks entrantes (boldWebhook).
 */
const admin = require("firebase-admin");

/**
 * Lee la configuración Bold combinando la parte pública y la secreta.
 */
async function getBoldConfig() {
  const db = admin.firestore();
  const [pubSnap, secSnap] = await Promise.all([
    db.collection("settings").doc("bold").get(),
    db.collection("secrets").doc("bold").get(),
  ]);
  const pub = pubSnap.exists ? pubSnap.data() : {};
  const sec = secSnap.exists ? secSnap.data() : {};
  return {
    activo: pub.activo === true,
    llavePublica: pub.llavePublica || "",
    llaveSecreta: sec.llaveSecreta || "",
    webhookSecret: sec.webhookSecret || "",
  };
}

module.exports = { getBoldConfig };
