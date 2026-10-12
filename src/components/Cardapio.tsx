"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cardapios, categorias, slug } from "@/content/menu";
import type { Cardapio as TipoCardapio, Categoria, Item, Marca } from "@/content/menu-types";
import { textos } from "@/content/textos";
import { preco } from "@/lib/format";
import { marcasDoItem } from "@/lib/pedido";
import { useComanda } from "./ComandaProvider";
import { Foto } from "./Foto";
import { Filete } from "./Ornamentos";

export const ROTULO_MARCA: Partial<Record<Marca, string>> = {
  "so-no-salao": "Só no salão",
  "preparo-20": "Preparo 20 min",
  "copo-descartavel": "Copo descartável",
  "consulte-opcoes": "Sabores do dia",
};

export function Cardapio() {
  const [ativo, setAtivo] = useState<TipoCardapio>("bebidas");
  const [busca, setBusca] = useState("");
  const idBusca = useId();

  const termo = slug(busca);
  const resultados = useMemo(() => {
    if (termo.length < 2) return null;
    return categorias.flatMap((c) =>
      c.itens
        .filter((i) => slug(`${i.nome} ${i.descricao ?? ""} ${c.titulo}`).includes(termo))
        .map((item) => ({ item, categoria: c })),
    );
  }, [termo]);

  const visiveis = categorias.filter((c) => c.cardapio === ativo);
  const atalhos = useRef<HTMLElement>(null);
  const [atual, setAtual] = useState<string | null>(null);

  // Destaca o atalho da categoria que está na tela e o traz para a vista
  useEffect(() => {
    if (resultados) return;
    const cartoes = Array.from(document.querySelectorAll<HTMLElement>(".cardapio__papeis .papel"));
    const obs = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visivel) setAtual(visivel.target.id.replace(/^cat-/, ""));
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    cartoes.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [ativo, resultados]);

  useEffect(() => {
    const nav = atalhos.current;
    const link = nav?.querySelector<HTMLElement>(`[data-cat="${atual}"]`);
    if (!nav || !link) return;
    nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2, behavior: "smooth" });
  }, [atual]);

  return (
    <section id="cardapio" className="secao fundo-espresso cardapio" aria-labelledby="cardapio-titulo">
      <div className="cardapio__ripado" aria-hidden="true" />
      <div className="secao__cabeca secao__cabeca--claro">
        <p className="chamada chamada--clara">{textos.cardapio.chamada}</p>
        <h2 id="cardapio-titulo" className="titulo-secao">
          {textos.cardapio.titulo}
        </h2>
        <Filete claro />
        <p className="secao__linha-fina">{textos.cardapio.linhaFina}</p>
      </div>

      <div className="cardapio__capas" role="tablist" aria-label="Escolha o cardápio">
        {cardapios.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            id={`aba-${c.id}`}
            aria-selected={ativo === c.id && !resultados}
            aria-controls="painel-cardapio"
            className={`capa ${ativo === c.id && !resultados ? "capa--ativa" : ""}`}
            onClick={() => {
              setAtivo(c.id);
              setBusca("");
            }}
          >
            <span className="capa__marca">Espaço Café</span>
            <span className="capa__titulo">{c.titulo}</span>
            <span className="capa__contagem">
              {categorias.filter((x) => x.cardapio === c.id).reduce((s, x) => s + x.itens.length, 0)} itens
            </span>
          </button>
        ))}
      </div>

      <div className="cardapio__ferramentas">
        <label htmlFor={idBusca} className="visualmente-oculto">
          Buscar no cardápio
        </label>
        <input
          id={idBusca}
          className="cardapio__busca"
          type="search"
          placeholder="Buscar no cardápio, ex.: cappuccino"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          autoComplete="off"
        />
        {!resultados && (
          <nav ref={atalhos} className="cardapio__atalhos" aria-label="Categorias">
            {visiveis.map((c) => (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                data-cat={c.id}
                className={atual === c.id ? "ativo" : undefined}
                aria-current={atual === c.id ? "true" : undefined}
              >
                {c.titulo}
              </a>
            ))}
          </nav>
        )}
      </div>

      <div id="painel-cardapio" role="tabpanel" aria-labelledby={`aba-${ativo}`} className="cardapio__painel">
        {resultados ? (
          <article className="papel papel--resultado">
            <header className="papel__cabeca">
              <span className="papel__marca">Espaço Café</span>
              <h3 className="papel__titulo">Busca</h3>
              <Filete />
            </header>
            {resultados.length ? (
              <ul className="papel__itens">
                {resultados.map(({ item, categoria }) => (
                  <LinhaItem key={item.id} item={item} categoria={categoria} mostrarCategoria />
                ))}
              </ul>
            ) : (
              <p className="papel__vazio">
                Nada com &ldquo;{busca}&rdquo; no cardápio. Tente outro nome, como tapioca ou cappuccino.
              </p>
            )}
          </article>
        ) : (
          <div className="cardapio__papeis">
            {visiveis.map((c) => (
              <CartaoCategoria key={c.id} categoria={c} />
            ))}
          </div>
        )}
      </div>

      <p className="cardapio__aviso">
        Atenção, alérgicos e intolerantes: nossos produtos podem conter glúten e lactose. Na dúvida, fale com a gente.
        Não alteramos produtos com valores diferentes, apenas incluímos adicional.
      </p>
    </section>
  );
}

