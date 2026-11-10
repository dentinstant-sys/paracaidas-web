/**
 * Cloud Functions — Condor Sky
 * Proyecto: caidalibre-prod · modelo unificado v2
 *
 * Este código es exclusivo de Condor Sky.
 * Antes de cualquier deploy: `firebase use caidalibre-prod`.
 *
 * Disponibilidad 100% MANUAL. Las reservas no ocupan ni descuentan
 * cupo; la única forma de cerrar una fecha es el bloqueo manual desde el panel
 * (`blocked/{sede}/dates/{fechaId}`). Un pago aprobado solo deja la reserva en
 * "confirmada" para que el admin la gestione a mano.
 *
 * Flujo de pago Bold (frontend-driven, alineado al SDK oficial):
 *   1. crearBooking         — crea la reserva en Firestore.
 *   2. generateBoldHash     — firma server-side; el frontend inyecta el
 *                             script de Bold y abre el checkout.
 *   3. boldWebhook          — Bold notifica; aquí se valida y se confirma.
 */
const admin = require("firebase-admin");

admin.initializeApp();

exports.crearBooking = require("./src/crearBooking").crearBooking;
exports.generateBoldHash = require("./src/generateBoldHash").generateBoldHash;
exports.boldWebhook = require("./src/boldWebhook").boldWebhook;
exports.consultarBooking = require("./src/consultarBooking").consultarBooking;
exports.setAdminClaim = require("./src/setAdminClaim").setAdminClaim;
exports.guardarConfigBold = require("./src/guardarConfigBold").guardarConfigBold;
