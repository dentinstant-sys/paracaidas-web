// src/components/SeparadorVuelo.jsx
export function SeparadorVuelo({ className = "text-[#03190b]" }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block h-10 w-full sm:h-14 lg:h-16"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}