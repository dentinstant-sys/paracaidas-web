/**
 * Términos y Condiciones — Vuela Club
 * Marco general para la prestación del servicio de paracaidismo tándem.
 * El correo de contacto sale de la constante CONTACTO_EMAIL.
 */
import { Link } from "react-router-dom";
import { CONTACTO_EMAIL } from "../lib/contacto";
import Cordillera from "../components/landing/Cordillera";
import { usarMeta } from "../lib/meta";

export default function Terminos() {
  usarMeta({
    titulo: "Términos y Condiciones — Vuela Club",
    descripcion: "Términos y condiciones del servicio de paracaidismo tándem de Vuela Club: reservas, pagos, cancelaciones, requisitos y uso de imagen.",
    ruta: "/terminos",
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased font-sans">
      <LegalHeader />
      <div className="bg-white text-[#03190b]" aria-hidden="true">
        <Cordillera className="h-[22px] sm:h-[32px]" />
      </div>

      <main className="mx-auto max-w-[760px] px-5 py-12 sm:px-6 sm:py-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#008427] border border-emerald-200 mb-2">
          <span>Bitácora legal</span>
        </div>
        <h1 className="font-display text-[clamp(32px,6vw,50px)] font-bold leading-[1.05] text-slate-900">
          Términos y Condiciones
        </h1>
        <p className="mt-3 border-b-2 border-slate-100 pb-5 text-[13.5px] text-slate-500">
          Última actualización: 22 de mayo de 2026 · Vigentes a partir de su publicación.
        </p>

        <Section title="1. Identificación del prestador">
          <P>
            El servicio de paracaidismo tándem ofrecido a través del sitio web{" "}
            <b>vuelaclub.co</b> es prestado por <b>Vuela Club</b> (en adelante,
            "la Empresa"). Toda comunicación oficial se realiza a través{" "}
            {CONTACTO_EMAIL ? <>del correo <b>{CONTACTO_EMAIL}</b> y el</> : "del"} WhatsApp{" "}
            <b>+57 318 028 2425</b>.
          </P>
        </Section>

        <Section title="2. Descripción del servicio">
          <P>
            La Empresa ofrece experiencias de paracaidismo tándem en cinco sedes de Colombia:
            Bogotá, Cali, Medellín, Bucaramanga y Santa Marta. La actividad se realiza junto a un
            instructor certificado por la <b>United States Parachute Association (USPA)</b> e
            incluye briefing previo, vuelo en avioneta, salto en modalidad tándem y aterrizaje
            asistido.
          </P>
          <P className="mt-3">
            La descripción detallada del paquete, los adicionales contratados y el precio total se
            confirman en el momento de la reserva.
          </P>
        </Section>

        <Section title="3. Reservas y pagos">
          <P>El proceso de reserva se realiza a través del sitio web o por WhatsApp. El cliente puede elegir entre dos modalidades de pago:</P>
          <UL>
            <li><b>Pago total:</b> el cliente cancela el 100% del valor al momento de la reserva.</li>
            <li><b>Abono del 50%:</b> el cliente cancela el cincuenta por ciento (50%) del valor
              total como abono al momento de la reserva, y el saldo restante el día del salto, en
              sede, antes del briefing.</li>
          </UL>
          <P className="mt-3">
            Los pagos en línea se procesan a través de la pasarela <b>Bold</b>, autorizada por la
            Superintendencia Financiera de Colombia. La reserva se considera confirmada únicamente
            tras la verificación efectiva del pago o abono.
          </P>
        </Section>

        <Section title="4. Política de cancelación y reagendamiento">
          <P>
            El cliente puede <b>reagendar gratuitamente</b> su reserva hasta cuarenta y ocho (48)
            horas antes de la hora programada del salto, sujeto a disponibilidad en sede y fecha.
            Los reagendamientos solicitados con menos de 48 horas de anticipación quedan a criterio
            de la Empresa y pueden estar sujetos a un cargo administrativo.
          </P>
          <P className="mt-3">
            <b>Cancelaciones por parte del cliente:</b> las cancelaciones con más de cuarenta y
            ocho (48) horas de anticipación dan derecho a reagendar sin costo o a un crédito por el
            valor pagado, válido durante los seis (6) meses siguientes. Las cancelaciones con menos
            de 48 horas de anticipación retienen el cincuenta por ciento (50%) del valor como
            compensación por la operación ya preparada.
          </P>
          <P className="mt-3">
            <b>Cancelaciones por causas climáticas u operativas:</b> si la Empresa cancela el salto
            por condiciones meteorológicas adversas, fallas técnicas o cualquier causa de seguridad,
            el cien por ciento (100%) del valor pagado queda disponible para reagendar sin costo.
          </P>
        </Section>

        <Section title="5. Restricciones para la práctica">
          <P>Por razones de seguridad operativa, el cliente declara cumplir las siguientes condiciones:</P>
          <UL>
            <li>Tener al menos <b>dieciséis (16) años cumplidos</b>. Los menores de 18 años
              requieren autorización expresa de padres o representantes legales, por escrito.</li>
            <li>No exceder los límites de peso indicados por la Empresa al momento de la reserva
              (estándar: hasta <b>100 kg</b>; sujeto a confirmación operativa).</li>
            <li>No padecer afecciones cardíacas graves, hipertensión no controlada, epilepsia,
              lesiones recientes de columna o cualquier condición médica incompatible con la
              actividad.</li>
            <li>No estar bajo los efectos del alcohol ni de sustancias psicoactivas al momento del
              salto.</li>
            <li>Para mujeres: no encontrarse en estado de embarazo.</li>
          </UL>
          <P className="mt-3">
            La Empresa se reserva el derecho de cancelar la actividad, sin reembolso, si verifica el
            incumplimiento de alguna de estas condiciones.
          </P>
        </Section>

        <Section title="6. Consentimiento informado y exoneración de responsabilidad">
          <P>
            El paracaidismo es una actividad de aventura que conlleva riesgos inherentes. El
            cliente reconoce, acepta y asume voluntariamente dichos riesgos al contratar el
            servicio. Antes del salto, el cliente firmará un documento de <b>consentimiento
            informado</b> en sede, en el cual declara conocer los riesgos y los protocolos de
            seguridad.
          </P>
          <P className="mt-3">
            La Empresa cumple con los protocolos de seguridad de la actividad, mantiene equipos
            certificados, realiza inspecciones periódicas y cuenta con instructores certificados.
            No obstante, la Empresa no responde por daños derivados de la omisión por parte del
            cliente de información médica relevante, del incumplimiento de las indicaciones de
            seguridad del instructor o de hechos imputables al cliente o a terceros.
          </P>
        </Section>

        <Section title="7. Seguro de actividad">
          <P>
            Cada salto incluye un seguro de actividad conforme a los términos definidos por la
            aseguradora vigente al momento de la reserva. El alcance, las coberturas y las
            exclusiones del seguro pueden consultarse en sede antes del salto.
          </P>
        </Section>

        <Section title="8. Uso de imagen y material audiovisual">
          <P>
            Cuando el cliente contrate adicionales de fotografía o video, las imágenes y videos
            resultantes son de uso personal. Si el cliente desea que la Empresa utilice su imagen
            con fines publicitarios, deberá firmar una autorización expresa y por escrito. En
            ausencia de dicha autorización, la Empresa no utilizará la imagen del cliente.
          </P>
        </Section>

        <Section title="9. Propiedad intelectual">
          <P>
            Todos los contenidos del sitio web (marca, logotipos, textos, imágenes y diseño) son
            propiedad de la Empresa o de sus titulares legítimos. Está prohibido su uso,
            reproducción o distribución sin autorización previa por escrito.
          </P>
        </Section>

        <Section title="10. Modificaciones a los términos">
          <P>
            La Empresa podrá modificar estos Términos y Condiciones en cualquier momento. Las
            modificaciones se publicarán en este sitio y entrarán en vigencia desde su publicación.
            Las reservas ya confirmadas se rigen por los términos vigentes al momento de su
            confirmación.
          </P>
        </Section>

        <Section title="11. Legislación aplicable y jurisdicción">
          <P>
            Estos Términos y Condiciones se rigen por las leyes de la República de Colombia.
            Cualquier controversia derivada de la prestación del servicio se someterá a los jueces
            competentes del domicilio del prestador, sin perjuicio de los derechos del consumidor
            establecidos en la Ley 1480 de 2011 (Estatuto del Consumidor).
          </P>
        </Section>

        <Section title="12. Aceptación">
          <P>
            Al realizar una reserva a través del sitio web, el cliente declara haber leído,
            comprendido y aceptado en su totalidad los presentes Términos y Condiciones, así como
            la <Link to="/privacidad" className="text-[#008427] font-bold hover:underline">Política de Privacidad</Link>.
          </P>
        </Section>

        <div className="mt-11 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-sm text-slate-600">
          ¿Preguntas? Escríbenos por WhatsApp al <b className="text-slate-900">+57 318 028 2425</b>
          {CONTACTO_EMAIL && <> o al correo <b className="text-slate-900">{CONTACTO_EMAIL}</b></>}.
        </div>

        <Link to="/" className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[#008427] hover:underline">
          ← Volver al inicio
        </Link>
      </main>

      <LegalFooter />
    </div>
  );
}

/* ---------- Partes compartidas ---------- */

function LegalHeader() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-[1000px] items-center justify-between px-5 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#008427] to-emerald-400 p-0.5">
            <img src="/img/logo-condorsky.svg" alt="Vuela Club" className="h-full w-full rounded-[10px] object-cover" />
          </div>
          <b className="font-display text-[19px] font-bold tracking-tight text-slate-900">
            Vuela <span className="text-[#008427]">Club</span>
          </b>
        </Link>
        <Link to="/reservar" className="rounded-xl bg-[#008427] px-[18px] py-2.5 text-[13px] font-bold text-white transition hover:bg-[#00661e]">
          Reservar
        </Link>
      </div>
    </header>
  );
}

function LegalFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center justify-between gap-2.5 px-5 py-6 text-[12.5px] sm:flex-row sm:px-6">
        <span>© {new Date().getFullYear()} Vuela Club. Todos los derechos reservados.</span>
        <div className="flex gap-5">
          <Link to="/privacidad" className="hover:text-slate-200">Privacidad</Link>
          <Link to="/terminos" className="hover:text-slate-200">Términos</Link>
        </div>
      </div>
    </footer>
  );
}

function Section({ title, children }) {
  const m = title.match(/^(\d+)\.\s*(.*)$/);
  return (
    <section className="mt-9">
      <h2 className="font-display flex items-baseline gap-3 text-[20px] font-bold text-slate-900">
        {m ? <><span className="min-w-[24px] text-[15px] font-bold text-[#008427]">{m[1]}</span>{m[2]}</> : title}
      </h2>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function P({ children, className = "" }) {
  return <p className={`text-[14.5px] leading-[1.7] text-slate-700 ${className}`}>{children}</p>;
}

function UL({ children }) {
  return <ul className="ml-5 mt-2.5 list-disc space-y-2 text-[14px] leading-relaxed text-slate-700 marker:text-[#008427]">{children}</ul>;
}