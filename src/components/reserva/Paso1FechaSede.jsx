import { useState } from "react";
import { Icono } from "../Iconos";

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function Paso1FechaSede({ fecha, setFecha, sede, setSede, sedes, sedesCargando, blocked, dispoError, canNext, onNext }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const shift = (delta) => setView(new Date(year, month + delta, 1));

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Paso 01 de 06</span>
        <h1 className="font-display mt-2 text-3xl font-extrabold text-slate-900">¿Cuándo y dónde saltas?</h1>
        <p className="mt-1 text-sm text-slate-600">Elige primero tu sede para ver la disponibilidad real del calendario.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Calendario */}
        <div className="order-2 lg:order-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display text-base font-bold text-slate-900">{MESES[month]} {year}</span>
            <div className="flex gap-2">
              <button onClick={() => shift(-1)} aria-label="Mes anterior" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-[#008427] hover:text-[#008427]">
                <Icono name="chevronIzq" className="h-4 w-4" />
              </button>
              <button onClick={() => shift(1)} aria-label="Mes siguiente" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-[#008427] hover:text-[#008427]">
                <Icono name="chevronDer" className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {DIAS.map((d) => <div key={d} className="pb-1 text-[11px] font-bold uppercase text-slate-400">{d}</div>)}
            {cells.map((date, i) => {
              if (!date) return <div key={`e${i}`} />;
              const past = date < today;
              const booked = blocked.has(iso(date));
              const isSelected = fecha && iso(fecha) === iso(date);
              const disabled = past || booked;
              let cls = "bg-slate-50 text-slate-800 hover:bg-slate-100";
              if (past) cls = "text-slate-300";
              else if (booked) cls = "bg-red-50 text-red-400 line-through";
              if (isSelected) cls = "bg-[#008427] font-bold text-white shadow-md shadow-emerald-900/30";

              return (
                <button
                  key={iso(date)}
                  disabled={disabled}
                  onClick={() => setFecha(date)}
                  className={`aspect-square min-h-[40px] rounded-xl text-sm tabular-nums transition ${cls} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sedes */}
        <div className="order-1 lg:order-2">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Selecciona tu sede</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {!sedesCargando && sedes.map((s) => {
              const selected = sede === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSede(s.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected ? "border-[#008427] bg-emerald-50/40 shadow-sm" : "border-slate-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Icono name="pin" className="h-4 w-4 text-[#008427]" />
                    {s.city}{s.zone ? ` / ${s.zone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{s.airport || "Pista principal"}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-6 hidden lg:block">
            <button
              onClick={onNext}
              disabled={!canNext}
              className="w-full rounded-2xl bg-[#008427] py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-[#00661e] disabled:opacity-50"
            >
              Continuar a datos personales →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}