function CartaoCategoria({ categoria: c }: { categoria: Categoria }) {
  return (
    <article id={`cat-${c.id}`} className="papel" aria-labelledby={`tit-${c.id}`}>
      <header className="papel__cabeca">
        <span className="papel__marca">Espaço Café</span>
        <h3 id={`tit-${c.id}`} className="papel__titulo">
          {c.titulo}
        </h3>
        <Filete />
      </header>

      {c.foto && (
        <div className="papel__foto">
          <Foto
            src={c.foto.src}
            alt={c.foto.alt}
            arquivoSugerido={`cardapio/${c.foto.arquivoSugerido}`}
            largura={1200}
            altura={700}
            sizes="(max-width: 1024px) 92vw, 560px"
          />
        </div>
      )}

      {c.aviso && <p className="papel__aviso">{c.aviso}</p>}
      {c.notas?.map((n) => (
        <p key={n} className="papel__nota">
          {n}
        </p>
      ))}

      <ul className="papel__itens">
        {c.itens.map((item) => (
          <LinhaItem key={item.id} item={item} categoria={c} />
        ))}
      </ul>

      {c.opcoes?.map((g) =>
        g.escolhas.some((e) => e.preco) ? (
          <div key={g.id} className="papel__extras">
            <h4>{g.titulo === "Pão" ? "Se preferir outro pão" : g.titulo}</h4>
            <ul>
              {g.escolhas
                .filter((e) => e.preco)
                .map((e) => (
                  <li key={e.id}>
                    <span>{e.nome}</span>
                    <span className="papel__pontilhado" aria-hidden="true" />
                    <span>+ {preco(e.preco!)}</span>
                  </li>
                ))}
            </ul>
          </div>
        ) : null,
      )}

      {c.adicionais && c.adicionais.length > 0 && (
        <div className="papel__extras">
          <h4>Adicionais</h4>
          <ul className={c.adicionais.length > 3 ? "duas-colunas" : ""}>
            {c.adicionais.map((a) => (
              <li key={a.id}>
                <span>{a.nome}</span>
                <span className="papel__pontilhado" aria-hidden="true" />
                <span>{preco(a.preco ?? 0)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function LinhaItem({ item, categoria, mostrarCategoria }: { item: Item; categoria: Categoria; mostrarCategoria?: boolean }) {
  const { abrirItem } = useComanda();
  const marcas = marcasDoItem(item, categoria).filter((m) => ROTULO_MARCA[m] && !(categoria.marcas ?? []).includes(m));
  const soNoSalao = marcasDoItem(item, categoria).includes("so-no-salao");

  return (
    <li className="linha-item" data-pendente={item.pendente}>
      <button
        type="button"
        className="linha-item__botao"
        onClick={() => abrirItem(item.id)}
        aria-label={`${item.nome}${soNoSalao ? ", servido só no salão" : ""}. Ver detalhes`}
      >
        <span className="linha-item__topo">
          <span className="linha-item__nome">{item.nome}</span>
          {item.variacoes ? (
            <span className="linha-item__espaco" />
          ) : (
            <>
              <span className="papel__pontilhado" aria-hidden="true" />
              <span className="linha-item__preco">{preco(item.preco)}</span>
            </>
          )}
          <span className="linha-item__mais" aria-hidden="true">
            +
          </span>
        </span>
        {mostrarCategoria && <span className="linha-item__categoria">{categoria.titulo}</span>}
        {item.descricao && <span className="linha-item__descricao">{item.descricao}</span>}
        {item.variacoes && (
          <span className="linha-item__tamanhos">
            {item.variacoes.map((v) => (
              <span key={v.id} className="linha-item__tamanho">
                <span>
                  {v.nome}
                  {v.detalhe && <em> {v.detalhe}</em>}
                </span>
                <span className="papel__pontilhado" aria-hidden="true" />
                <span className="linha-item__preco">{preco(v.preco)}</span>
              </span>
            ))}
          </span>
        )}
        {marcas.length > 0 && (
          <span className="linha-item__marcas">
            {marcas.map((m) => (
              <span key={m} className={`etiqueta etiqueta--${m}`}>
                {ROTULO_MARCA[m]}
              </span>
            ))}
          </span>
        )}
      </button>
    </li>
  );
}
