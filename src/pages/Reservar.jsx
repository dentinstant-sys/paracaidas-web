import { useState, useEffect } from "react";
import { crearBooking, obtenerSedes, obtenerServicios, obtenerAdicionales, obtenerFechasBloqueadas } from "../lib/firebase";
import { mensajeAmable } from "../lib/errores";
import { usarMeta } from "../lib/meta";
import { startBoldCheckout, loadBoldLibrary } from "../lib/bold";

// Componentes modulares
import ReservaHeader from "../components/reserva/ReservaHeader";
import StepperBar from "../components/reserva/StepperBar";
import Paso1FechaSede from "../components/reserva/Paso1FechaSede";
import Paso2Cliente from "../components/reserva/Paso2Cliente";
import Paso3Experiencia from "../components/reserva/Paso3Experiencia";
import Paso4Terminos from "../components/reserva/Paso4Terminos";
import Paso5Pago from "../components/reserva/Paso5Pago";
import Paso6Confirmacion from "../components/reserva/Paso6Confirmacion";
import ResumenLateral from "../components/reserva/ResumenLateral";
import BarraMovilSticky from "../components/reserva/BarraMovilSticky";

const STEPS = ["Cuándo y dónde", "Quién salta", "Tu experiencia", "Términos", "Pago", "Confirmación"];
const WHATSAPP_OPERADOR = "573180282425";
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const BASES = [
  { key: "individual", nombre: "Salto Individual", precio: 299000, sub: "por persona" },
  { key: "grupo", nombre: "Promo Grupo x2", precio: 480000, sub: "total para dos personas" },
];

const FOTOS = [
  { key: "none", nombre: "Sin extras", precio: 0, sub: "—" },
  { key: "esencial", nombre: "Esencial", precio: 75000, sub: "10 fotos digitales del salto" },
  { key: "plus", nombre: "PLUS HD", precio: 110000, sub: "Incluye Esencial + avión + aterrizaje" },
  { key: "pro", nombre: "Pro", precio: 180000, sub: "Incluye PLUS + cámara externa + 15 fotos" },
  { key: "trio", nombre: "Full Experience Pareja", precio: 400000, sub: "Incluye Pro + experiencia grupal" },
];

const EXTRAS = [
  { key: "decoracion", nombre: "Decoración romántica", precio: 60000 },
  { key: "pastel", nombre: "Mini pastel o flores", precio: 80000 },
  { key: "champagne", nombre: "Champagne", precio: 130000 },
  { key: "transporte", nombre: "Transporte puerta a puerta", precio: 180000 },
  { key: "almuerzo", nombre: "Almuerzo especial", precio: 47000 },
  { key: "brunch", nombre: "Brunch Experience", precio: 32000 },
];

