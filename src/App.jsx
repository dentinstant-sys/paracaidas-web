import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";

// División por ruta: el home carga de inmediato; el wizard y los legales
// llegan como chunks aparte solo cuando se visitan (menos JS inicial).
const Reservar = lazy(() => import("./pages/Reservar.jsx"));
const Privacidad = lazy(() => import("./pages/Privacidad.jsx"));
const Terminos = lazy(() => import("./pages/Terminos.jsx"));

export default function App() {
  // Estado de carga con marca mientras baja el chunk de la ruta (en redes
  // lentas, `null` dejaba la pantalla en blanco justo en el CTA del negocio).
  const cargando = (
    <div className="flex min-h-screen items-center justify-center bg-bruma">
      <p className="text-sm font-semibold text-neblina">Cargando…</p>
    </div>
  );

  return (
    <Suspense fallback={cargando}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/reservar" element={<Reservar />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terminos" element={<Terminos />} />
      </Routes>
    </Suspense>
  );
}
