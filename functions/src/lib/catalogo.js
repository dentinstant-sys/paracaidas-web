/**
 * Catálogo y precios — Condor Sky (modelo unificado v2)
 *
 * Recalcula el total de un booking desde los precios reales guardados
 * en Firestore (`services` y `additionals`). NUNCA se confía el total
 * que envía el cliente: este módulo es la fuente de verdad del precio.
 */
const admin = require("firebase-admin");

async function calcularTotal({ servicioBase, servicioFotos, adicionales }) {
  const db = admin.firestore();
  const desglose = [];

  // --- Servicio base (obligatorio, tipo "base") ---
  const baseSnap = await db.collection("services").doc(servicioBase).get();
  if (!baseSnap.exists || baseSnap.data().activo === false) {
    throw new Error(`Servicio base inválido: ${servicioBase}`);
  }
  const base = baseSnap.data();
  if (base.tipo !== "base") {
    throw new Error(`El servicio ${servicioBase} no es un paquete base.`);
  }
  desglose.push({ concepto: base.nombre, precio: base.precio });
  let total = base.precio;

  // --- Servicio de fotos / video (opcional, tipo "fotos") ---
  if (servicioFotos && servicioFotos !== "none") {
    const fotosSnap = await db.collection("services").doc(servicioFotos).get();
    if (!fotosSnap.exists || fotosSnap.data().activo === false) {
      throw new Error(`Servicio de fotos inválido: ${servicioFotos}`);
    }
    const f = fotosSnap.data();
    if (f.tipo !== "fotos") {
      throw new Error(`El servicio ${servicioFotos} no es un paquete de fotos.`);
    }
    desglose.push({ concepto: f.nombre, precio: f.precio });
    total += f.precio;
  }

  // --- Adicionales (opcionales) ---
  for (const key of adicionales || []) {
    const adSnap = await db.collection("additionals").doc(key).get();
    if (!adSnap.exists || adSnap.data().activo === false) {
      throw new Error(`Adicional inválido: ${key}`);
    }
    const a = adSnap.data();
    desglose.push({ concepto: a.nombre, precio: a.precio });
    total += a.precio;
  }

  return { total, desglose };
}

module.exports = { calcularTotal };
