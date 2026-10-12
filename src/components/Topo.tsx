"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { textos } from "@/content/textos";
import { StatusAberto } from "./StatusAberto";

/**
 * Primeira dobra. O selo "acende" como o letreiro da fachada à noite, com um
 * anel de texto girando em volta e vapor subindo. No computador, uma luz
 * quente acompanha o mouse, como uma luminária sobre a mesa.
 */
export function Topo() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calmo) return;

    let quadro = 0;
    const onScroll = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight));
        el.style.setProperty("--rolagem", p.toFixed(3));
      });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--luz-x", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      el.style.setProperty("--luz-y", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  // "Um lugar para pausar." vira "Um lugar para" + "pausar." em itálico
  const palavras = site.slogan.split(" ");
  const ultima = palavras.pop();

  return (
    <section ref={ref} id="inicio" className="topo fundo-espresso" aria-labelledby="topo-titulo">
      <div className="topo__textura" aria-hidden="true" />
      <div className="topo__luz" aria-hidden="true" />
      <span className="topo__fundo-palavra" aria-hidden="true">
        Pausa
      </span>

      <div className="topo__grade">
        <div className="topo__texto">
          <p className="topo__chamada">
            <span className="topo__chamada-linha" aria-hidden="true" />
            {textos.topo.chamada}
          </p>
          <h1 id="topo-titulo" className="topo__titulo">
            <span className="visualmente-oculto">{site.nome}, cafeteria em {site.endereco.cidade}. </span>
            <span className="topo__titulo-linha">{palavras.join(" ")}</span>
            <em className="topo__titulo-linha topo__titulo-linha--italico">{ultima}</em>
          </h1>
          <p className="topo__apresentacao">{textos.topo.apresentacao}</p>

          <StatusAberto className="topo__status" />

          <div className="topo__acoes">
            <a className="botao botao--creme" href="#cardapio">
              Ver o cardápio
            </a>
            <a className="botao botao--contorno" href="#visite">
              Como chegar
            </a>
          </div>
        </div>

        <div className="topo__selo-area">
          <svg className="topo__anel" viewBox="0 0 300 300" aria-hidden="true">
            <defs>
              <path id="anel-caminho" d="M150 150m-128 0a128 128 0 1 1 256 0a128 128 0 1 1-256 0" />
            </defs>
            <circle cx="150" cy="150" r="146" className="topo__anel-borda" />
            <circle cx="150" cy="150" r="110" className="topo__anel-borda topo__anel-borda--fina" />
            <text className="topo__anel-texto">
              <textPath href="#anel-caminho" textLength="800" lengthAdjust="spacing">
                {textos.topo.anel.toUpperCase()}
              </textPath>
            </text>
          </svg>

          <svg className="topo__vapor" viewBox="0 0 120 90" aria-hidden="true">
            <path d="M40 88c-14-16 14-26 0-44S44 12 38 2" />
            <path d="M62 88c-14-18 16-28 0-48S66 10 60 0" />
            <path d="M84 88c-14-16 14-26 0-44S88 14 82 4" />
          </svg>

          <div className="topo__selo">
            <Image
              src="/marca/selo.webp"
              alt="Selo do Espaço Café Cafeteria"
              width={640}
              height={640}
              priority
              sizes="(max-width: 900px) 62vw, 380px"
            />
          </div>
        </div>
      </div>

      <a className="topo__rolar" href="#manifesto">
        <span>{textos.topo.rolar}</span>
        <span className="topo__rolar-linha" aria-hidden="true" />
      </a>
    </section>
  );
}
