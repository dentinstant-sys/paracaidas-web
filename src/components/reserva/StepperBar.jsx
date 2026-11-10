import { Icono } from "../Iconos";

export default function StepperBar({ steps, currentStep, onSelectStep }) {
  return (
    <div className="border-b border-slate-200 bg-white">
      {/* Desktop Stepper */}
      <div className="mx-auto hidden max-w-6xl items-center gap-1 px-5 py-4 sm:flex sm:px-8">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < currentStep;
          const active = n === currentStep;
          return (
            <div key={label} className="flex min-w-0 flex-1 items-center gap-1">
              <button
                onClick={() => done && onSelectStep(n)}
                disabled={!done}
                className={`flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 transition ${done ? "cursor-pointer hover:bg-emerald-50" : "cursor-default"}`}
              >
                <span className={`font-display text-xs font-extrabold tabular-nums tracking-wider ${active ? "text-[#008427]" : done ? "text-emerald-600" : "text-slate-300"}`}>
                  {done ? <Icono name="check" className="h-4 w-4 text-[#008427]" /> : String(n).padStart(2, "0")}
                </span>
                <span className={`truncate text-xs font-bold uppercase tracking-wider ${active ? "text-slate-900" : done ? "text-slate-600" : "text-slate-300"}`}>
                  {label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 rounded-full ${n < currentStep ? "bg-[#008427]" : "bg-slate-100"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Móvil Stepper */}
      <div className="px-5 py-3 sm:hidden">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-extrabold uppercase text-[#008427]">{steps[currentStep - 1]}</span>
          <span className="text-xs font-bold text-slate-500 tabular-nums">Paso {Math.min(currentStep, 6)} de 6</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#008427] transition-all duration-300" style={{ width: `${(currentStep / 6) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}