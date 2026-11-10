import { Link } from "react-router-dom";
import { Icono } from "../Iconos";

export default function ReservaHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#008427] to-emerald-400 p-0.5 shadow-md transition group-hover:scale-105">
            <img src="/img/logo-condorsky.svg" alt="Vuela Club" className="h-full w-full rounded-[10px] object-cover" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            Vuela <span className="text-[#008427]">Club</span>
          </span>
        </Link>
        <Link to="/" className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
          <Icono name="flechaIzq" className="h-3.5 w-3.5 text-[#008427]" /> Volver al inicio
        </Link>
      </div>
    </header>
  );
}