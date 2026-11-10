import { Icono } from "../Iconos";

export default function Paso3Experiencia({ base, setBase, foto, setFoto, extras, toggleExtra, baseList, fotoList, extraList, onNext, onBack }) {
  const money = (n) => "$" + Number(n).toLocaleString("es-CO");

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Paso 03 de 06</span>
        <h1 className="font-display mt-2 text-3xl font-extrabold text-slate-900">Personaliza tu experiencia</h1>
        <p className="mt-1 text-sm text-slate-600">Elige tu modalidad de salto y súmale recuerdos o detalles especiales.</p>
      </div>

      {/* Paquete Base */}
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Modalidad del salto</p>
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {baseList.map((b) => (
          <button
            key={b.key}
            onClick={() => setBase(b.key)}
            className={`w-full rounded-3xl border p-5 text-left transition ${
              base === b.key ? "border-[#008427] bg-emerald-50/30 shadow-md" : "border-slate-200 bg-white hover:border-emerald-300"
            }`}
          >
            <div className="font-bold text-slate-900 text-base">{b.nombre}</div>
            <div className="font-display text-2xl font-extrabold text-[#008427] mt-1">{money(b.precio)} <span className="text-xs text-slate-500 font-sans">COP</span></div>
            <p className="text-xs text-slate-500 mt-1">{b.sub}</p>
          </button>
        ))}
      </div>

      {/* Fotos / Video */}
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Paquetes de Fotos y Video</p>
      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        {fotoList.map((f) => (
          <button
            key={f.key}
            onClick={() => setFoto(f.key)}
            className={`rounded-2xl border p-4 text-left transition ${
              foto === f.key ? "border-[#008427] bg-emerald-50/30 shadow-sm" : "border-slate-200 bg-white hover:border-emerald-300"
            }`}
          >
            <div className="font-bold text-slate-900 text-sm">{f.nombre}</div>
            <div className="font-display text-lg font-extrabold text-[#008427] mt-1">{f.precio ? money(f.precio) : "Sin costo"}</div>
            <p className="text-xs text-slate-500 mt-1">{f.sub}</p>
          </button>
        ))}
      </div>

      {/* Extras */}
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Adicionales especiales</p>
      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {extraList.map((e) => {
          const on = extras.includes(e.key);
          return (
            <button
              key={e.key}
              onClick={() => toggleExtra(e.key)}
              className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                on ? "border-[#008427] bg-emerald-50/40" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${on ? "bg-[#008427] text-white border-[#008427]" : "border-slate-300"}`}>
                  {on && <Icono name="check" className="h-3.5 w-3.5" />}
                </span>
                <span className="text-sm font-bold text-slate-900">{e.nombre}</span>
              </div>
              <span className="font-display text-sm font-bold text-[#008427]">+{money(e.precio)}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden items-center gap-4 lg:flex">
        <button onClick={onBack} className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
          ← Atrás
        </button>
        <button onClick={onNext} className="flex-1 rounded-2xl bg-[#008427] py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-[#00661e]">
          Continuar a términos →
        </button>
      </div>
    </div>
  );
}