const TERMINOS = [
  { t: "1. Naturaleza de la actividad", d: "El paracaidismo tándem es una actividad de aventura que conlleva riesgos inherentes." },
  { t: "2. Requisitos físicos", d: "Mínimo 16 años, peso máximo 100 kg, y no haber consumido alcohol en las últimas 24 horas." },
  { t: "3. Cancelaciones", d: "Reagendas gratis hasta 48 horas antes." },
];

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function VuelaClubReservar() {
  const [step, setStep] = useState(1);
  const [valMsg2, setValMsg2] = useState("");
  const [sedes, setSedes] = useState([]);
  const [sedesCargando, setSedesCargando] = useState(true);
  const [dispoError, setDispoError] = useState(false);
  const [servicios, setServicios] = useState(null);
  const [adicionales, setAdicionales] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [sede, setSede] = useState("");
  const [fechasBloqueadas, setFechasBloqueadas] = useState(() => new Set());
  const [form, setForm] = useState({ nombre: "", telefono: "", cedula: "", email: "", edad: "" });
  const [base, setBase] = useState("individual");
  const [foto, setFoto] = useState("none");
  const [extras, setExtras] = useState([]);
  const [acepta, setAcepta] = useState(false);
  const [pago, setPago] = useState("pasarela");
  const [reservaNum, setReservaNum] = useState("");
  const [reservaId, setReservaId] = useState("");
  const [reservaFirma, setReservaFirma] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [boldLoading, setBoldLoading] = useState(false);
  const [returnedFromBold, setReturnedFromBold] = useState("");

  usarMeta({ titulo: "Reserva tu salto — Vuela Club", ruta: "/reservar" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReturnedFromBold(ref);
      setReservaNum(ref);
      setStep(6);
    }
  }, []);

  useEffect(() => {
    obtenerSedes().then((s) => { setSedes(s); setSedesCargando(false); });
    obtenerServicios().then(setServicios);
    obtenerAdicionales().then(setAdicionales);
    loadBoldLibrary().catch(() => {});
  }, []);

  useEffect(() => {
    if (!sede) { setFechasBloqueadas(new Set()); return; }
    let vivo = true;
    obtenerFechasBloqueadas(sede).then((arr) => {
      if (!vivo) return;
      if (arr === null) { setDispoError(true); return; }
      const set = new Set(arr);
      setFechasBloqueadas(set);
      setFecha((f) => (f && set.has(iso(f)) ? null : f));
    });
    return () => { vivo = false; };
  }, [sede]);

  const presBaseById = Object.fromEntries(BASES.map((b) => [b.key, b]));
  const presFotoById = Object.fromEntries(FOTOS.map((f) => [f.key, f]));
  const presExtraById = Object.fromEntries(EXTRAS.map((e) => [e.key, e]));

  const desdeDoc = (pres, doc) => ({
    ...(pres || {}),
    key: doc.id,
    nombre: doc.nombre ?? pres?.nombre ?? doc.id,
    precio: Number(doc.precio) || 0,
    sub: pres?.sub ?? doc.descripcion ?? "",
  });

  const baseList = servicios ? servicios.filter((s) => s.tipo === "base").map((s) => desdeDoc(presBaseById[s.id], s)) : BASES;
  const fotoList = [FOTOS[0], ...(servicios ? servicios.filter((s) => s.tipo === "fotos").map((s) => desdeDoc(presFotoById[s.id], s)) : FOTOS.slice(1))];
  const extraList = adicionales && adicionales.length ? adicionales.map((a) => desdeDoc(presExtraById[a.id], a)) : EXTRAS;

  const baseObj = baseList.find((b) => b.key === base) || baseList[0];
  const fotoObj = fotoList.find((f) => f.key === foto) || fotoList[0];
  const extrasObj = extraList.filter((e) => extras.includes(e.key));
  const total = (baseObj?.precio || 0) + (fotoObj?.precio || 0) + extrasObj.reduce((s, e) => s + e.precio, 0);
  const sedeObj = sedes.find((s) => s.id === sede);
  const sedeNombre = sedeObj ? `${sedeObj.city}${sedeObj.zone ? ` / ${sedeObj.zone}` : ""}` : "—";
  const fechaTxt = fecha ? `${fecha.getDate()} de ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}` : "—";

  const toggleExtra = (k) => setExtras((x) => (x.includes(k) ? x.filter((i) => i !== k) : [...x, k]));

  const canNext = (step === 1 && fecha && sede) || step === 3 || (step === 4 && acepta) || step === 5;
  const goNext = () => { setStep((s) => Math.min(6, s + 1)); window.scrollTo(0, 0); };
  const goBack = () => { setStep((s) => Math.max(1, s - 1)); setError(""); setValMsg2(""); window.scrollTo(0, 0); };

  const continuarPaso2 = () => {
    if (!form.nombre.trim() || !form.telefono.trim() || !form.cedula.trim() || !form.edad.trim()) {
      setValMsg2("Por favor completa los campos obligatorios.");
      return;
    }
    setValMsg2("");
    goNext();
  };

  const firmaActual = JSON.stringify({ fecha: fecha ? iso(fecha) : "", sede, base, foto, extras: [...extras].sort() });

  const confirmarReserva = async () => {
    setError("");
    if (reservaId && reservaFirma === firmaActual && pago === "pasarela") {
      setBoldLoading(true);
      try { await startBoldCheckout({ bookingId: reservaId, numero: reservaNum }); return; }
      catch (err) { setError(mensajeAmable(err, "Error al abrir la pasarela.")); setBoldLoading(false); return; }
    }

    setEnviando(true);
    try {
      const resp = await crearBooking({
        fecha: iso(fecha),
        sede,
        cliente: { nombre: form.nombre, telefono: form.telefono, cedula: form.cedula, email: form.email, edad: form.edad ? Number(form.edad) : null },
        servicioBase: base,
        servicioFotos: foto === "none" ? null : foto,
        adicionales: extras,
        metodoPago: pago,
        aceptaTerminos: acepta,
      });

      setReservaNum(resp.numero);
      setReservaId(resp.bookingId);
      setReservaFirma(firmaActual);

      if (pago === "whatsapp") {
        setStep(6);
        window.scrollTo(0, 0);
        window.open(`https://wa.me/${WHATSAPP_OPERADOR}?text=${encodeURIComponent(`Hola, reservé mi salto #${resp.numero}`)}`, "_blank");
        return;
      }

      setBoldLoading(true);
      await startBoldCheckout({ bookingId: resp.bookingId, numero: resp.numero });
    } catch (e) {
      setError(mensajeAmable(e, "Error al procesar la reserva."));
    } finally {
      setEnviando(false);
    }
  };

  const accionPaso = {
    1: { label: "Continuar", onClick: goNext, disabled: !canNext },
    2: { label: "Continuar", onClick: continuarPaso2, disabled: false },
    3: { label: "Continuar", onClick: goNext, disabled: false },
    4: { label: "Continuar", onClick: goNext, disabled: !canNext },
    5: { label: enviando ? "Procesando..." : boldLoading ? "Redirigiendo..." : pago === "whatsapp" ? "Confirmar por WhatsApp" : "Pagar", onClick: confirmarReserva, disabled: enviando || boldLoading },
  }[step];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <ReservaHeader />
      <StepperBar steps={STEPS} currentStep={step} onSelectStep={setStep} />

      <main className={`mx-auto max-w-6xl px-5 pt-8 ${step < 6 ? "pb-36 lg:pb-12 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8" : "pb-12"}`}>
        <div className="min-w-0">
          {step === 1 && (
            <Paso1FechaSede
              fecha={fecha} setFecha={setFecha} sede={sede} setSede={setSede}
              sedes={sedes} sedesCargando={sedesCargando} blocked={fechasBloqueadas} dispoError={dispoError}
              canNext={canNext} onNext={goNext}
            />
          )}

          {step === 2 && (
            <Paso2Cliente form={form} setForm={setForm} valMsg2={valMsg2} onNext={continuarPaso2} onBack={goBack} />
          )}

          {step === 3 && (
            <Paso3Experiencia
              base={base} setBase={setBase} foto={foto} setFoto={setFoto} extras={extras} toggleExtra={toggleExtra}
              baseList={baseList} fotoList={fotoList} extraList={extraList} onNext={goNext} onBack={goBack}
            />
          )}

          {step === 4 && (
            <Paso4Terminos terminos={TERMINOS} acepta={acepta} setAcepta={setAcepta} canNext={canNext} onNext={goNext} onBack={goBack} />
          )}

          {step === 5 && (
            <Paso5Pago total={total} pago={pago} setPago={setPago} error={error} enviando={enviando} boldLoading={boldLoading} onConfirm={confirmarReserva} onBack={goBack} />
          )}

          {step === 6 && (
            <Paso6Confirmacion reservaNum={reservaNum} fechaTxt={fechaTxt} sedeNombre={sedeNombre} returnedFromBold={returnedFromBold} whatsappOperador={WHATSAPP_OPERADOR} />
          )}
        </div>

        {step < 6 && (
          <ResumenLateral fechaTxt={fechaTxt} sedeNombre={sedeNombre} baseObj={baseObj} fotoObj={fotoObj} extrasObj={extrasObj} total={total} />
        )}
      </main>

      <BarraMovilSticky step={step} total={total} accionPaso={accionPaso} onBack={goBack} />
    </div>
  );
}