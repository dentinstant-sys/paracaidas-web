const { test } = require("node:test");
const assert = require("node:assert/strict");
const { calcularMontos, PORCENTAJE_ABONO, montoACobrarAhora } = require("./pagos");

test("el porcentaje del abono es 50, fijado por los T&C", () => {
  assert.equal(PORCENTAJE_ABONO, 50);
});

test("tipo total cobra el total y no deja saldo", () => {
  assert.deepEqual(calcularMontos(600000, "total"), {
    tipo: "total",
    montoACobrar: 600000,
    saldoPendiente: 0,
  });
});

test("tipo abono cobra la mitad y deja la otra mitad", () => {
  assert.deepEqual(calcularMontos(600000, "abono"), {
    tipo: "abono",
    montoACobrar: 300000,
    saldoPendiente: 300000,
  });
});

test("con total impar, montoACobrar + saldoPendiente sigue siendo el total exacto", () => {
  const r = calcularMontos(600001, "abono");
  assert.equal(r.montoACobrar + r.saldoPendiente, 600001);
});

test("un tipo desconocido cae a total — nunca cobra de menos por un typo", () => {
  assert.equal(calcularMontos(600000, "abonito").tipo, "total");
  assert.equal(calcularMontos(600000, undefined).tipo, "total");
  assert.equal(calcularMontos(600000, null).montoACobrar, 600000);
});

test("un total ausente o basura no revienta y no cobra negativo", () => {
  assert.equal(calcularMontos(undefined, "total").montoACobrar, 0);
  assert.equal(calcularMontos("mil", "abono").montoACobrar, 0);
  assert.equal(calcularMontos(-500, "total").montoACobrar, 0);
});

test("montoACobrarAhora IGNORA montoPreferencia — un cobro nuevo va por el precio de hoy", () => {
  // Esta es la diferencia que importa: si el precio se corrigio, el cobro
  // nuevo tiene que salir por el valor actual, no por el que se pidio antes.
  // (montoPreferencia es un campo historico que bookings viejos de produccion
  // conservan de intentos de pago anteriores.)
  assert.equal(montoACobrarAhora({ total: 600000, pago: { montoACobrar: 300000, montoPreferencia: 250000 } }), 300000);
  assert.equal(montoACobrarAhora({ total: 600000, pago: {} }), 600000);
  assert.ok(Number.isNaN(montoACobrarAhora({ pago: {} })));
});
