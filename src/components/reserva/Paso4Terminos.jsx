export default function Paso4Terminos({ terminos, acepta, setAcepta, canNext, onNext, onBack }) {
  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Paso 04 de 06</span>
        <h1 className="font-display mt-2 text-3xl font-extrabold text-slate-900">Términos y condiciones</h1>
        <p className="mt-1 text-sm text-slate-600">Revisa las normas operativas antes de confirmar tu cupo.</p>
      </div>

      <div className="max-h-80 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 mb-6">
        {terminos.map((t) => (
          <div key={t.t}>
            <h4 className="text-sm font-bold text-slate-900">{t.t}</h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">{t.d}</p>
          </div>
        ))}
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer mb-8">
        <input
          type="checkbox"
          checked={acepta}
          onChange={(e) => setAcepta(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-slate-300 text-[#008427] focus:ring-[#008427]"
        />
        <span className="text-xs text-slate-700 leading-relaxed">
          He leído y acepto los Términos y Condiciones de <b>Vuela Club</b>. Entiendo los requisitos y condiciones del paracaidismo tándem.
        </span>
      </label>

      <div className="hidden items-center gap-4 lg:flex">
        <button onClick={onBack} className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
          ← Atrás
        </button>
        <button onClick={onNext} disabled={!canNext} className="flex-1 rounded-2xl bg-[#008427] py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-[#00661e] disabled:opacity-50">
          Continuar al pago →
        </button>
      </div>
    </div>
  );
}