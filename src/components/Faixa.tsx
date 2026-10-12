import { textos } from "@/content/textos";

/** Faixa cobre com sabores da casa correndo devagar, logo abaixo da primeira dobra. */
export function Faixa() {
  const itens = textos.faixa;
  // Duas cópias lado a lado para o movimento não ter emenda.
  const Grupo = ({ oculto }: { oculto?: boolean }) => (
    <ul className="faixa__grupo" aria-hidden={oculto || undefined}>
      {itens.map((t) => (
        <li key={t}>
          <span>{t}</span>
          <span className="faixa__losango" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="faixa" role="region" aria-label="Alguns sabores da casa">
      <div className="faixa__trilho">
        <Grupo />
        <Grupo oculto />
      </div>
    </div>
  );
}
