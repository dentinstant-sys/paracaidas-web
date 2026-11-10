/**
 * seed-catalogo.cjs — Siembra el catálogo inicial de Condor Sky
 * Proyecto: caidalibre-prod
 *
 * Crea en Firestore los documentos que `crearBooking` necesita para
 * recalcular el total server-side:
 *   - services/{individual, grupo, esencial, plus, pro, trio}
 *   - additionals/{decoracion, pastel, champagne, transporte, almuerzo, brunch}
 *
 * Los precios están alineados a los del frontend (Reservar.jsx y Landing.jsx).
 * Cambiar precios después → editar en Firestore o desde el panel admin.
 *
 * REQUISITOS
 *  - Service account JSON del proyecto caidalibre-prod (el mismo que usaste
 *    para bootstrap-admin.cjs).
 *
 * USO
 *   cd <carpeta-del-sitio>/scripts
 *   node seed-catalogo.cjs <ruta-al-service-account.json>
 */
const admin = require("firebase-admin");

const [, , saPath] = process.argv;
if (!saPath) {
  console.error("Uso: node seed-catalogo.cjs <service-account.json>");
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
const db = admin.firestore();

// --- Catálogo: servicios base ---
const SERVICES_BASE = [
  {
    id: "individual",
    tipo: "base",
    nombre: "Salto Individual",
    descripcion: "Salto tándem individual con instructor certificado USPA. Incluye transporte.",
    precio: 550000,
    activo: true,
    orden: 1,
  },
  {
    id: "grupo",
    tipo: "base",
    nombre: "Promo Grupo x3",
    descripcion: "Salto tándem para 3 personas. Precio total del grupo.",
    precio: 999000,
    activo: true,
    orden: 2,
  },
];

// --- Catálogo: paquetes de fotos/video ---
const SERVICES_FOTOS = [
  {
    id: "esencial",
    tipo: "fotos",
    nombre: "Esencial",
    descripcion: "10 fotos digitales del salto en alta resolución.",
    precio: 90000,
    activo: true,
    orden: 1,
  },
  {
    id: "plus",
    tipo: "fotos",
    nombre: "PLUS HD",
    descripcion: "Esencial + tomas dentro del avión + caída libre y aterrizaje grabados.",
    precio: 140000,
    activo: true,
    orden: 2,
  },
  {
    id: "pro",
    tipo: "fotos",
    nombre: "Pro Experience",
    descripcion: "PLUS + cámara externa + 15 fotos HD extra + certificado digital + entrega prioritaria.",
    precio: 250000,
    activo: true,
    orden: 3,
  },
  {
    id: "trio",
    tipo: "fotos",
    nombre: "Full Experience Trío",
    descripcion: "Pro grupal + video cinematic + tomas grupales + snacks + recuerdo personalizado (3 personas).",
    precio: 500000,
    activo: true,
    orden: 4,
  },
];

// --- Catálogo: adicionales ---
const ADICIONALES = [
  { id: "decoracion", nombre: "Decoración romántica", precio: 60000, unidad: "por pareja", activo: true, orden: 1 },
  { id: "pastel", nombre: "Mini pastel o flores", precio: 80000, unidad: "", activo: true, orden: 2 },
  { id: "champagne", nombre: "Champagne", precio: 130000, unidad: "", activo: true, orden: 3 },
  { id: "transporte", nombre: "Transporte puerta a puerta", precio: 180000, unidad: "", activo: true, orden: 4 },
  { id: "almuerzo", nombre: "Almuerzo especial", precio: 47000, unidad: "por persona", activo: true, orden: 5 },
  { id: "brunch", nombre: "Brunch Experience", precio: 32000, unidad: "por persona", activo: true, orden: 6 },
];

async function seed() {
  const now = admin.firestore.FieldValue.serverTimestamp();
  let created = 0;
  let skipped = 0;

  console.log("Sembrando services/ ...");
  for (const item of [...SERVICES_BASE, ...SERVICES_FOTOS]) {
    const { id, ...data } = item;
    const ref = db.collection("services").doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      console.log(`  · services/${id} ya existe — no se sobreescribe`);
      skipped++;
      continue;
    }
    await ref.set({ ...data, createdAt: now, updatedAt: now });
    console.log(`  ✓ services/${id}  ($${data.precio.toLocaleString("es-CO")})`);
    created++;
  }

  console.log("\nSembrando additionals/ ...");
  for (const item of ADICIONALES) {
    const { id, ...data } = item;
    const ref = db.collection("additionals").doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      console.log(`  · additionals/${id} ya existe — no se sobreescribe`);
      skipped++;
      continue;
    }
    await ref.set({ ...data, createdAt: now, updatedAt: now });
    console.log(`  ✓ additionals/${id}  (+$${data.precio.toLocaleString("es-CO")})`);
    created++;
  }

  console.log(`\nListo: ${created} creados, ${skipped} omitidos (ya existían).`);
}

seed().then(() => process.exit(0)).catch((e) => {
  console.error("Error sembrando:", e.message);
  process.exit(1);
});
