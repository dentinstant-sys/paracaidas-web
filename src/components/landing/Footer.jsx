import { Link } from "react-router-dom";
import { Icono } from "../Iconos";

// Respaldo estático inmediato para evitar tiempos de espera vacíos en el footer
const SEDES_FALLBACK = [
  { id: "bogota", city: "Bogotá" },
  { id: "medellin", city: "Medellín" },
  { id: "cali", city: "Cali" },
  { id: "bucaramanga", city: "Bucaramanga" },
  { id: "santamarta", city: "Santa Marta" },
];

export default function Footer({ sedes }) {
  // Si la prop 'sedes' viene vacía o aún cargando de Firebase, usamos el respaldo local de inmediato
  const listaSedes = (sedes && sedes.length > 0) ? sedes : SEDES_FALLBACK;

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 sm:py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 border-b border-slate-800 pb-10 sm:pb-12 md:flex-row md:items-end md:justify-between text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#008427] to-emerald-400 p-0.5">
                <img src="/img/logo-condorsky.svg" alt="Vuela Club" className="h-full w-full rounded-[10px] object-cover" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                Vuela <span className="text-emerald-400">Club</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-xs sm:text-sm text-slate-400">
              Paracaidismo tándem profesional en Colombia. Instructores USPA y equipos certificados internacionalmente.
            </p>
          </div>

          <Link to="/reservar" className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#008427] px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#00661e] transition-all">
            Reservar mi salto
          </Link>
        </div>

        <div className="mt-8 sm:mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-sm text-center sm:text-left">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Sedes operativas</h4>
            <ul className="space-y-2">
              {listaSedes.map((s) => (
                <li key={s.id || s.city} className="flex items-center justify-center sm:justify-start gap-2 text-slate-300 text-xs sm:text-sm">
                  <Icono name="pin" className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> {s.city}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Contacto</h4>
            <p className="text-slate-300 text-xs sm:text-sm">WhatsApp: +57 318 028 2425</p>
            <p className="text-slate-300 mt-1 text-xs sm:text-sm">Lun–Dom 7:00 am – 7:00 pm</p>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-6 text-xs text-slate-600 sm:flex-row text-center">
          <div className="flex gap-6">
            <Link to="/privacidad" className="hover:text-slate-400">Política de Privacidad</Link>
            <Link to="/terminos" className="hover:text-slate-400">Términos y Condiciones</Link>
          </div>
          <span>© {new Date().getFullYear()} Vuela Club. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}