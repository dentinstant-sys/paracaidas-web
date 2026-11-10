import { Link } from "react-router-dom";
import { Icono } from "../Iconos";

// Respaldo por defecto por si Firestore demora o está vacío
const SEDES_FALLBACK = [
  { id: "bogota", city: "Bogotá", zone: "Guaymaral / Villeta", photo: "jumps.jpg" },
  { id: "medellin", city: "Medellín", zone: "Flandes / Aeropuerto", photo: "jump.jpg" },
  { id: "cali", city: "Cali", zone: "Alrededores / Pista", photo: "paq-esencial.jpg" },
  { id: "bucaramanga", city: "Bucaramanga", zone: "Mesa de los Santos", photo: "paq-plus.jpg" },
  { id: "santamarta", city: "Santa Marta", zone: "Costa / Playa", photo: "paq-pro.jpg" },
];

export default function SedesSection({ sedes }) {
  // Si sedes viene vacío o nulo, usamos el respaldo embebido para que nunca desaparezca la sección
  const listaSedes = (sedes && sedes.length > 0) ? sedes : SEDES_FALLBACK;

  // Helper para manejar rutas de imágenes limpias
  const resolverFoto = (photo) => {
    if (!photo) return "/img/jumps.jpg";
    return /^(https?:|\/)/.test(photo) ? photo : `/img/${photo}`;
  };

  return (
    <section id="sedes" className="bg-slate-50 py-28 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Ubicaciones</span>
          <h2 className="font-display mt-2 text-4xl font-extrabold text-slate-900">
            Nuestras zonas de <span className="text-[#008427]">salto</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-sm">
            Coordinamos la pista, avioneta y los equipos en los mejores destinos del país.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {listaSedes.map((s) => (
            <Link key={s.id || s.city} to="/reservar" className="group relative overflow-hidden rounded-3xl bg-slate-900 aspect-[4/5] shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
              <img 
                src={resolverFoto(s.photo)} 
                alt={s.city} 
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-110" 
                onError={(e) => { e.target.src = "/img/jumps.jpg"; }} // Fallback por si la imagen física no existe
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" /> Operativa
                </div>
                <h3 className="font-display mt-3 text-3xl font-extrabold">{s.city}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
                  <Icono name="pin" className="h-3.5 w-3.5 text-emerald-400" />
                  {s.zone || "Pista principal"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}