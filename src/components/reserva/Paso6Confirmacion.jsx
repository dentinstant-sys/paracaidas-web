import { Link } from "react-router-dom";
import { Icono } from "../Iconos";

export default function Paso6Confirmacion({ reservaNum, fechaTxt, sedeNombre, returnedFromBold, whatsappOperador }) {
  return (
    <div className="py-8 max-w-md mx-auto">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="bg-[#03190b] p-8 text-white text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Comprobante de Reserva</span>
          <h2 className="font-display text-4xl font-extrabold text-white mt-2">#{reservaNum}</h2>
          <span className="mt-3 inline-block rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            {returnedFromBold ? "Pago procesado" : "Reserva Registrada"}
          </span>
        </div>

        <div className="p-8 space-y-4 text-sm text-slate-700 border-b border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-500">Fecha:</span>
            <span className="font-bold">{fechaTxt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Sede:</span>
            <span className="font-bold">{sedeNombre}</span>
          </div>
        </div>

        <div className="p-8 text-center bg-slate-50">
          <a
            href={`https://wa.me/${whatsappOperador}?text=${encodeURIComponent(`Hola, confirmo mi reserva #${reservaNum}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#008427] py-4 text-sm font-bold text-white shadow-lg hover:bg-[#00661e]"
          >
            <Icono name="chat" className="h-5 w-5" /> Abrir WhatsApp
          </a>
          <Link to="/" className="block mt-4 text-xs font-bold text-slate-500 hover:text-slate-800">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}