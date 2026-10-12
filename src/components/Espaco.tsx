"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { fotosEspaco } from "@/content/site";
import { textos } from "@/content/textos";
import { Filete } from "./Ornamentos";

/**
 * O espaço. No computador, a página "trava" e a rolagem leva as fotos para o
 * lado, como quem caminha pela casa. No celular (ou com movimento reduzido),
 * vira uma fileira que se arrasta com o dedo.
 */
export function Espaco() {
  const secao = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = secao.current;
    const tr = trilho.current;
    if (!sec || !tr) return;
    const largo = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    let distancia = 0;
    let quadro = 0;

    const mover = () => {
      if (!sec.classList.contains("espaco--pinado")) return;
      const topo = sec.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -topo / distancia));
      tr.style.transform = `translate3d(${(-p * distancia).toFixed(1)}px, 0, 0)`;
      sec.style.setProperty("--progresso", p.toFixed(3));
    };

    const medir = () => {
      if (largo.matches) {
        sec.classList.add("espaco--pinado");
        distancia = Math.max(0, tr.scrollWidth - window.innerWidth);
        sec.style.height = `${distancia + window.innerHeight}px`;
        mover();
      } else {
        sec.classList.remove("espaco--pinado");
        sec.style.height = "";
        tr.style.transform = "";
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(mover);
    };

    medir();
    // As fotos podem terminar de carregar depois e mudar a largura do trilho
    const ro = new ResizeObserver(medir);
    ro.observe(tr);
    window.addEventListener("resize", medir);
    window.addEventListener("scroll", onScroll, { passive: true });
    largo.addEventListener("change", medir);
    return () => {
      cancelAnimationFrame(quadro);
      ro.disconnect();
      window.removeEventListener("resize", medir);
      window.removeEventListener("scroll", onScroll);
      largo.removeEventListener("change", medir);
    };
  }, []);

  return (
    <section ref={secao} id="espaco" className="fundo-creme espaco" aria-labelledby="espaco-titulo">
      <div className="espaco__palco">
        <div ref={trilho} className="espaco__trilho">
          <div className="espaco__intro">
            <p className="chamada">{textos.espaco.chamada}</p>
            <h2 id="espaco-titulo" className="titulo-secao">
              {textos.espaco.titulo}
            </h2>
            <Filete />
            <p className="espaco__texto">{textos.espaco.texto}</p>
            <p className="espaco__historia" data-pendente="História da casa: confirmar o texto com a dona">
              {textos.espaco.historia}
            </p>
            <p className="espaco__dica" aria-hidden="true">
              <span className="espaco__dica-estreito">{textos.espaco.dica}</span>
              <span className="espaco__dica-largo">{textos.espaco.dicaRolar}</span>
              <span className="espaco__seta" />
            </p>
          </div>

          {fotosEspaco.map((f, i) => (
            <figure key={f.src} className={`espaco__foto espaco__foto--${i % 3}`}>
              <div className="espaco__moldura">
                <Image src={f.src} alt={f.alt} width={f.largura} height={f.altura} sizes="(max-width: 900px) 80vw, 560px" />
              </div>
              <figcaption>
                <span className="espaco__indice" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{f.titulo}</strong>
                <span>{f.legenda}</span>
              </figcaption>
            </figure>
          ))}

          <blockquote className="espaco__convite">
            <p>{textos.espaco.convite}</p>
          </blockquote>
        </div>

        <div className="espaco__progresso" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
