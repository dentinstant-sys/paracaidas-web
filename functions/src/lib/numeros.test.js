const { test } = require("node:test");
const assert = require("node:assert/strict");
const { PREFIJO, PREFIJOS_VALIDOS, candidatosNumero } = require("./numeros");

test("el prefijo vigente es CSK y CDL sigue siendo válido (validación dual)", () => {
  assert.equal(PREFIJO, "CSK");
  assert.deepEqual(PREFIJOS_VALIDOS, ["CSK", "CDL"]);
});

test("número pelado prueba ambos prefijos, el vigente primero", () => {
  assert.deepEqual(candidatosNumero("48050"), ["CSK-48050", "CDL-48050"]);
});

test("número con prefijo nuevo se respeta tal cual", () => {
  assert.deepEqual(candidatosNumero("CSK-48051"), ["CSK-48051"]);
  assert.deepEqual(candidatosNumero("csk48051"), ["CSK-48051"]);
  assert.deepEqual(candidatosNumero(" csk 48051 "), ["CSK-48051"]);
});

test("número con prefijo viejo (reservas existentes) sigue funcionando", () => {
  assert.deepEqual(candidatosNumero("CDL-48050"), ["CDL-48050"]);
  assert.deepEqual(candidatosNumero("cdl48050"), ["CDL-48050"]);
});

test("basura no produce candidatos", () => {
  assert.deepEqual(candidatosNumero("ABC-123"), []);
  assert.deepEqual(candidatosNumero("CSK-"), []);
  assert.deepEqual(candidatosNumero(""), []);
  assert.deepEqual(candidatosNumero(null), []);
  assert.deepEqual(candidatosNumero("CSKCDL-1"), []);
});
