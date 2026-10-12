import type { Ilustracao as Tipo } from "@/content/menu";

/**
 * Ilustrações em traço fino, no espírito do selo da casa. Aparecem na vitrine
 * enquanto as fotos dos pratos não chegam. O vapor (.vapor) anima pelo CSS.
 */
export function Ilustracao({ tipo, className = "" }: { tipo: Tipo; className?: string }) {
  return (
    <svg
      className={`ilustracao ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {DESENHOS[tipo]}
    </svg>
  );
}

const Vapor = ({ x = 60, y = 30 }: { x?: number; y?: number }) => (
  <g className="vapor">
    <path d={`M${x - 11} ${y}c-5 5 5 9 0 15`} />
    <path d={`M${x} ${y - 5}c-5 6 5 10 0 18`} />
    <path d={`M${x + 11} ${y}c-5 5 5 9 0 15`} />
  </g>
);

const DESENHOS: Record<Tipo, React.ReactNode> = {
  xicara: (
    <>
      <Vapor x={58} y={28} />
      <ellipse cx="58" cy="54" rx="28" ry="5" />
      <path d="M30 54l5 30a10 10 0 0 0 10 8h26a10 10 0 0 0 10-8l5-30" />
      <path d="M86 60c11-1 14 12 3 18l-6 3" />
      <path d="M50 54c2-3 5-3 8 0 3-3 6-3 8 0-2 3-5 4-8 6-3-2-6-3-8-6z" />
      <ellipse cx="58" cy="98" rx="40" ry="5.5" />
      <ellipse cx="58" cy="97" rx="24" ry="2.4" opacity="0.6" />
    </>
  ),
  gateau: (
    <>
      <Vapor x={56} y={24} />
      <ellipse cx="60" cy="94" rx="46" ry="7" />
      <ellipse cx="60" cy="90" rx="34" ry="4" opacity="0.5" />
      <path d="M34 88V64M86 64v24" />
      <path d="M34 88c8 4 44 4 52 0" />
      <ellipse cx="60" cy="64" rx="26" ry="8.5" />
      <path d="M35 66c0 7 5 7 5 1 0 9 6 9 6 2 0 6 5 6 5 0M69 72c0 6 5 6 5 0 0 8 6 8 6 1 0 5 5 5 5-1" />
      <path d="M72 58a9 8 0 1 1 17 0c-3 2-6-1-8.5 1.5S75 60 72 58z" />
      <path d="M48 62l2-1M56 66l2 1M62 60l1 2" />
    </>
  ),
  milkshake: (
    <>
      <path d="M68 36l12-26h9" />
      <circle cx="58" cy="20" r="5" />
      <path d="M58 15c1-5 5-8 10-8" />
      <path d="M36 40c0-8 8-10 12-7 2-9 20-9 22 0 4-3 12-1 12 7z" />
      <path d="M38 40h44l-6 56a6 6 0 0 1-6 5H50a6 6 0 0 1-6-5z" />
      <path d="M42 58h36M43.5 72h33" opacity="0.55" />
      <path d="M46 104h28" />
    </>
  ),
  waffle: (
    <>
      <ellipse cx="60" cy="96" rx="46" ry="7" />
      <circle cx="60" cy="68" r="27" />
      <path d="M46 45v46M60 41v54M74 45v46M37 54h46M33 68h54M37 82h46" opacity="0.6" />
      <path d="M48 46a12 11 0 1 1 24 0c-4 3-8-1-12 2s-8-1-12-2z" />
      <path d="M50 48c0 8 4 8 4 2 0 10 5 10 5 2" />
    </>
  ),
  tostex: (
    <>
      <Vapor x={60} y={22} />
      <ellipse cx="60" cy="96" rx="48" ry="6.5" />
      <path d="M18 90L48 42l22 48z" />
      <path d="M27 86l21-34 15 34" opacity="0.55" />
      <path d="M33 78h29l2 6" />
      <path d="M62 92l26-44 20 44z" />
      <path d="M70 88l18-30 13 30" opacity="0.55" />
      <path d="M75 80h22l2.5 5" />
    </>
  ),
  torta: (
    <>
      <ellipse cx="62" cy="98" rx="46" ry="6.5" />
      <path d="M26 58l60-14 12 14-60 16z" />
      <path d="M26 58v20l12 16V74M98 58v22L38 94" />
      <path d="M38 81l60-15M38 87.5l60-15" opacity="0.55" />
      <path d="M36 62c6-4 10 3 16-1s10 3 16-1 10 3 16-1" />
      <circle cx="80" cy="46" r="3.5" />
    </>
  ),
};
