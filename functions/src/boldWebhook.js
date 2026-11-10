/**
 * boldWebhook — Cloud Function (HTTP) · Condor Sky
 *
 * Endpoint público que Bold invoca al cambiar el estado del pago.
 *
 * Seguridad:
 *   - Verifica HMAC-SHA256 sobre el body crudo con webhookSecret (fallback
 *     a llaveSecreta). Cualquier request sin firma válida → 401 antes de
 *     tocar Firestore.
 *
 * Idempotencia:
 *   - Cada evento se persiste en `boldEvents/{eventId}`. Si Bold reenvía
 *     por network retry, respondemos 200 sin duplicar el update.
 *
 * Mapeo de estados Bold → modelo interno de pago:
 *   - APPROVED / SUCCESSFUL          → pago.estado = "aprobado"
 *   - REJECTED / DECLINED / FAILED   → pago.estado = "rechazado"
 *   - VOIDED / REVERSED              → pago.estado = "anulado"
 *   - PENDING / intermedios          → pago.estado = "pendiente"
 *
 * Cuando el pago queda "aprobado" y la reserva sigue "pendiente",
 * automáticamente pasa a "confirmada".
 */
const crypto = require("crypto");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { getBoldConfig } = require("./lib/bold");
const { confirmarPagoBold } = require("./lib/disponibilidad");

const STATUS_MAP = {
  APPROVED: "aprobado",
  SUCCESSFUL: "aprobado",
  REJECTED: "rechazado",
  DECLINED: "rechazado",
  FAILED: "rechazado",
  VOIDED: "anulado",
  REVERSED: "anulado",
  PENDING: "pendiente",
};

exports.boldWebhook = onRequest(
  { region: "us-central1", cors: false, invoker: "public" },
  async (req, res) => {
    if (req.method !== "POST") {
      res.set("Allow", "POST").status(405).send("Method not allowed");
      return;
    }

    // --- 1) Cargar configuración Bold. ---
    let secret;
    try {
      const cfg = await getBoldConfig();
      // El webhook usa preferentemente webhookSecret; si no, llaveSecreta.
      secret = cfg.webhookSecret || cfg.llaveSecreta;
      if (!secret) {
        logger.warn("boldWebhook: Bold sin llaves configuradas");
        res.status(503).send("Bold no configurado");
        return;
      }
    } catch (e) {
      logger.error("boldWebhook: error cargando config", e);
      res.status(503).send("Bold no configurado");
      return;
    }

    // --- 2) Verificar firma HMAC-SHA256 sobre el body crudo. ---
    const signature =
      req.get("x-bold-signature") ||
      req.get("X-Bold-Signature") ||
      req.get("bold-signature");
    const rawBody = req.rawBody; // Cloud Functions v2 expone el body crudo
    if (!signature || !rawBody) {
      logger.warn("boldWebhook: falta firma o body");
      res.status(401).send("Missing signature");
      return;
    }
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    let valid = false;
    try {
      const a = Buffer.from(signature, "hex");
      const b = Buffer.from(expected, "hex");
      valid = a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
      valid = false;
    }
    if (!valid) {
      logger.warn("boldWebhook: firma inválida");
      res.status(401).send("Invalid signature");
      return;
    }

    // --- 3) Parsear payload (con fallbacks para distintos formatos de Bold). ---
    const event = req.body || {};
    const data = event.data || event;
    const orderId =
      (data && data.reference) ||
      (data && data.metadata && data.metadata.reference) ||
      (data && data.orderId) ||
      event.orderId;
    const estadoBold = (data && data.status) || event.status || event.type;
    if (!orderId || !estadoBold) {
      logger.warn("boldWebhook: payload incompleto", { event });
      res.status(400).send("Payload incompleto");
      return;
    }

    const db = admin.firestore();

    // --- 4) Idempotencia: si ya procesamos este eventId, salimos. ---
    const eventId = String(event.id || `${orderId}:${estadoBold}`);
    const procRef = db.collection("boldEvents").doc(eventId);
    const procSnap = await procRef.get();
    if (procSnap.exists) {
      logger.info("boldWebhook: ya procesado", { eventId });
      res.status(200).send("Already processed");
      return;
    }

    // --- 5) Mapear estado Bold → estado interno. ---
    const pagoEstado =
      STATUS_MAP[String(estadoBold).toUpperCase()] || "pendiente";

    // --- 6) Buscar el booking por su boldOrderId. ---
    const q = await db
      .collection("bookings")
      .where("pago.boldOrderId", "==", orderId)
      .limit(1)
      .get();
    if (q.empty) {
      logger.warn("boldWebhook: booking no encontrado", { orderId });
      // Registramos el evento igual, para auditoría.
      await procRef.set({
        orderId,
        estadoBold,
        pagoEstado,
        payload: event,
        recibidoAt: admin.firestore.FieldValue.serverTimestamp(),
        bookingFound: false,
      });
      res.status(404).send("Reserva no encontrada");
      return;
    }

    const doc = q.docs[0];
    const bookingActual = doc.data();
    const FieldValue = admin.firestore.FieldValue;
    const eventoBase = {
      orderId,
      estadoBold,
      pagoEstado,
      payload: event,
      recibidoAt: FieldValue.serverTimestamp(),
      bookingFound: true,
      bookingId: doc.id,
    };
    const metaBold = {
      boldRawStatus: estadoBold,
      boldTxId: (data && data.id) || event.transactionId || null,
      boldUpdatedAt: FieldValue.serverTimestamp(),
    };

    // --- 7) Persistir según el estado del pago. ---
    try {
      if (pagoEstado === "aprobado") {
        // Bold cobró: confirma el pago (idempotente vía transacción). En el
        // modelo MANUAL la reserva pasa a "confirmada" y queda visible en el
        // calendario para que el admin la gestione; no descuenta cupo.
        const resultado = await confirmarPagoBold(db, doc.id);
        // Metadata del evento Bold (confirmarPagoBold no la escribe).
        await doc.ref.set({ pago: metaBold, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        await procRef.set({ ...eventoBase, accion: resultado.accion });
      } else {
        // rechazado / anulado / pendiente: actualiza el pago, sin tocar el
        // estado operativo de la reserva.
        const batch = db.batch();
        batch.set(
          doc.ref,
          {
            pago: { ...(bookingActual.pago || {}), estado: pagoEstado, ...metaBold },
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        batch.set(procRef, eventoBase);
        await batch.commit();
      }
    } catch (e) {
      logger.error("boldWebhook: persistencia falló", {
        orderId,
        estadoBold,
        err: e.message,
      });
      res.status(500).send("Persistence error");
      return;
    }

    logger.info("boldWebhook ok", { orderId, pagoEstado, eventId });
    res.status(200).send("ok");
  }
);
