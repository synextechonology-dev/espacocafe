"use client";

import { useEffect, useId, useRef, useState } from "react";
import { itensPorId } from "@/content/menu";
import type { GrupoDeOpcoes } from "@/content/menu-types";
import { preco, reais } from "@/lib/format";
import { gruposDoItem, marcasDoItem } from "@/lib/pedido";
import { ROTULO_MARCA } from "./Cardapio";
import { useComanda } from "./ComandaProvider";
import { Foto } from "./Foto";
import { Filete } from "./Ornamentos";

/** Ficha do item: tamanho, opções, adicionais, quantidade e observação. */
export function FichaItem() {
  const { itemAberto, fecharItem } = useComanda();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (itemAberto && !d.open) d.showModal();
    if (!itemAberto && d.open) d.close();
    document.body.classList.toggle("sem-rolagem", !!itemAberto);
  }, [itemAberto]);

  return (
    <dialog
      ref={ref}
      className="ficha"
      aria-labelledby="ficha-titulo"
      onClose={fecharItem}
      onClick={(e) => {
        if (e.target === e.currentTarget) fecharItem();
      }}
    >
      {itemAberto && <ConteudoFicha key={itemAberto} id={itemAberto} />}
    </dialog>
  );
}

function ConteudoFicha({ id }: { id: string }) {
  const { adicionar, fecharItem, abrir } = useComanda();
  const achado = itensPorId.get(id);
  const [variacaoId, setVariacaoId] = useState(achado?.item.variacoes?.[0]?.id);
  const [escolhas, setEscolhas] = useState<Record<string, string[]>>({});
  const [adicionais, setAdicionais] = useState<string[]>([]);
  const [qtd, setQtd] = useState(1);
  const [obs, setObs] = useState("");
  const [faltando, setFaltando] = useState<string[]>([]);
  const [adicionado, setAdicionado] = useState(false);
  const idObs = useId();

  if (!achado) return null;
  const { item, categoria } = achado;
  const grupos = gruposDoItem(item, categoria);
  const marcas = marcasDoItem(item, categoria);
  const soNoSalao = marcas.includes("so-no-salao");
  const consulte = marcas.includes("consulte-opcoes");

  const base = item.variacoes?.find((v) => v.id === variacaoId)?.preco ?? item.preco;
  const extras =
    grupos.reduce(
      (s, g) => s + g.escolhas.filter((e) => (escolhas[g.id] ?? []).includes(e.id)).reduce((a, e) => a + (e.preco ?? 0), 0),
      0,
    ) + (categoria.adicionais ?? []).filter((a) => adicionais.includes(a.id)).reduce((s, a) => s + (a.preco ?? 0), 0);
  const total = (base + extras) * qtd;

  const alternar = (g: GrupoDeOpcoes, escolhaId: string) => {
    setFaltando((f) => f.filter((x) => x !== g.id));
    setEscolhas((atual) => {
      const marcadas = atual[g.id] ?? [];
      if (g.tipo === "uma") return { ...atual, [g.id]: [escolhaId] };
      return {
        ...atual,
        [g.id]: marcadas.includes(escolhaId) ? marcadas.filter((x) => x !== escolhaId) : [...marcadas, escolhaId],
      };
    });
  };

  const confirmar = () => {
    const pendentes = grupos.filter((g) => g.obrigatorio && !(escolhas[g.id] ?? []).length).map((g) => g.id);
    if (pendentes.length) {
      setFaltando(pendentes);
      document.getElementById(`grupo-${pendentes[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    adicionar({ itemId: item.id, qtd, variacaoId, escolhas, adicionais, observacao: obs.trim() || undefined });
    setAdicionado(true);
  };

  if (adicionado) {
    return (
      <div className="ficha__corpo ficha__corpo--feito">
        <p className="ficha__feito-titulo" id="ficha-titulo">
          Anotado na comanda
        </p>
        <p className="ficha__feito-texto">
          {qtd}x {item.nome}
        </p>
        <div className="ficha__feito-acoes">
          <button type="button" className="botao botao--contorno-escuro" onClick={fecharItem}>
            Continuar escolhendo
          </button>
          <button
            type="button"
            className="botao botao--cobre"
            onClick={() => {
              fecharItem();
              abrir();
            }}
          >
            Ver comanda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ficha__corpo">
      <button type="button" className="ficha__fechar" onClick={fecharItem}>
        <span className="visualmente-oculto">Fechar</span>
        <span aria-hidden="true">×</span>
      </button>

      <div className="ficha__foto">
        <Foto
          src={item.foto}
          alt={item.nome}
          arquivoSugerido={`cardapio/${item.id}.webp`}
          largura={900}
          altura={600}
          sizes="(max-width: 640px) 100vw, 520px"
        />
      </div>

      <div className="ficha__texto">
        <span className="ficha__categoria">{categoria.titulo}</span>
        <h3 id="ficha-titulo" className="ficha__titulo">
          {item.nome}
        </h3>
        <Filete />
        {item.descricao && <p className="ficha__descricao">{item.descricao}</p>}

        {marcas.some((m) => ROTULO_MARCA[m]) && (
          <p className="ficha__marcas">
            {marcas
              .filter((m) => ROTULO_MARCA[m])
              .map((m) => (
                <span key={m} className={`etiqueta etiqueta--${m}`}>
                  {ROTULO_MARCA[m]}
                </span>
              ))}
          </p>
        )}
        {categoria.aviso && <p className="ficha__aviso">{categoria.aviso}</p>}
      </div>

      {soNoSalao ? (
        <div className="ficha__salao">
          <p>
            Este item é servido só aqui na casa, porque não chega bem na viagem. Peça no balcão quando vier nos visitar.
          </p>
          <button type="button" className="botao botao--contorno-escuro" onClick={fecharItem}>
            Voltar ao cardápio
          </button>
        </div>
      ) : (
        <>
          <div className="ficha__opcoes">
            {item.variacoes && (
              <fieldset className="grupo">
                <legend className="grupo__titulo">Tamanho</legend>
                <div className="grupo__escolhas">
                  {item.variacoes.map((v) => (
                    <label key={v.id} className="escolha">
                      <input
                        type="radio"
                        name={`var-${item.id}`}
                        checked={variacaoId === v.id}
                        onChange={() => setVariacaoId(v.id)}
                      />
                      <span className="escolha__nome">
                        {v.nome}
                        {v.detalhe && <em> {v.detalhe}</em>}
                      </span>
                      <span className="escolha__preco">{preco(v.preco)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {grupos.map((g) => (
              <fieldset
                key={g.id}
                id={`grupo-${g.id}`}
                className={`grupo ${faltando.includes(g.id) ? "grupo--faltando" : ""}`}
                aria-describedby={faltando.includes(g.id) ? `erro-${g.id}` : undefined}
              >
                <legend className="grupo__titulo">
                  {g.titulo}
                  {g.obrigatorio ? <span className="grupo__obrigatorio">escolha 1</span> : <span className="grupo__opcional">opcional</span>}
                </legend>
                {faltando.includes(g.id) && (
                  <p id={`erro-${g.id}`} className="grupo__erro">
                    Escolha uma opção de {g.titulo.toLowerCase()} para continuar.
                  </p>
                )}
                <div className="grupo__escolhas">
                  {g.escolhas.map((e) => (
                    <label key={e.id} className="escolha">
                      <input
                        type={g.tipo === "uma" ? "radio" : "checkbox"}
                        name={`${item.id}-${g.id}`}
                        checked={(escolhas[g.id] ?? []).includes(e.id)}
                        onChange={() => alternar(g, e.id)}
                      />
                      <span className="escolha__nome">{e.nome}</span>
                      {e.preco ? <span className="escolha__preco">+ {preco(e.preco)}</span> : null}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            {categoria.adicionais && categoria.adicionais.length > 0 && (
              <fieldset className="grupo">
                <legend className="grupo__titulo">
                  Adicionais <span className="grupo__opcional">opcional</span>
                </legend>
                <div className="grupo__escolhas">
                  {categoria.adicionais.map((a) => (
                    <label key={a.id} className="escolha">
                      <input
                        type="checkbox"
                        checked={adicionais.includes(a.id)}
                        onChange={() =>
                          setAdicionais((x) => (x.includes(a.id) ? x.filter((y) => y !== a.id) : [...x, a.id]))
                        }
                      />
                      <span className="escolha__nome">{a.nome}</span>
                      <span className="escolha__preco">+ {preco(a.preco ?? 0)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="grupo">
              <label className="grupo__titulo" htmlFor={idObs}>
                {consulte ? "Qual sabor você quer?" : "Observação"} <span className="grupo__opcional">opcional</span>
              </label>
              <textarea
                id={idObs}
                className="campo"
                rows={2}
                maxLength={140}
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder={consulte ? "Ex.: bolo de cenoura. Se não tiver, a gente sugere outro pelo WhatsApp." : "Ex.: bem quente, sem açúcar"}
              />
              <p className="grupo__ajuda">Não alteramos produtos com valores diferentes, apenas incluímos adicional.</p>
            </div>
          </div>

          <div className="ficha__rodape">
            <div className="contador" role="group" aria-label="Quantidade">
              <button type="button" onClick={() => setQtd((q) => Math.max(1, q - 1))} disabled={qtd <= 1}>
                <span className="visualmente-oculto">Diminuir</span>
                <span aria-hidden="true">−</span>
              </button>
              <output aria-live="polite">{qtd}</output>
              <button type="button" onClick={() => setQtd((q) => Math.min(30, q + 1))}>
                <span className="visualmente-oculto">Aumentar</span>
                <span aria-hidden="true">+</span>
              </button>
            </div>
            <button
              type="button"
              className="botao botao--cobre ficha__adicionar"
              onClick={confirmar}
              aria-label={`Adicionar à comanda, ${reais(total)}`}
            >
              <span>
                Adicionar<span className="so-largo"> à comanda</span>
              </span>
              <span>{reais(total)}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
