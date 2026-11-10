/**
 * Firebase — cliente web · Condor Sky (condorsky-web)
 *
 * Este cliente apunta SOLO al proyecto caidalibre-prod.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyAx2BlGHw700bBp30-fy6IHfTYsbyabK-E",
    authDomain: "caidalibre-prod.firebaseapp.com",
    projectId: "caidalibre-prod",
    storageBucket: "caidalibre-prod.firebasestorage.app",
    messagingSenderId: "416159139708",
    appId: "1:416159139708:web:eb8dd81358363ce10f86f9",
    measurementId: "G-MLCMMGYTZ7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const functions = getFunctions(app, "us-central1");

/**
 * Crea un booking (reserva).
 * `datos` = { fecha, sede, cliente, servicioBase, servicioFotos,
 *             adicionales, metodoPago, aceptaTerminos }
 *
 * Devuelve { bookingId, numero, total, metodoPago }.
 *
 * El COBRO no se hace aquí. Tras esta llamada:
 *   - pasarela → invocar startBoldCheckout({ bookingId, numero }) del módulo
 *     `lib/bold.js`. Eso inyecta el script Bold y abre el checkout.
 *   - whatsapp → mostrar pantalla de confirmación.
 */
export async function crearBooking(datos) {
  const fn = httpsCallable(functions, "crearBooking");
  const res = await fn(datos);
  return res.data;
}

/**
 * Consulta UNA reserva por documento + número de reserva (por seguridad, no
 * se puede enumerar PII solo con la cédula). Devuelve
 * { reservas: [{ numero, estado, pagoEstado, fecha, sede }] } (0 o 1 elemento).
 */
export async function consultarBooking(cedula, numero) {
  const fn = httpsCallable(functions, "consultarBooking");
  const res = await fn({ cedula, numero });
  return res.data;
}

/**
 * Fechas cerradas a mano (blocked/{sede}/dates) de una sede. Cada doc-id
 * es una fecha ISO YYYY-MM-DD. Lectura pública permitida por reglas.
 * Si falla → null: el wizard avisa que no pudo verificar disponibilidad
 * (antes devolvía [] en silencio y el calendario mostraba todo abierto;
 * el usuario llenaba 5 pasos para estrellarse en el pago).
 * El backend valida la fecha igual al crear la reserva.
 */
export async function obtenerFechasBloqueadas(sede) {
  if (!sede) return [];
  try {
    const snap = await getDocs(collection(db, "blocked", sede, "dates"));
    return snap.docs.map((d) => d.id);
  } catch {
    return null;
  }
}

/** Número de WhatsApp de respaldo si Firestore no responde. */
const WHATSAPP_RESPALDO = "573180282425";

/**
 * Número de WhatsApp del negocio, leído de settings/general (campo `whatsapp`).
 * Las reglas permiten lectura pública de settings, así que el sitio anónimo
 * puede consultarlo. Devuelve SOLO dígitos, listos para una URL wa.me.
 * Si el documento no existe o la lectura falla, devuelve el número de
 * respaldo para que los botones nunca queden rotos.
 */
export async function obtenerWhatsapp() {
  try {
    const snap = await getDoc(doc(db, "settings", "general"));
    const crudo = snap.exists() ? snap.data().whatsapp : "";
    const digitos = String(crudo || "").replace(/\D/g, "");
    return digitos || WHATSAPP_RESPALDO;
  } catch {
    return WHATSAPP_RESPALDO;
  }
}

/**
 * Sedes de respaldo si Firestore no responde — mismos valores que la semilla
 * del panel (settings/sedes). NO es la fuente de verdad: es solo la red de
 * seguridad para que el sitio nunca quede sin sedes.
 */
const SEDES_FALLBACK = [
  { id: "bogota", city: "Bogotá", zone: "Boyacá", airport: "Aerop. General Gustavo Rojas Pinilla", travel: "~2h desde Bogotá", photo: "/img/sede-bogota.jpg", order: 1, active: true },
  { id: "cali", city: "Cali", zone: "Armenia", airport: "Aerop. Internacional El Edén", travel: "~1h30 desde Cali", photo: "/img/sede-cali.jpg", order: 2, active: true },
  { id: "medellin", city: "Medellín", zone: "Puerto Berrío", airport: "Aerop. La Morela – Puerto Berrío", travel: "~2h desde Medellín", photo: "/img/sede-medellin.jpg", order: 3, active: true },
  { id: "bucaramanga", city: "Bucaramanga", zone: "Barrancabermeja", airport: "Aerop. Yariguíes – Barrancabermeja", travel: "~1h desde Bucaramanga", photo: "/img/sede-bucaramanga.jpg", order: 4, active: true },
  { id: "santamarta", city: "Santa Marta", zone: "", airport: "Aerop. Internacional Simón Bolívar", travel: "~1h30 desde Santa Marta", photo: "/img/sede-santamarta.jpg", order: 5, active: true },
];

/**
 * Sedes activas para el sitio público, leídas de settings/sedes.
 * Devuelve solo `active`, ordenadas por `order`. Si el documento no existe
 * o la lectura falla, usa el respaldo embebido.
 */
