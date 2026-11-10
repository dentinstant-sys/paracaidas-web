import { Icono } from "../Iconos";

export default function Paso5Pago({ total, pago, setPago, error, enviando, boldLoading, onConfirm, onBack }) {
  const money = (n) => "$" + Number(n).toLocaleString("es-CO");

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Paso 05 de 06</span>
        <h1 className="font-display mt-2 text-3xl font-extrabold text-slate-900">Método de pago</h1>
        <p className="mt-1 text-sm text-slate-600">Selecciona cómo deseas procesar el valor de tu reserva.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <button
          onClick={() => setPago("pasarela")}
          className={`rounded-3xl border p-6 text-left transition ${
            pago === "pasarela" ? "border-[#008427] bg-emerald-50/40 shadow-md" : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Icono name="tarjeta" className="h-5 w-5 text-[#008427]" /> Pasarela Bold
          </div>
          <p className="text-xs text-slate-500 mt-2">Tarjetas de crédito/débito, PSE, Nequi o Bancolombia.</p>
        </button>

        <button
          onClick={() => setPago("whatsapp")}
          className={`rounded-3xl border p-6 text-left transition ${
            pago === "whatsapp" ? "border-[#008427] bg-emerald-50/40 shadow-md" : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Icono name="chat" className="h-5 w-5 text-[#008427]" /> WhatsApp Directo
          </div>
          <p className="text-xs text-slate-500 mt-2">Coordinación directa de transferencias o consignaciones por chat.</p>
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="hidden items-center gap-4 lg:flex">
        <button onClick={onBack} className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
          ← Atrás
        </button>
        <button
          onClick={onConfirm}
          disabled={enviando || boldLoading}
          className="flex-1 rounded-2xl bg-[#008427] py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-[#00661e] disabled:opacity-50"
        >
          {enviando ? "Procesando..." : boldLoading ? "Abriendo pasarela..." : pago === "whatsapp" ? "Confirmar reserva por WhatsApp" : `Pagar ${money(total)}`}
        </button>
      </div>
    </div>
  );
}