import { Link } from "react-router-dom";
import { Icono, Estrella } from "../Iconos";

export default function RecuerdosSection({ paquetes }) {
  const paqueteHeroe = paquetes.find((p) => p.destacado) || paquetes[0];
  const paquetesResto = paquetes.filter((p) => p !== paqueteHeroe);

  return (
    <section id="recuerdos" className="bg-white py-20 sm:py-28 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 sm:mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Multimedia</span>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Tu salto, contado en <span className="text-[#008427]">imágenes</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-sm">
            Del despegue al aterrizaje, llévate un registro en alta definición para siempre.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 items-stretch">
          {/* Paquete Destacado (Héroe) */}
          {paqueteHeroe && (
            <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-12 text-white flex flex-col justify-end min-h-[380px] sm:min-h-[440px] shadow-2xl">
              {paqueteHeroe.img && (
                <img src={`/img/${paqueteHeroe.img}`} alt={paqueteHeroe.nombre} className="absolute inset-0 h-full w-full object-cover opacity-50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-900">
                  <Estrella className="h-3 w-3" /> Más elegido
                </span>
                <h3 className="font-display mt-4 text-2xl sm:text-3xl font-extrabold">{paqueteHeroe.nombre}</h3>
                <div className="font-display mt-2 text-3xl sm:text-4xl font-extrabold text-emerald-400">{paqueteHeroe.precio} <span className="text-sm font-sans font-semibold text-slate-300">COP</span></div>
                
                <ul className="mt-4 sm:mt-6 space-y-2">
                  {(paqueteHeroe.features || []).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                      <Icono name="check" className="h-4 w-4 text-emerald-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>

                <Link to="/reservar" className="mt-6 sm:mt-8 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-xl transition hover:bg-slate-100">
                  Elegir paquete <Icono name="flecha" className="h-4 w-4 text-slate-900" />
                </Link>
              </div>
            </div>
          )}

          {/* Resto de paquetes */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            {paquetesResto.map((p) => (
              <Link key={p.id} to="/reservar" className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 transition hover:border-[#008427] hover:bg-white hover:shadow-xl">
                <div>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-slate-900">{p.nombre}</h4>
                  <p className="mt-1 text-xs text-slate-500">{(p.features || []).join(" · ")}</p>
                </div>
                <div className="text-right shrink-0 pl-4">
                  <span className="font-display text-xl sm:text-2xl font-extrabold text-[#008427]">{p.precio}</span>
                  <span className="block text-xs font-semibold text-blue-600 group-hover:underline mt-1">Seleccionar →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}