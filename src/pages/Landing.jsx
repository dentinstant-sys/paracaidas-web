import { useState, useEffect } from "react";
import { obtenerWhatsapp, obtenerSedes, obtenerServicios, obtenerAdicionales, obtenerTestimonios, obtenerGaleria } from "../lib/firebase.js";
import { usarMeta } from "../lib/meta";
import { Icono } from "../components/Iconos.jsx";

// Componentes modulares
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import SedesSection from "../components/landing/SedesSection";
import ExperienciaSection from "../components/landing/ExperienciaSection";
import SeguridadSection from "../components/landing/SeguridadSection";
import RecuerdosSection from "../components/landing/RecuerdosSection";
import ExtrasSection from "../components/landing/ExtrasSection";
import FaqSection from "../components/landing/FaqSection";
import Footer from "../components/landing/Footer";
import ConsultaModal from "../components/landing/ConsultaModal";

const WHATSAPP_FALLBACK = "573180282425";
const WHATSAPP_MENSAJE = "Hola, quiero reservar un salto con Vuela Club";

const PAQUETES_FALLBACK = [
  { id: "esencial", nombre: "Esencial", precio: "$75.000", img: "paq-esencial.jpg", destacado: false, features: ["10 fotos digitales del salto"] },
  { id: "plus", nombre: "PLUS HD", precio: "$110.000", img: "paq-plus.jpg", destacado: false, features: ["Todo lo del Esencial", "Tomas dentro del avión", "Caída libre y aterrizaje"] },
  { id: "pro", nombre: "Pro Experience", precio: "$180.000", img: "paq-pro.jpg", destacado: true, features: ["Todo lo del PLUS", "Cámara externa + 15 fotos HD", "Certificado digital"] },
  { id: "trio", nombre: "Full Experience Pareja", precio: "$400.000", img: "paq-trio.jpg", destacado: false, features: ["Pro para el grupo", "Video cinematic grupal", "Snacks + recuerdo"] },
];

const EXTRAS_FALLBACK = [
  { id: "decoracion", icon: "flor", nombre: "Decoración romántica", precio: "+$60.000", unidad: "por pareja" },
  { id: "pastel", icon: "pastel", nombre: "Mini pastel o flores", precio: "+$80.000", unidad: "" },
  { id: "champagne", icon: "copa", nombre: "Champagne", precio: "+$130.000", unidad: "" },
  { id: "transporte", icon: "bus", nombre: "Transporte puerta a puerta", precio: "+$180.000", unidad: "" },
  { id: "almuerzo", icon: "cubiertos", nombre: "Almuerzo especial", precio: "+$47.000", unidad: "por persona" },
  { id: "brunch", icon: "cafe", nombre: "Brunch Experience", precio: "+$32.000", unidad: "por persona" },
];

const FAQS = [
  { q: "¿Necesito experiencia previa para saltar?", a: "No se requiere experiencia previa. En el salto tándem vas unido a un instructor USPA certificado que controla todo el proceso." },
  { q: "¿Cuáles son los requisitos físicos?", a: "Edad mínima de 16 años (menores con autorización) y peso menor a 100 kg. Sin condiciones cardíacas severas." },
  { q: "¿Cuánto tiempo dura toda la experiencia?", a: "Aproximadamente de 4 a 5 horas en total: registro, inducción, vuelo en avioneta y el salto." },
  { q: "¿El transporte está incluido?", a: "Los participantes llegan por sus propios medios o pueden contratar el adicional de transporte puerta a puerta." },
  { q: "¿Qué ropa debo usar?", a: "Ropa deportiva cómoda y tenis con suela plana. Nosotros entregamos el overol, casco y arnés." },
  { q: "¿Puedo cambiar o cancelar mi fecha?", a: "Puedes reagendar sin costo hasta 48 horas antes de tu salto programado." },
];

export default function VuelaClubLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [reservaOpen, setReservaOpen] = useState(false);
  const [waNumero, setWaNumero] = useState(WHATSAPP_FALLBACK);
  const [sedes, setSedes] = useState([]);
  const [servicios, setServicios] = useState(null);
  const [adicionales, setAdicionales] = useState(null);

  usarMeta({
    titulo: "Vuela Club — Paracaidismo Tándem Profesional",
    ruta: "/",
  });

  useEffect(() => { obtenerWhatsapp().then(setWaNumero); }, []);
  useEffect(() => { obtenerSedes().then(setSedes); }, []);
  useEffect(() => { obtenerServicios().then(setServicios); obtenerAdicionales().then(setAdicionales); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappLink = `https://wa.me/${waNumero}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;
  const cop = (n) => "$" + Number(n).toLocaleString("es-CO");

  const svcById = servicios ? Object.fromEntries(servicios.map((s) => [s.id, s])) : null;
  const precioIndividual = svcById?.individual?.precio ?? 299000;
  const precioGrupo = svcById?.grupo?.precio ?? 480000;
  const nombreIndividual = svcById?.individual?.nombre ?? "Salto individual";
  const nombreGrupo = svcById?.grupo?.nombre ?? "Promo grupo (2 personas)";

  const presPaqById = Object.fromEntries(PAQUETES_FALLBACK.map((p) => [p.id, p]));
  const paquetes = !servicios ? PAQUETES_FALLBACK : servicios.filter((s) => s.tipo === "fotos").map((s) => {
    const pres = presPaqById[s.id] || {};
    return { ...pres, id: s.id, nombre: s.nombre ?? pres.nombre ?? s.id, precio: cop(s.precio ?? 0), features: pres.features || [] };
  });

  const presExtraById = Object.fromEntries(EXTRAS_FALLBACK.map((e) => [e.id, e]));
  const extrasList = !adicionales ? EXTRAS_FALLBACK : adicionales.map((a) => {
    const pres = presExtraById[a.id] || {};
    return { ...pres, id: a.id, nombre: a.nombre ?? pres.nombre ?? a.id, precio: "+" + cop(a.precio ?? 0), unidad: a.unidad ?? pres.unidad ?? "" };
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-[#008427] selection:text-white">
      <Navbar scrolled={scrolled} onOpenConsulta={() => setReservaOpen(true)} />
      
      <Hero precioIndividual={precioIndividual} whatsappLink={whatsappLink} />
      <SedesSection sedes={sedes} />
      <ExperienciaSection 
        nombreIndividual={nombreIndividual} 
        precioIndividual={precioIndividual} 
        nombreGrupo={nombreGrupo} 
        precioGrupo={precioGrupo} 
      />
      <SeguridadSection />
      <RecuerdosSection paquetes={paquetes} />
      <ExtrasSection extrasList={extrasList} />
      <FaqSection faqs={FAQS} whatsappLink={whatsappLink} />
      
      <Footer sedes={sedes} />

      {/* Botón Flotante WhatsApp */}
      <a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl hover:scale-105 transition-all">
        <Icono name="chat" className="h-7 w-7" />
      </a>

      {/* Modal Consulta */}
      <ConsultaModal isOpen={reservaOpen} onClose={() => setReservaOpen(false)} />
    </div>
  );
}