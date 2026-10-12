"use client";

import { useEffect, useRef, useState } from "react";
import { categorias } from "@/content/menu";
import { site } from "@/content/site";
import { textos } from "@/content/textos";
import { Filete } from "./Ornamentos";

/**
 * Manifesto da casa. As palavras "acendem" conforme a pessoa rola a página,
 * como quem lê devagar. Abaixo, três números contados a partir do cardápio.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const palavras = textos.manifesto.texto.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>(".manifesto__palavra"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => s.classList.add("acesa"));
      return;
    }
    let quadro = 0;
    const atualizar = () => {
      const r = el.querySelector(".manifesto__texto")!.getBoundingClientRect();
      const vh = window.innerHeight;
      // Começa quando o texto entra pela parte de baixo e termina perto do meio da tela
      const p = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (r.height + vh * 0.2)));
      const ate = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle("acesa", i < ate));
    };
    const onScroll = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const totalItens = categorias.reduce((s, c) => s + c.itens.length, 0);
  const numeros = [
    { valor: totalItens, rotulo: "delícias no cardápio" },
    { valor: categorias.length, rotulo: "categorias para explorar" },
    { valor: site.expediente.length, rotulo: "dias por semana de portas abertas" },
  ];

  return (
    <section ref={ref} id="manifesto" className="secao fundo-creme manifesto" aria-labelledby="manifesto-titulo">
      <div className="manifesto__conteudo">
        <h2 id="manifesto-titulo" className="chamada">
          {textos.manifesto.chamada}
        </h2>
        <p className="manifesto__texto">
          {palavras.map((p, i) => (
            <span key={i} className="manifesto__palavra">
              {p}{" "}
            </span>
          ))}
        </p>
        <div className="manifesto__assinatura">
          <Filete />
          <span>{textos.manifesto.assinatura}</span>
        </div>
      </div>

      <ul className="manifesto__numeros">
        {numeros.map((n) => (
          <li key={n.rotulo} data-revelar>
            <Contador valor={n.valor} />
            <span className="manifesto__rotulo">{n.rotulo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Número que sobe de 0 até o valor quando aparece na tela. */
function Contador({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAtual(0);
    let quadro = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const inicio = performance.now();
        const passo = (t: number) => {
          const p = Math.min(1, (t - inicio) / 1400);
          setAtual(Math.round(valor * (1 - Math.pow(1 - p, 3))));
          if (p < 1) quadro = requestAnimationFrame(passo);
        };
        quadro = requestAnimationFrame(passo);
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [valor]);

  return (
    <span ref={ref} className="manifesto__numero">
      {atual}
    </span>
  );
}
