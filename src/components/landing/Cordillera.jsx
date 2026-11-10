// src/components/landing/Cordillera.jsx
export default function Cordillera({ className = "text-[#03190b]", flip = false }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""} ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block h-10 w-full sm:h-14 lg:h-20"
      >
        <path
          d="M0,0 L150,40 L350,10 L550,55 L750,20 L950,50 L1200,15 L1200,120 L0,120 Z"
          fill="currentColor"
          className="opacity-25"
        />
        <path
          d="M0,25 L200,60 L420,20 L600,65 L820,30 L1020,55 L1200,20 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}   