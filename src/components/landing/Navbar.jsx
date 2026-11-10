import { useState } from "react";
import { Link } from "react-router-dom";
import { Icono } from "../Iconos";

export default function Navbar({ scrolled, onOpenConsulta }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#sedes", label: "Sedes" },
    { href: "#experiencia", label: "La Experiencia" },
    { href: "#recuerdos", label: "Paquetes" },
    { href: "#seguridad", label: "Seguridad" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-4 transition-all duration-300">
      <div className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-6 py-3.5 backdrop-blur-xl transition-all duration-300 ${
        scrolled 
          ? "border-emerald-900/20 bg-white/90 shadow-lg shadow-emerald-950/5" 
          : "border-white/10 bg-[#03190b]/80 text-white shadow-2xl shadow-emerald-950/40"
      }`}>
        {/* Marca / Logo */}
        <a href="#top" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#008427] to-emerald-400 p-0.5 shadow-md transition group-hover:scale-105">
            <img src="/img/logo-condorsky.svg" alt="Vuela Club" className="h-full w-full rounded-[10px] object-cover" />
          </div>
          <span className={`font-display text-xl font-bold tracking-tight ${scrolled ? "text-slate-900" : "text-white"}`}>
            Vuela <span className="text-[#008427]">Club</span>
          </span>
        </a>

        {/* Menú Desktop */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`text-sm font-semibold transition hover:text-[#008427] ${scrolled ? "text-slate-600" : "text-slate-200"}`}>
              {l.label}
            </a>
          ))}
          <button onClick={onOpenConsulta} className={`inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#0038a8] ${scrolled ? "text-slate-700" : "text-white"}`}>
            <Icono name="lupa" className="h-4 w-4 text-[#008427]" /> Estado de reserva
          </button>
          <Link to="/reservar" className="rounded-xl bg-[#008427] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-[#00661e] hover:shadow-[#0038a8]/20 hover:-translate-y-0.5">
            Reservar ahora
          </Link>
        </nav>

        {/* Botón Hambuguesa (Móvil) */}
        <button
          className={`flex h-10 w-10 items-center justify-center rounded-xl lg:hidden transition ${
            scrolled ? "bg-slate-100 text-slate-900" : "bg-white/10 text-white"
          }`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <Icono name={menuOpen ? "equis" : "menu"} className="h-5 w-5" />
        </button>
      </div>

      {/* Desplegable Móvil */}
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl lg:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex py-3.5 text-base font-bold text-slate-800 border-b border-slate-100 last:border-0 hover:text-[#008427]"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenConsulta();
              }}
              className="flex w-full items-center gap-2 py-3.5 text-base font-bold text-slate-800 border-b border-slate-100 hover:text-[#008427] text-left"
            >
              <Icono name="lupa" className="h-4 w-4 text-[#008427]" /> Consultar reserva
            </button>
            <div className="pt-4">
              <Link
                to="/reservar"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-2xl bg-[#008427] py-4 text-center font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-[#00661e]"
              >
                Reservar mi salto
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}