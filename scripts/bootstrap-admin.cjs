/**
 * bootstrap-admin.js — asigna el rol `admin` al PRIMER administrador.
 * Condor Sky · proyecto caidalibre-prod
 *
 * Se corre UNA SOLA VEZ, de forma local. Después, ese admin habilita
 * al resto del equipo desde el panel (Cloud Function setAdminClaim).
 *
 * REQUISITOS
 *  1. El usuario ya debe existir en Authentication (crearlo en la
 *     consola de Firebase: Authentication → Add user → email + clave).
 *  2. Una clave de service account del proyecto caidalibre-prod:
 *     Consola → Configuración → Cuentas de servicio → Generar clave.
 *     Guardar el JSON en el gestor de secretos del negocio. NUNCA comitearlo ni
 *     compartirlo por chat — es una credencial secreta.
 *
 * USO
 *   npm install firebase-admin
 *   node bootstrap-admin.js <ruta-al-service-account.json> <email-del-admin>
 */
const admin = require("firebase-admin");

const [, , saPath, email] = process.argv;
if (!saPath || !email) {
  console.error("Uso: node bootstrap-admin.js <service-account.json> <email>");
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✓ Rol admin asignado a ${email} (uid: ${user.uid}).`);
    console.log("El usuario debe cerrar sesión y volver a entrar para que el rol tome efecto.");
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
})();
