export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Grid lines — horizontal */}
      <line x1="44" y1="44"  x2="156" y2="44"  stroke="#4ADEB5" strokeWidth="1.5" strokeOpacity="0.28" />
      <line x1="44" y1="100" x2="156" y2="100" stroke="#4ADEB5" strokeWidth="1.5" strokeOpacity="0.28" />
      <line x1="44" y1="156" x2="156" y2="156" stroke="#4ADEB5" strokeWidth="1.5" strokeOpacity="0.28" />

      {/* Grid lines — vertical */}
      <line x1="44"  y1="44" x2="44"  y2="156" stroke="#4ADEB5" strokeWidth="1.5" strokeOpacity="0.28" />
      <line x1="100" y1="44" x2="100" y2="156" stroke="#4ADEB5" strokeWidth="1.5" strokeOpacity="0.28" />
      <line x1="156" y1="44" x2="156" y2="156" stroke="#4ADEB5" strokeWidth="1.5" strokeOpacity="0.28" />

      {/* Dim off-path nodes */}
      <circle cx="44"  cy="44"  r="5" fill="#4ADEB5" fillOpacity="0.25" />
      <circle cx="100" cy="44"  r="5" fill="#4ADEB5" fillOpacity="0.25" />
      <circle cx="44"  cy="100" r="5" fill="#4ADEB5" fillOpacity="0.25" />
      <circle cx="156" cy="100" r="5" fill="#4ADEB5" fillOpacity="0.25" />
      <circle cx="100" cy="156" r="5" fill="#4ADEB5" fillOpacity="0.25" />
      <circle cx="156" cy="156" r="5" fill="#4ADEB5" fillOpacity="0.25" />

      {/* Flow path — smooth S-curve through bottom-left → center → top-right */}
      <path
        d="M 44 156 C 44 100, 156 100, 156 44"
        stroke="#4ADEB5"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bright flow nodes */}
      <circle cx="44"  cy="156" r="9"  fill="#4ADEB5" />
      <circle cx="100" cy="100" r="12" fill="#99F6E4" />
      <circle cx="156" cy="44"  r="9"  fill="#4ADEB5" />
    </svg>
  );
}