export async function obtenerSedes() {
  try {
    const snap = await getDoc(doc(db, "settings", "sedes"));
    const items = snap.exists() ? snap.data().items : null;
    if (!Array.isArray(items) || items.length === 0) {
      return SEDES_FALLBACK.filter((s) => s.active !== false);
    }
    return items
      .filter((s) => s && s.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch {
    return SEDES_FALLBACK.filter((s) => s.active !== false);
  }
}

/**
 * Precios de respaldo — MISMOS valores e ids que la semilla del catálogo
 * (`services` y `additionals`) y que `calcularTotal` server-side. NO es la
 * fuente de verdad: solo la red de seguridad para que la vitrina nunca
 * muestre $0 ni pantalla en blanco si Firestore no responde.
 *
 * CRÍTICO: el `id` de cada item es la doc-key que el backend usa para
 * recalcular y cobrar. La vitrina debe mostrar el precio de ESTE id, para
 * que lo mostrado coincida con lo cobrado.
 */
// Valores sincronizados con el catálogo vivo del panel (sep 2026). Si el
// cliente cambia precios en el panel, este respaldo (y el JSON-LD de
// index.html) deben actualizarse en el siguiente mantenimiento.
const SERVICIOS_FALLBACK = [
  { id: "individual", tipo: "base", nombre: "Salto Individual", precio: 299000, orden: 1 },
  { id: "grupo", tipo: "base", nombre: "Promo Grupo x2", precio: 480000, orden: 2 },
  { id: "esencial", tipo: "fotos", nombre: "Esencial", precio: 75000, orden: 1 },
  { id: "plus", tipo: "fotos", nombre: "PLUS HD", precio: 110000, orden: 2 },
  { id: "pro", tipo: "fotos", nombre: "Pro Experience", precio: 180000, orden: 3 },
  { id: "trio", tipo: "fotos", nombre: "Full Experience Pareja", precio: 400000, orden: 4 },
];

const ADICIONALES_FALLBACK = [
  { id: "decoracion", nombre: "Decoración romántica", precio: 60000, orden: 1 },
  { id: "pastel", nombre: "Mini pastel o flores", precio: 80000, orden: 2 },
  { id: "champagne", nombre: "Champagne", precio: 130000, orden: 3 },
  { id: "transporte", nombre: "Transporte puerta a puerta", precio: 180000, orden: 4 },
  { id: "almuerzo", nombre: "Almuerzo especial", precio: 47000, orden: 5 },
  { id: "brunch", nombre: "Brunch Experience", precio: 32000, orden: 6 },
];

/**
 * Servicios activos (`services`) leídos de Firestore: bases y paquetes de
 * fotos que la vitrina y el wizard muestran. Solo `activo`, ordenados por
 * `orden`. Si la colección está vacía o la lectura falla, usa el respaldo.
 * Mismo patrón que obtenerSedes().
 */
export async function obtenerServicios() {
  try {
    const snap = await getDocs(collection(db, "services"));
    const items = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((s) => s && s.activo !== false);
    if (!items.length) return SERVICIOS_FALLBACK;
    return items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  } catch {
    return SERVICIOS_FALLBACK;
  }
}

/**
 * Adicionales activos (`additionals`) leídos de Firestore. Solo `activo`,
 * ordenados por `orden`, con respaldo embebido. Mismo patrón que obtenerSedes().
 */
export async function obtenerAdicionales() {
  try {
    const snap = await getDocs(collection(db, "additionals"));
    const items = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((a) => a && a.activo !== false);
    if (!items.length) return ADICIONALES_FALLBACK;
    return items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  } catch {
    return ADICIONALES_FALLBACK;
  }
}

/**
 * Testimonios activos (`testimonials`) leídos de Firestore. Solo `activo`,
 * ordenados por `orden`. SIN respaldo: si no hay docs o la lectura falla → []
 * (la sección de testimonios se oculta por completo). Mismo patrón que
 * obtenerSedes() pero sin fallback embebido.
 */
export async function obtenerTestimonios() {
  try {
    const snap = await getDocs(collection(db, "testimonials"));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((t) => t && t.activo !== false)
      .sort((a, b) => (a.orden || 0) - (b.orden || 0));
  } catch {
    return [];
  }
}

/**
 * Galería de respaldo — las 8 fotos de maqueta actuales. Red de seguridad
 * para que la sección nunca quede vacía si `gallery` no responde.
 */
const GALERIA_FALLBACK = [
  { url: "/img/vuelo-3.jpg", alt: "Galería 1" },
  { url: "/img/jump.jpg", alt: "Galería 2" },
  { url: "/img/pexels-tomfisk-11114518.jpg", alt: "Galería 3" },
  { url: "/img/vuelo-4.jpg", alt: "Galería 4" },
  { url: "/img/pexels-tomfisk-12914288.jpg", alt: "Galería 5" },
  { url: "/img/jumps.jpg", alt: "Galería 6" },
  { url: "/img/salto.webp", alt: "Galería 7" },
  { url: "/img/vuelo-1.jpg", alt: "Galería 8" },
];

/**
 * Galería del sitio (`gallery`) leída de Firestore, ordenada por `orden`.
 * Si la colección está vacía o la lectura falla, usa GALERIA_FALLBACK.
 * Mismo patrón que obtenerSedes().
 */
export async function obtenerGaleria() {
  try {
    const snap = await getDocs(collection(db, "gallery"));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (!items.length) return GALERIA_FALLBACK;
    return items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  } catch {
    return GALERIA_FALLBACK;
  }
}
