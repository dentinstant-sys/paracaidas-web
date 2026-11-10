import { Link } from "react-router-dom";
import { Icono } from "../Iconos";

export default function ExperienciaSection({ nombreIndividual, precioIndividual, nombreGrupo, precioGrupo }) {
  const cop = (n) => "$" + Number(n).toLocaleString("es-CO");

  const pasos = [
    { icon: "medalla", text: "Instructor certificado USPA" },
    { icon: "paracaidas", text: "Equipo de seguridad completo" },
    { icon: "lista", text: "Inducción y briefing previo" },
    { icon: "avion", text: "Vuelo en avioneta" },
    { icon: "usuarios", text: "Salto tándem profesional" },
    { icon: "diana", text: "Aterrizaje asistido" },
    { icon: "documento", text: "Seguro de actividad" },
  ];

  return (
    <section id="experiencia" className="bg-slate-100/60 py-28 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Briefing</span>
          <h2 className="font-display mt-2 text-4xl font-extrabold text-slate-900">
            Así es tu día de <span className="text-[#008427]">vuelo</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-sm">
            Cada salto incluye todo lo necesario para que tu única tarea sea disfrutar el cielo.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {pasos.map((item, i) => (
              <div key={item.text} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-[#008427]/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#008427] font-bold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-bold text-slate-800 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{nombreIndividual}</span>
              <div className="font-display mt-2 text-4xl font-extrabold text-[#008427]">{cop(precioIndividual)}</div>
              <p className="mt-1 text-xs text-slate-500">COP por pasajero · Todo incluido</p>
            </div>

            <div className="relative rounded-3xl border border-amber-300/60 bg-gradient-to-br from-amber-50/70 to-white p-8 shadow-xl">
              <span className="absolute -top-3 right-6 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-900 shadow-sm">
                Ahorro grupal
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{nombreGrupo}</span>
              <div className="font-display mt-2 text-4xl font-extrabold text-slate-900">{cop(precioGrupo)}</div>
              <p className="mt-1 text-xs text-slate-600">COP total para dos pasajeros</p>

              <Link to="/reservar" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#001c55] py-4 text-center text-sm font-bold text-white shadow-lg transition hover:bg-blue-900">
                <Icono name="calendario" className="h-4 w-4" /> Reservar en pareja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}