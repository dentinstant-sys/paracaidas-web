/**
 * Bold checkout — entry point del frontend (Condor Sky).
 *
 * FLUJO DE 1 CLIC: el usuario hace clic en "Pagar" del paso final y
 * lo llevamos directo a la pasarela por REDIRECCIÓN (sin pantalla intermedia
 * ni segundo botón). Integración personalizada de Bold:
 *   1. crearBooking ya guardó la reserva → tenemos bookingId.
 *   2. Pedimos a `generateBoldHash` (backend) el { orderId, amount, currency,
 *      integritySignature, apiKey }.
 *   3. `new window.BoldCheckout({...})` + `checkout.open()`. Sin `renderMode`,
 *      el default de Bold es REDIRECCIÓN a la pasarela (misma pestaña); al
 *      terminar, Bold devuelve al usuario a `redirectionUrl`.
 *
 * SEGURIDAD (zona dinero):
 *   - La llave SECRETA de Bold NUNCA viaja al navegador. La firma de integridad
 *     (SHA-256 sobre orderId+amount+currency+secret) se calcula SOLO en la
 *     Cloud Function `generateBoldHash` y vuelve ya hasheada. Aquí solo usamos
 *     la llave PÚBLICA (apiKey) y el hash ya firmado.
 *   - El `amount` es el que recalcula el servidor (booking.total, pesos
 *     enteros) y es el MISMO valor que quedó firmado en el hash: si el front
 *     lo alterara, la firma no cuadraría y Bold rechazaría la transacción.
 *   - `orderId` = número de la reserva (lo concilia el webhook por idempotencia).
 */
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

// URL del SDK oficial de Bold. Al cargarse expone `window.BoldCheckout`.
const BOLD_LIBRARY_URL = "https://checkout.bold.co/library/boldPaymentButton.js";

// Promesa cacheada de carga del SDK (idempotente: una sola inyección).
let boldLibPromise = null;

/**
 * Carga el SDK de Bold una sola vez y resuelve cuando `window.BoldCheckout`
 * está disponible. Se invoca al montar el wizard (precarga) y de nuevo en el
 * clic de pago; en ambos casos comparte la misma promesa. Pensado para que en
 * el momento del clic la librería ya esté lista y el redirect sea inmediato.
 *
 * @returns {Promise<void>}
 */
export function loadBoldLibrary() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.BoldCheckout) return Promise.resolve();
  if (boldLibPromise) return boldLibPromise;

  boldLibPromise = new Promise((resolve, reject) => {
    let script = document.querySelector(`script[src="${BOLD_LIBRARY_URL}"]`);

    const settleOk = () => {
      if (window.BoldCheckout) resolve();
      else { boldLibPromise = null; reject(new Error("La librería de Bold cargó pero BoldCheckout no está disponible.")); }
    };
    const settleErr = (msg) => { boldLibPromise = null; reject(new Error(msg)); };

    // Si el script ya existe y el SDK ya está listo, resolvemos de una.
    if (script && window.BoldCheckout) { resolve(); return; }

    if (!script) {
      script = document.createElement("script");
      script.src = BOLD_LIBRARY_URL;
      script.async = true;
      document.head.appendChild(script);
    }

    const timer = setTimeout(() => settleErr("Timeout cargando la librería de Bold."), 15000);
    script.addEventListener("load", () => { clearTimeout(timer); settleOk(); }, { once: true });
    script.addEventListener("error", () => { clearTimeout(timer); settleErr("No se pudo cargar la librería de Bold."); }, { once: true });
  });

  return boldLibPromise;
}

/**
 * Pide el hash al backend y abre el checkout de Bold por REDIRECCIÓN (1 clic).
 *
 * @param {object} args
 * @param {string} args.bookingId - ID de la reserva ya persistida en Firestore.
 * @param {string} args.numero    - Número humano (CSK-XXXXX) para la URL de retorno.
 * @returns {Promise<{ orderId, amount, currency }>}
 */
export async function startBoldCheckout({ bookingId, numero }) {
  if (!bookingId) {
    const err = new Error("No se puede iniciar el pago: la reserva aún no tiene ID.");
    err.code = "BOLD_MISSING_BOOKING_ID";
    throw err;
  }

  // 1) Hash + llave PÚBLICA desde el backend. La reserva, el monto y la firma
  //    se calculan server-side; el cliente NO manda monto.
  const call = httpsCallable(functions, "generateBoldHash");
  let payload;
  try {
    const { data } = await call({ bookingId });
    payload = data;
  } catch (e) {
    const msg = e && e.message ? e.message : "No se pudo iniciar el pago online.";
    const err = new Error(msg);
    err.code = (e && e.code) || "BOLD_CALLABLE_FAILED";
    throw err;
  }

  const { orderId, amount, currency, integritySignature, apiKey } = payload;
  if (!orderId || !amount || !currency || !integritySignature || !apiKey) {
    const err = new Error("Respuesta inválida del servidor de pagos.");
    err.code = "BOLD_BAD_RESPONSE";
    throw err;
  }

  // 2) Aseguramos que el SDK de Bold esté cargado (expone window.BoldCheckout).
  await loadBoldLibrary();
  if (!window.BoldCheckout) {
    const err = new Error("La pasarela de pago no está disponible en este momento.");
    err.code = "BOLD_LIB_UNAVAILABLE";
    throw err;
  }

  // 3) Instancia y abre. SIN `renderMode` → REDIRECCIÓN a la pasarela (default
  //    de Bold). `redirectionUrl` es la MISMA pantalla de retorno que ya usaba
  //    el flujo (/reservar?ref=...), que muestra "¡Pago en proceso!" y el
  //    webhook confirma el estado real.
  const checkout = new window.BoldCheckout({
    orderId,                                  // = booking.numero (lo concilia el webhook)
    currency,                                 // "COP"
    amount: String(amount),                   // pesos enteros (servidor); mismo valor que firmó el hash
    apiKey,                                   // llave PÚBLICA (la secreta jamás llega aquí)
    integritySignature,                       // hash calculado en el backend
    description: `Reserva ${orderId} — Condor Sky`,
    redirectionUrl: `${window.location.origin}/reservar?ref=${encodeURIComponent(numero || orderId)}`,
  });

  // Redirección en la misma pestaña: el bloqueador de pop-ups no aplica.
  checkout.open();

  return { orderId, amount, currency };
}
