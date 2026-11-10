import { Icono } from "../Iconos";

export default function SeguridadSection() {
  const seguridad = [
    { icon: "medalla", titulo: "Instructores USPA", texto: "Certificados internacionalmente, con más de 500 saltos cada uno." },
    { icon: "paracaidas", titulo: "Equipos certificados", texto: "Paracaídas equipados con apertura automática e inspección periódica." },
    { icon: "viento", titulo: "Control del clima", texto: "Monitoreo meteorológico en tiempo real. Si no es ideal, reagendamos sin costo." },
    { icon: "escudo", titulo: "Seguro incluido", texto: "Cobertura completa de actividad extrema en cada salto y sede." },
  ];

  return (
    <section id="seguridad" className="bg-[#03190b] py-28 px-4 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#008427]/30 blur-[150px]" />
      
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Confianza absoluta</span>
          <h2 className="font-display mt-2 text-4xl font-extrabold text-white">
            Cero atajos a <span className="text-emerald-400">4.000 metros</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Volar seguro no es un extra: es nuestro estándar diario en cada una de nuestras operaciones en Colombia.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {seguridad.map((s) => (
            <div key={s.titulo} className="rounded-3xl border border-white/10 bg-emerald-950/30 p-8 backdrop-blur-xl transition hover:border-emerald-400/40">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-6">
                <Icono name={s.icon} className="h-7 w-7" />
              </span>
              <h3 className="font-display text-xl font-bold text-white mb-2">{s.titulo}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{s.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}