import { useState } from "react";
import { consultarBooking } from "../../lib/firebase.js";
import { mensajeAmable } from "../../lib/errores";
import { Icono } from "../Iconos";

export default function ConsultaModal({ isOpen, onClose }) {
  const [consultaCedula, setConsultaCedula] = useState("");
  const [consultaNumero, setConsultaNumero] = useState("");
  const [consultaCargando, setConsultaCargando] = useState(false);
  const [consultaError, setConsultaError] = useState("");
  const [consultaResultado, setConsultaResultado] = useState(null);

  if (!isOpen) return null;

  async function hacerConsulta() {
    const ced = consultaCedula.trim();
    const num = consultaNumero.trim();
    if (!ced || !num) return;
    setConsultaCargando(true);
    setConsultaError("");
    try {
      const data = await consultarBooking(ced, num);
      setConsultaResultado(data || { reservas: [] });
    } catch (e) {
      setConsultaError(mensajeAmable(e, "No pudimos consultar en este momento. Intenta de nuevo."));
    } finally {
      setConsultaCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-extrabold text-slate-900">Estado de reserva</h3>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
            <Icono name="equis" className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-6">Ingresa tu documento y el código de reserva (ej. CSK-48051).</p>

        {!consultaResultado ? (
          <form onSubmit={(e) => { e.preventDefault(); hacerConsulta(); }}>
            <label className="block mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Cédula / Documento</span>
              <input
                type="text"
                value={consultaCedula}
                onChange={(e) => setConsultaCedula(e.target.value)}
                placeholder="Ej. 1032456789"
                className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#008427]"
              />
            </label>
            <label className="block mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Número de reserva</span>
              <input
                type="text"
                value={consultaNumero}
                onChange={(e) => setConsultaNumero(e.target.value)}
                placeholder="Ej. CSK-48051"
                className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-[#008427]"
              />
            </label>
            {consultaError && <p className="mb-4 text-xs text-red-600">{consultaError}</p>}
            <button
              type="submit"
              disabled={consultaCargando || !consultaCedula.trim() || !consultaNumero.trim()}
              className="w-full min-h-[48px] rounded-2xl bg-[#008427] py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#00661e] disabled:opacity-50"
            >
              {consultaCargando ? "Consultando..." : "Consultar estado"}
            </button>
          </form>
        ) : (
          <div>
            {consultaResultado.reservas?.length > 0 ? (
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {consultaResultado.reservas.map((r) => (
                  <div key={r.numero} className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                    <div className="font-display font-bold text-[#008427] text-lg">#{r.numero}</div>
                    <div className="text-sm text-slate-700 mt-1">Estado: <span className="font-semibold">{r.estado}</span></div>
                    <div className="text-xs text-slate-500 mt-1">Fecha: {r.fecha} · Sede: {r.sede}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 mb-6">
                No encontramos reservas asociadas a esos datos. Verifica la información.
              </div>
            )}
            <button
              onClick={() => setConsultaResultado(null)}
              className="w-full min-h-[48px] rounded-2xl border border-slate-200 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Consultar otra reserva
            </button>
          </div>
        )}
      </div>
    </div>
  );
}