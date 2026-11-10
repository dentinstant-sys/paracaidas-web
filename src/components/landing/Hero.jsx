import { Link } from "react-router-dom";
import { Icono } from "../Iconos";

export default function Hero({ precioIndividual, whatsappLink }) {
  const cop = (n) => "$" + Number(n).toLocaleString("es-CO");

  const bgHeroImage = "/img/jump.jpg";

  return (
    <section id="top" className="relative flex min-h-screen items-center bg-[#03190b] px-4 pb-24 pt-36 text-white overflow-hidden">
      {/* Imagen de fondo con alta opacidad para que se vea muy clara */}
      <img
        src={bgHeroImage}
        alt="Paracaidismo tándem Vuela Club"
        className="absolute inset-0 h-full w-full object-cover opacity-80 object-center"
      />

      {/* Gradientes laterales muy sutiles para conservar la lectura sin apagar la foto */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#03190b]/85 via-[#03190b]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03190b]/90 via-transparent to-[#03190b]/60" />

      {/* Luces de fondo verdes de acento */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-[#008427]/30 blur-[140px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/40 bg-emerald-950/60 px-4 py-1.5 text-xs font-bold tracking-wide text-emerald-300 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Paracaidismo Tándem Profesional en Colombia
          </div>

          <h1 className="font-display mt-6 text-[clamp(44px,6.5vw,78px)] font-extrabold uppercase leading-[0.95] tracking-tight drop-shadow-2xl">
            Desafía el cielo. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">Escribe tu historia.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-100 leading-relaxed font-normal drop-shadow-md">
            Siente la velocidad pura en 60 segundos de caída libre a más de 200 km/h. Instructores certificados USPA y equipamiento de nivel internacional.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/reservar" className="inline-flex items-center gap-2 rounded-2xl bg-[#008427] px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/80 transition hover:bg-[#00661e] hover:-translate-y-0.5">
              Reservar mi salto <Icono name="flecha" className="h-5 w-5" />
            </Link>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-black/30 px-7 py-4 text-base font-bold text-white backdrop-blur-md transition hover:bg-black/50 shadow-lg">
              <Icono name="chat" className="h-5 w-5 text-emerald-400" /> WhatsApp Directo
            </a>
          </div>
        </div>

        {/* Tarjeta Glassmorphic */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl border border-white/20 bg-emerald-950/40 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Salto Individual Tándem</span>
              <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-200">Todo incluido</span>
            </div>

            <div className="mt-6">
              <div className="font-display text-5xl font-extrabold text-white drop-shadow">{cop(precioIndividual)}</div>
              <p className="mt-1 text-xs text-slate-200">COP por pasajero · Impuestos y seguros incluidos</p>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "4.000 Metros de altitud de salto",
                "60 Segundos de Caída Libre",
                "Instructores USPA dedicados",
                "Certificado y seguro de actividad",
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 text-sm font-medium text-slate-100">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/30 text-emerald-300">
                    <Icono name="check" className="h-3.5 w-3.5" />
                  </div>
                  {text}
                </div>
              ))}
            </div>

            <Link to="/reservar" className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-center text-sm font-bold text-[#03190b] shadow-xl transition hover:bg-slate-100">
              <Icono name="calendario" className="h-4 w-4" /> Seleccionar fecha
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}