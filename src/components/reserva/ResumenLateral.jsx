export default function ResumenLateral({ fechaTxt, sedeNombre, baseObj, fotoObj, extrasObj, total }) {
  const money = (n) => "$" + Number(n).toLocaleString("es-CO");

  return (
    <aside className="hidden h-fit lg:sticky lg:top-6 lg:block">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Resumen del salto</span>
        <div className="mt-4 space-y-3 text-xs text-slate-700 border-b border-slate-100 pb-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Fecha:</span>
            <span className="font-bold">{fechaTxt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Sede:</span>
            <span className="font-bold">{sedeNombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Modalidad:</span>
            <span className="font-bold">{baseObj?.nombre}</span>
          </div>
          {fotoObj?.key !== "none" && (
            <div className="flex justify-between">
              <span className="text-slate-500">Fotos:</span>
              <span className="font-bold">{fotoObj?.nombre}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</span>
          <span className="font-display text-2xl font-extrabold text-[#008427]">{money(total)}</span>
        </div>
      </div>
    </aside>
  );
}