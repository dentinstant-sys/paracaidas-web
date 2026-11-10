/**
 * bootstrap-admin-create.cjs — crea el PRIMER administrador y le asigna el rol `admin`.
 * Condor Sky · proyecto caidalibre-prod
 *
 * A diferencia de bootstrap-admin.cjs (que SOLO asigna el claim a un usuario ya
 * existente), este script lo hace TODO en un paso, para correrse UNA SOLA VEZ de
 * forma local:
 *   1. Valida que la service account sea de caidalibre-prod (verificación de proyecto).
 *   2. Crea el usuario en Authentication con una contraseña aleatoria fuerte (20 chars).
 *   3. Le asigna el custom claim { admin: true }.
 *   4. Re-lee el usuario desde Auth y verifica que el claim quedó aplicado.
 *   5. Escribe la credencial (email + contraseña + metadatos) en el archivo de salida,
 *      pensado para el gestor de secretos del negocio (<ruta-de-llaves>). La contraseña NUNCA se
 *      imprime en consola ni se comitea. Si la escritura falla, REVIERTE la creación
 *      del usuario para no dejar una cuenta huérfana con contraseña perdida.
 *
 * REQUISITOS
 *  1. Una clave de service account del proyecto caidalibre-prod (Consola → Configuración
 *     → Cuentas de servicio → Generar clave). Guardar el JSON en el gestor de secretos del negocio.
 *     NUNCA comitearlo ni compartirlo por chat — es una credencial secreta.
 *  2. npm install firebase-admin   (o correr con firebase-admin resoluble desde aquí).
 *
 * USO  (correr en PowerShell — escribe en <ruta-de-llaves>)
 *   node scripts/bootstrap-admin-create.cjs <service-account.json> <email> <ruta-credencial-salida>
 *
 * Ejemplo (PowerShell, ^ continúa línea):
 *   node scripts/bootstrap-admin-create.cjs `
 *     "<ruta-de-llaves>" `
 *     admin@ejemplo.com `
 *     "<ruta-de-llaves>"
 *
 * Códigos de salida: 0 = todo OK · 1 = error/abortado · 2 = usuario creado pero claim no confirmado.
 */
"use strict";
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const EXPECTED_PROJECT = "caidalibre-prod";
const PASSWORD_LENGTH = 20;

/**
 * Genera una contraseña fuerte: `longitud` chars, con al menos una mayúscula,
 * una minúscula, un dígito y un símbolo garantizados. Usa crypto (no Math.random)
 * y excluye caracteres ambiguos (I O l o 0 1) porque el administrador la teclea una vez.
 */
