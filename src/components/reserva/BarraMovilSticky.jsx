export default function BarraMovilSticky({ step, total, accionPaso, onBack }) {
  const money = (n) => "$" + Number(n).toLocaleString("es-CO");

  if (step >= 6 || !accionPaso) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-5 py-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        {step > 1 && (
          <button onClick={onBack} aria-label="Volver" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-700">
            ←
          </button>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</p>
          <p className="font-display text-lg font-bold text-[#008427]">{money(total)}</p>
        </div>
        <button
          onClick={accionPaso.onClick}
          disabled={accionPaso.disabled}
          className="flex-1 rounded-2xl bg-[#008427] py-3 text.sm font-bold text-white shadow-md disabled:opacity-50"
        >
          {accionPaso.label}
        </button>
      </div>
    </div>
  );
}