import { useState } from "react";
import { Icono } from "../Iconos";

export default function FaqSection({ faqs, whatsappLink }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="bg-white py-28 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#008427]">Bitácora</span>
          <h2 className="font-display mt-2 text-4xl font-extrabold text-slate-900">
            Preguntas <span className="text-[#008427]">frecuentes</span>
          </h2>
          <p className="mt-3 text-slate-600 text-sm">Todo lo que necesitas saber antes de tu primer salto.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={f.q} className={`rounded-3xl border transition-all ${openFaq === i ? "border-[#008427] bg-slate-50/50 shadow-md" : "border-slate-200 bg-white"}`}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left font-bold text-slate-900"
              >
                <span>{f.q}</span>
                <Icono name="chevron" className={`h-5 w-5 text-[#008427] transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="px-6 pb-6 text-sm text-slate-600 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-slate-600">
          ¿No encontraste tu respuesta?{" "}
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="font-bold text-[#008427] underline decoration-2 underline-offset-4 hover:opacity-80">
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}