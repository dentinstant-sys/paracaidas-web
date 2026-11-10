/**
 * guardarConfigBold — Cloud Function (callable)
 *
 * Permite al admin gestionar TODA la configuración de Bold desde el panel:
 * la llave pública y la llave secreta, cuando quiera.
 *
 * Separación de seguridad:
 *   - lo público  (activo, llavePublica)  → settings/bold  (lo lee el sitio)
 *   - lo secreto  (llaveSecreta)          → secrets/bold   (colección cerrada:
 *       la regla de Firestore es `if false`, así que ningún navegador la lee;
 *       solo el Admin SDK del backend la alcanza)
 *
 * Resultado: el cliente cambia sus llaves cuando quiera desde el panel,
 * sin que la llave secreta quede expuesta en el sitio público.
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

exports.guardarConfigBold = onCall({ region: "us-central1", invoker: "public" }, async (request) => {
  logger.info("guardarConfigBold invoked");
  if (!request.auth || request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "Solo un admin puede configurar Bold.");
  }

  const d = request.data || {};
  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  // --- Parte secreta: solo se reescribe si llega un valor nuevo no vacío ---
  // (si el campo llega vacío, se conserva la llave ya guardada).
  const secreto = {};
  if (typeof d.llaveSecreta === "string" && d.llaveSecreta.trim()) {
    secreto.llaveSecreta = d.llaveSecreta.trim();
  }
  if (typeof d.webhookSecret === "string" && d.webhookSecret.trim()) {
    secreto.webhookSecret = d.webhookSecret.trim();
  }
  if (Object.keys(secreto).length > 0) {
    secreto.updatedAt = now;
    await db.collection("secrets").doc("bold").set(secreto, { merge: true });
  }

  // --- ¿Hay una llave secreta guardada? (solo un booleano para el panel) ---
  const secSnap = await db.collection("secrets").doc("bold").get();
  const secretaConfigurada = secSnap.exists && !!secSnap.data().llaveSecreta;

  // --- Parte pública: la lee el sitio ---
  await db.collection("settings").doc("bold").set(
    {
      activo: d.activo === true,
      llavePublica: typeof d.llavePublica === "string" ? d.llavePublica.trim() : "",
      secretaConfigurada,
      updatedAt: now,
    },
    { merge: true }
  );

  return { ok: true, secretaConfigurada };
});
