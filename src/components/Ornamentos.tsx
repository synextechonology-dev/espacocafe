/**
 * Elementos gráficos do manual da marca: filete com losango, monograma EC,
 * xícara do selo e moldura oval.
 */

export function Filete({ className = "", claro = false }: { className?: string; claro?: boolean }) {
  return (
    <span className={`filete ${claro ? "filete--claro" : ""} ${className}`} aria-hidden="true">
      <span className="filete__linha" />
      <span className="filete__losango" />
      <span className="filete__linha" />
    </span>
  );
}

export function Monograma({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
      <text
        x="32"
        y="39.5"
        textAnchor="middle"
        fontFamily="var(--fonte-titulo), serif"
        fontSize="20"
        letterSpacing="1"
        fill="currentColor"
      >
        EC
      </text>
    </svg>
  );
}

/** Xícara simplificada do selo, usada nos espaços de foto vazios. */
export function Xicara({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 60" aria-hidden="true">
      <path
        d="M14 6c10-4 26 4 38 0 6-2 10-4 14-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M18 16h38l-5 30H23z" fill="currentColor" />
      <path d="M55 21c9-2 13 5 8 11-3 4-8 6-12 7" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M10 50h58" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
