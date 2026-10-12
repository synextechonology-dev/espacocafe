"use client";

import { useEffect, useRef, useState } from "react";
import { itensPorId } from "@/content/menu";
import { momentosDoDia, textos } from "@/content/textos";
import { hora, preco } from "@/lib/format";
import { agoraNaCafeteria, expedienteDo, situacao, type Situacao } from "@/lib/horario";
import { useComanda } from "./ComandaProvider";
import { Filete } from "./Ornamentos";

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

interface Agora {
  minuto: number;
  situacao: Situacao;
  /** Índice do momento do dia (só quando a casa está aberta). */
  momento: number | null;
  /** Posição do marcador na linha do tempo, de 0 a 1. */
  posicao: number | null;
  relogio: string;
}

function calcular(): Agora {
  const { dia, minuto } = agoraNaCafeteria();
  const s = situacao();
  const exp = expedienteDo(dia);
  const relogio = hora(`${String(Math.floor(minuto / 60)).padStart(2, "0")}:${String(minuto % 60).padStart(2, "0")}`);
  if (!s.aberto || !exp) return { minuto, situacao: s, momento: null, posicao: null, relogio };
  const achado = momentosDoDia.findIndex((m) => minuto >= minutos(m.inicio) && minuto < minutos(m.fim));
  const i = achado === -1 ? (minuto < minutos(momentosDoDia[0].inicio) ? 0 : momentosDoDia.length - 1) : achado;
  // O marcador anda dentro da coluna do momento atual (as colunas têm a mesma largura)
  const m = momentosDoDia[i];
  const dentro = Math.min(1, Math.max(0, (minuto - minutos(m.inicio)) / (minutos(m.fim) - minutos(m.inicio))));
  return { minuto, situacao: s, momento: i, posicao: (i + dentro) / momentosDoDia.length, relogio };
}

/**
 * "Sugestão da hora": o dia da casa dividido em momentos. O site descobre a
 * hora atual em Santa Cruz do Rio Pardo e destaca o momento certo, com
 * sugestões do cardápio que abrem direto na ficha do item.
 */
export function HoraCerta() {
  const { abrirItem } = useComanda();
  const [agora, setAgora] = useState<Agora | null>(null);

  useEffect(() => {
    const atualizar = () => setAgora(calcular());
    atualizar();
    const t = window.setInterval(atualizar, 60_000);
    return () => window.clearInterval(t);
  }, []);

  const ativo = agora?.momento ?? null;
  const lista = useRef<HTMLOListElement>(null);

  // No celular os momentos ficam numa fileira: rola até o momento atual
  useEffect(() => {
    const ol = lista.current;
    if (ativo === null || !ol || ol.scrollWidth <= ol.clientWidth) return;
    const li = ol.children[ativo] as HTMLElement | undefined;
    if (li) ol.scrollTo({ left: li.offsetLeft - (ol.clientWidth - li.clientWidth) / 2 });
  }, [ativo]);

  return (
    <section className="secao fundo-grao hora" aria-labelledby="hora-titulo">
      <div className="secao__cabeca secao__cabeca--claro">
        <p className="chamada chamada--clara">{textos.horaCerta.chamada}</p>
        <h2 id="hora-titulo" className="titulo-secao">
          {textos.horaCerta.titulo}
        </h2>
        <Filete claro />
        <p className="hora__agora" aria-live="polite">
          {!agora ? (
            "Conferindo que horas são aí em Santa Cruz..."
          ) : ativo !== null ? (
            <>
              Agora são <strong>{agora.relogio}</strong> em Santa Cruz do Rio Pardo.{" "}
              <em>{momentosDoDia[ativo].agora}.</em>
            </>
          ) : (
            <>
              {agora.situacao.resumo}. {textos.horaCerta.fechado}
            </>
          )}
        </p>
      </div>

      <div className="hora__linha" aria-hidden="true">
        <span className="hora__trilho" />
        {agora?.posicao != null && (
          <span className="hora__marcador" style={{ left: `${agora.posicao * 100}%` }}>
            <span className="hora__marcador-rotulo">{agora.relogio}</span>
          </span>
        )}
      </div>

      <ol ref={lista} className="hora__momentos">
        {momentosDoDia.map((m, i) => {
          const sugestoes = m.sugestoes.map((id) => itensPorId.get(id)).filter((x) => x !== undefined);
          return (
            <li key={m.titulo} className={`hora__momento ${ativo === i ? "hora__momento--ativo" : ""}`} data-revelar>
              <p className="hora__faixa">
                {hora(m.inicio)} <span aria-hidden="true">·</span> {hora(m.fim)}
                {ativo === i && <span className="hora__tag">agora</span>}
              </p>
              <h3 className="hora__titulo">{m.titulo}</h3>
              <p className="hora__texto">{m.texto}</p>
              <ul className="hora__sugestoes">
                {sugestoes.map(({ item }) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => abrirItem(item.id)}>
                      <span className="hora__sugestao-nome">
                        {item.nome}
                        {/\s\d+$/.test(item.nome) && item.descricao && <em>{item.descricao}</em>}
                      </span>
                      <span className="hora__sugestao-preco">{preco(item.preco)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
