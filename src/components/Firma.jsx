/**
 * Condor Sky — dispositivos visuales FIRMA de la marca.
 *
 * Sistema de 5 dispositivos (gobernanza en la crítica de dirección de arte):
 *   1. MarcadorAltitud — rótulo de sección estilo bitácora de vuelo/altímetro.
 *   2. Cordillera — divisor SVG de doble cadena montañosa, SOLO en fronteras
 *      claro↔oscuro. Vive en la sección saliente; text-* = color de la entrante.
 *   3. Geometría "ala" — esquinas asimétricas (clases en cada página).
 *   4. CondorMarcaAgua — emblema gigante, máximo UNO por viewport y SOLO
 *      sobre fondos oscuros (noche/cumbre).
 *   5. Tipografía editorial — Space Grotesk protagonista (clases en página).
 * Todos son decorativos: aria-hidden, sin rol en el orden de lectura.
 */

export function MarcadorAltitud({ num, titulo, altitud, onDark = false }) {
  const c = onDark ? "text-cielo" : "text-brand";
  return (
    <div className={`flex flex-wrap items-center gap-3 ${c}`}>
      {num && <span className="font-display text-[15px] font-bold tabular-nums tracking-[0.18em]">{num}</span>}
      <svg viewBox="0 0 48 8" className="h-2 w-12 shrink-0" aria-hidden="true">
        {[0, 8, 16, 24, 32, 40, 48].map((x, i) => (
          <line key={x} x1={x} y1={i % 2 ? 3 : 0} x2={x} y2="8" stroke="currentColor" strokeWidth="1.5" />
        ))}
        <line x1="0" y1="7.5" x2="48" y2="7.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="text-[11px] font-bold uppercase tracking-[0.28em]">{titulo}</span>
      {altitud && (
        <span className={`hidden text-[10px] font-semibold uppercase tracking-[0.2em] sm:inline ${onDark ? "text-white/60" : "text-neblina/70"}`}>
          · {altitud}
        </span>
      )}
    </div>
  );
}

export function Cordillera({ className = "" }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-[44px] w-full sm:h-[72px] ${className}`}
    >
      <path d="M0 90 L0 58 L160 30 L300 52 L430 18 L560 46 L720 8 L880 44 L1010 22 L1160 50 L1300 28 L1440 54 L1440 90 Z" fill="currentColor" opacity=".35" />
      <path d="M0 90 L0 70 L120 48 L260 62 L400 34 L540 60 L700 26 L850 58 L990 40 L1150 64 L1290 46 L1440 66 L1440 90 Z" fill="currentColor" />
    </svg>
  );
}

export function CondorMarcaAgua({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
    >
      <path d="M3 9c3-4 6.5-3.5 9-1.5C14.5 5.5 18 5 21 9c-2.5-1.5-5.5-1-9 1.5C8.5 8 5.5 7.5 3 9Z" />
      <path d="M12 10.5v3" />
    </svg>
  );
}

/** Esquinas "ala" (diagonal dominante tl→br) — escala botón y escala marco. */
export const ALA = "rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md";
export const ALA_MARCO = "rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl";