function generarPassword(longitud = PASSWORD_LENGTH) {
  const mayus = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // sin I, O
  const minus = "abcdefghijkmnpqrstuvwxyz"; // sin l, o
  const nums = "23456789"; // sin 0, 1
  const simbolos = "!@#$%^&*()-_=+[]{}";
  const todos = mayus + minus + nums + simbolos;
  const pick = (set) => set[crypto.randomInt(set.length)];
  const chars = [pick(mayus), pick(minus), pick(nums), pick(simbolos)];
  while (chars.length < longitud) chars.push(pick(todos));
  // Mezcla Fisher–Yates con crypto para que las 4 garantizadas no queden al inicio.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

async function main() {
  const admin = require("firebase-admin"); // require diferido: permite testear generarPassword sin instalar el SDK

  const [, , saPath, email, outPath] = process.argv;
  if (!saPath || !email || !outPath) {
    console.error(
      "Uso: node bootstrap-admin-create.cjs <service-account.json> <email> <ruta-credencial-salida>"
    );
    process.exit(1);
  }

  // 1. Carga y valida la service account — verificación de proyecto.
  let sa;
  try {
    sa = require(path.resolve(saPath));
  } catch (e) {
    console.error(`Error: no pude leer la service account en "${saPath}": ${e.message}`);
    process.exit(1);
  }
  if (sa.project_id !== EXPECTED_PROJECT) {
    console.error(
      `ABORTADO · proyecto incorrecto: la service account es del proyecto "${sa.project_id}", ` +
        `se esperaba "${EXPECTED_PROJECT}". No se tocó nada.`
    );
    process.exit(1);
  }

  // 2. Verifica el destino (gestor de secretos) ANTES de crear el usuario: directorio escribible y sin clobber.
  const outAbs = path.resolve(outPath);
  const outDir = path.dirname(outAbs);
  try {
    fs.mkdirSync(outDir, { recursive: true });
    fs.accessSync(outDir, fs.constants.W_OK);
  } catch (e) {
    console.error(`Error: el directorio de salida no es escribible "${outDir}": ${e.message}`);
    process.exit(1);
  }
  if (fs.existsSync(outAbs)) {
    console.error(
      `ABORTADO: ya existe un archivo de credencial en "${outAbs}". No lo sobrescribo. ` +
        `Muévelo o usa otra ruta.`
    );
    process.exit(1);
  }

  admin.initializeApp({ credential: admin.credential.cert(sa) });

  // 3. ¿Ya existe el usuario? Si sí, no lo recreo ni reseteo su contraseña.
  let existente = null;
  try {
    existente = await admin.auth().getUserByEmail(email);
  } catch (e) {
    if (e.code !== "auth/user-not-found") {
      console.error("Error consultando el usuario:", e.message);
      process.exit(1);
    }
  }
  if (existente) {
    console.error(
      `ABORTADO: el usuario ${email} ya existe (uid: ${existente.uid}). Este script es para el ` +
        `PRIMER admin. Para solo asignar el claim a un usuario existente usa bootstrap-admin.cjs.`
    );
    process.exit(1);
  }

  // 4. Crea el usuario con contraseña aleatoria fuerte.
  const password = generarPassword();
  let user;
  try {
    user = await admin.auth().createUser({ email, password, emailVerified: false, disabled: false });
  } catch (e) {
    console.error(`Error creando el usuario ${email}:`, e.message);
    process.exit(1);
  }

  // 5. Asigna el claim admin y verifica RE-LEYENDO de Auth.
  let claimOk = false;
  try {
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    const verificado = await admin.auth().getUser(user.uid);
    claimOk = !!(verificado.customClaims && verificado.customClaims.admin === true);
  } catch (e) {
    console.error(`ADVERTENCIA: usuario creado (uid: ${user.uid}) pero falló el claim: ${e.message}`);
  }

  // 6. Escribe la credencial en el gestor de secretos (única persistencia de la contraseña).
  const fecha = new Date().toISOString();
  const contenido =
    `# Condor Sky — credencial del primer administrador\n` +
    `# GENERADO por bootstrap-admin-create.cjs. NO comitear. NO compartir por chat.\n` +
    `proyecto:      ${EXPECTED_PROJECT}\n` +
    `email:         ${email}\n` +
    `password:      ${password}\n` +
    `uid:           ${user.uid}\n` +
    `claim_admin:   ${claimOk ? "true (verificado)" : "NO CONFIRMADO — revisar manualmente"}\n` +
    `generado:      ${fecha}\n` +
    `nota:          TEMPORAL — el administrador debe cambiarla en su primer ingreso.\n`;
  try {
    fs.writeFileSync(outAbs, contenido, { encoding: "utf8", flag: "wx", mode: 0o600 });
  } catch (writeErr) {
    // Rollback: borra el usuario para no dejar una cuenta con contraseña perdida.
    try {
      await admin.auth().deleteUser(user.uid);
      console.error(
        `Error al escribir la credencial (${writeErr.message}). Se REVIRTIÓ la creación del ` +
          `usuario (uid: ${user.uid}) para no dejar cuenta huérfana. Corrige la ruta y vuelve a correr.`
      );
    } catch (delErr) {
      console.error(
        `Error al escribir la credencial (${writeErr.message}) y TAMBIÉN al revertir (${delErr.message}). ` +
          `El usuario ${email} (uid: ${user.uid}) existe pero su contraseña NO se guardó. Bórralo en la ` +
          `consola y vuelve a correr.`
      );
    }
    process.exit(1);
  }

  // 7. Reporte en consola — SIN la contraseña.
  console.log(`✓ Usuario creado: ${email} (uid: ${user.uid}, emailVerified: false).`);
  console.log(`✓ Claim admin: ${claimOk ? "true (verificado re-leyendo de Auth)" : "NO CONFIRMADO — revisar"}.`);
  console.log(`✓ Credencial guardada en: ${outAbs} (la contraseña NO se imprime).`);
  console.log(`✓ Proyecto: ${EXPECTED_PROJECT}.`);
  console.log("→ El administrador debe cerrar sesión y volver a entrar para que el rol tome efecto, y cambiar la contraseña.");
  process.exit(claimOk ? 0 : 2);
}

if (require.main === module) {
  main().catch((e) => {
    console.error("Error:", e && e.message ? e.message : e);
    process.exit(1);
  });
}

module.exports = { generarPassword, EXPECTED_PROJECT, PASSWORD_LENGTH };
