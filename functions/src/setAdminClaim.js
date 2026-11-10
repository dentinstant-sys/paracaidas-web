/**
 * setAdminClaim — Cloud Function (callable)
 *
 * Asigna o revoca el rol `admin` (custom claim) a un usuario.
 * Solo puede ejecutarlo alguien que YA es admin.
 *
 * IMPORTANTE: el PRIMER admin debe asignarse una sola vez de forma manual:
 *    - con un script puntual usando Admin SDK, o
 *    - desde la consola de Firebase.
 * A partir de ahí, este endpoint cubre el resto del equipo.
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

exports.setAdminClaim = onCall({ region: "us-central1", invoker: "public" }, async (request) => {
  logger.info("setAdminClaim invoked");
  if (!request.auth || request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "Solo un admin puede asignar roles.");
  }

  const uid = request.data && request.data.uid;
  const esAdmin = request.data && request.data.admin === true;
  if (!uid) {
    throw new HttpsError("invalid-argument", "Falta el uid del usuario.");
  }

  await admin.auth().setCustomUserClaims(uid, { admin: esAdmin });
  return { ok: true, uid, admin: esAdmin };
});
