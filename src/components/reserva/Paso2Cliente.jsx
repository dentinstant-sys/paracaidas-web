import { Icono } from "../Iconos";

export default function Paso2Cliente({ form, setForm, valMsg2, onNext, onBack }) {
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const inputCls = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-[#008427]";

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Paso 02 de 06</span>
        <h1 className="font-display mt-2 text-3xl font-extrabold text-slate-900">¿Quién salta?</h1>
        <p className="mt-1 text-sm text-slate-600">Datos de contacto para la confirmación de la reserva y póliza de seguro.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Nombre completo *</span>
            <input className={inputCls} placeholder="Ej. Juan García" value={form.nombre} onChange={(e) => setField("nombre", e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Teléfono / WhatsApp *</span>
            <input type="tel" className={inputCls} placeholder="+57 318 028 2425" value={form.telefono} onChange={(e) => setField("telefono", e.target.value)} />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block sm:col-span-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Documento de Identidad *</span>
            <input className={inputCls} placeholder="Ej. 1032456789" value={form.cedula} onChange={(e) => setField("cedula", e.target.value)} />
          </label>
          <label className="block sm:col-span-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Edad *</span>
            <input inputMode="numeric" className={inputCls} placeholder="Ej. 25" value={form.edad} onChange={(e) => setField("edad", e.target.value)} />
          </label>
          <label className="block sm:col-span-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Email (opcional)</span>
            <input type="email" className={inputCls} placeholder="juan@email.com" value={form.email} onChange={(e) => setField("email", e.target.value)} />
          </label>
        </div>

        {valMsg2 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {valMsg2}
          </div>
        )}
      </div>

      <div className="mt-8 hidden items-center gap-4 lg:flex">
        <button onClick={onBack} className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
          ← Atrás
        </button>
        <button onClick={onNext} className="flex-1 rounded-2xl bg-[#008427] py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-[#00661e]">
          Continuar a experiencia →
        </button>
      </div>
    </div>
  );
}