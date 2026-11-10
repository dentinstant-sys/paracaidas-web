/**
 * Política de Privacidad — Vuela Club
 * Cumple estructura de Ley 1581 de 2012 (Habeas Data) y Decreto 1377 de 2013.
 * El correo de contacto sale de la constante CONTACTO_EMAIL.
 */
import { Link } from "react-router-dom";
import { CONTACTO_EMAIL } from "../lib/contacto";
import Cordillera from "../components/landing/Cordillera";
import { usarMeta } from "../lib/meta";

export default function Privacidad() {
  usarMeta({
    titulo: "Política de Privacidad — Vuela Club",
    descripcion: "Cómo Vuela Club recolecta, usa y protege tus datos personales al reservar un salto tándem: finalidades, derechos y canales de contacto.",
    ruta: "/privacidad",
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
          Política de Privacidad
        </h1>
        <p className="mt-3 border-b-2 border-slate-100 pb-5 text-[13.5px] text-slate-500">
          Última actualización: 22 de mayo de 2026 · Vigente a partir de su publicación.
        </p>

        <Section title="1. Responsable del tratamiento">
          <P>
            <b>Vuela Club</b> (en adelante, "la Empresa") es el responsable del tratamiento
            de los datos personales recolectados a través del sitio web{" "}
            <b>vuelaclub.co</b> y de sus canales institucionales de atención.
          </P>
          <P>
            Para cualquier solicitud relacionada con sus datos personales, los titulares pueden
            comunicarse a través de:
          </P>
          <UL>
            {CONTACTO_EMAIL && <li>Correo electrónico: <b>{CONTACTO_EMAIL}</b></li>}
            <li>WhatsApp: <b>+57 318 028 2425</b></li>
          </UL>
        </Section>

        <Section title="2. Marco legal">
          <P>
            Esta política se rige por la <b>Ley 1581 de 2012</b>, el <b>Decreto 1377 de 2013</b> y
            las demás normas concordantes de la República de Colombia que regulan la protección de
            datos personales.
          </P>
        </Section>

        <Section title="3. Datos personales que recolectamos">
          <P>Durante el proceso de reserva y operación del servicio de salto, recolectamos:</P>
          <UL>
            <li>Datos de identificación: nombre, documento de identidad y edad.</li>
            <li>Datos de contacto: teléfono celular y correo electrónico.</li>
            <li>Información operativa de la reserva: fecha del salto, sede elegida, paquete de medios y adicionales.</li>
            <li>Información de pago: a través de la pasarela autorizada <b>Bold</b>, sin que la Empresa almacene datos sensibles de tarjetas o cuentas en sus servidores.</li>
            <li>Información médica relevante para la actividad deportiva, si el titular decide compartirla voluntariamente por seguridad.</li>
          </UL>
        </Section>

        <Section title="4. Finalidades del tratamiento">
          <P>Los datos personales son tratados con las siguientes finalidades:</P>
          <UL>
            <li>Gestionar y confirmar reservas de los servicios de paracaidismo tándem.</li>
            <li>Procesar pagos de forma segura a través de la pasarela autorizada.</li>
            <li>Coordinar la operación logística del salto (coordinación de pista, avioneta, horario y briefing de seguridad).</li>
            <li>Cumplir con requisitos de seguridad y trazabilidad aeronáutica propios de la actividad.</li>
            <li>Enviar comunicaciones operativas relacionadas con la reserva.</li>
            <li>Atender solicitudes, consultas, quejas y reclamos.</li>
            <li>Dar cumplimiento a obligaciones legales, contables y fiscales en Colombia.</li>
          </UL>
          <P className="mt-3">
            La Empresa no comparte ni comercializa datos personales a terceros con fines publicitarios.
            Únicamente se comparten con proveedores de servicios estrictamente necesarios para la operación
            (pasarela de pagos, infraestructura en la nube), bajo acuerdos formales de confidencialidad.
          </P>
        </Section>

        <Section title="5. Derechos del titular">
          <P>De conformidad con la Ley 1581 de 2012, el titular tiene derecho a:</P>
          <UL>
            <li>Conocer, actualizar y rectificar sus datos personales frente a la Empresa.</li>
            <li>Solicitar prueba de la autorización otorgada para el tratamiento de sus datos.</li>
            <li>Ser informado sobre el uso exacto que se le ha dado a su información.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la normativa vigente.</li>
            <li>Revocar la autorización y/o solicitar la supresión de sus datos, salvo cuando exista un deber legal o contractual que justifique su conservación.</li>
            <li>Acceder de forma gratuita a sus datos personales objeto de tratamiento.</li>
          </UL>
        </Section>

        <Section title="6. Procedimiento para ejercer los derechos">
          <P>
            El titular podrá ejercer sus derechos enviando una solicitud formal{" "}
            {CONTACTO_EMAIL && <>al correo <b>{CONTACTO_EMAIL}</b> o{" "}</>}al WhatsApp{" "}
            <b>+57 318 028 2425</b>, indicando:
          </P>
          <UL>
            <li>Nombre completo y número de documento de identidad.</li>
            <li>Descripción clara y detallada de la solicitud (consulta, actualización, rectificación o supresión).</li>
            <li>Datos de contacto para la respuesta.</li>
          </UL>
          <P className="mt-3">
            Las consultas serán atendidas en un término máximo de <b>diez (10) días hábiles</b>; los
            reclamos, en un término máximo de <b>quince (15) días hábiles</b> contados a partir del
            día siguiente a la recepción de la solicitud.
          </P>
        </Section>

        <Section title="7. Conservación de los datos">
          <P>
            Los datos personales se conservarán durante el tiempo que resulte necesario para cumplir las
            finalidades operativas del tratamiento y atender obligaciones legales, contables, fiscales o
            contractuales. Cumplidas estas finalidades, la información será eliminada de forma segura.
          </P>
        </Section>

        <Section title="8. Medidas de seguridad">
          <P>
            La Empresa aplica medidas técnicas, humanas y administrativas para proteger la información contra
            accesos no autorizados, pérdida, alteración o uso indebido. Los datos se almacenan en infraestructura
            de alta seguridad (Google Cloud / Firebase), con cifrado de información tanto en tránsito como en reposo.
          </P>
        </Section>

        <Section title="9. Tratamiento de datos de menores de edad">
          <P>
            Vuela Club no presta servicios a menores de edad sin la autorización escrita y previa de sus padres
            o tutores legales. Para los menores autorizados aplican las mismas garantías descritas en esta política,
            las cuales deben ser ejercidas por sus representantes.
          </P>
        </Section>

        <Section title="10. Cambios en la política">
          <P>
            La Empresa se reserva el derecho de modificar esta política en cualquier momento. Cualquier actualización
            será publicada en este sitio web y entrará en vigor desde su publicación.
          </P>
        </Section>

        <Section title="11. Aceptación">
          <P>
            Al hacer uso de la plataforma web y/o realizar una reserva en Vuela Club, el titular declara haber leído,
            entendido y aceptado los términos de esta Política de Privacidad, autorizando el tratamiento de sus datos.
          </P>
        </Section>

        <div className="mt-11 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-sm text-slate-600">
          ¿Tienes preguntas sobre el manejo de tus datos? Escríbenos por WhatsApp al <b className="text-slate-900">+57 318 028 2425</b>
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