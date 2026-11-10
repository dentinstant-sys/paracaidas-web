import { Link } from "react-router-dom";
import { Icono } from "../Iconos";

export default function ExtrasSection({ extrasList }) {
  return (
    <section className="bg-slate-100/60 py-28 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Personalización</span>
          <h2 className="font-display mt-2 text-4xl font-extrabold text-slate-900">
            Detalles que <span className="text-[#008427]">elevan el día</span>
          </h2>
          <p className="mt-3 text-slate-600 text-sm">Súmalos al reservar para hacer tu experiencia inolvidable.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
          <div className="space-y-5">
            {extrasList.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#008427]">
                    <Icono name={e.icon || "destello"} className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{e.nombre}</h4>
                    {e.unidad && <span className="text-xs text-slate-500">{e.unidad}</span>}
                  </div>
                </div>
                <div className="font-display text-lg font-extrabold text-[#008427]">{e.precio}</div>
              </div>
            ))}
          </div>

          <Link to="/reservar" className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#008427] py-4 text-center text-sm font-bold text-white shadow-lg transition hover:bg-[#00661e]">
            <Icono name="destello" className="h-4 w-4" /> Agregar adicionales al reservar
          </Link>
        </div>
      </div>
    </section>
  );
}