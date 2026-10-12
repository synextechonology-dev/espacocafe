"use client";

import { useEffect } from "react";

/**
 * Faz os elementos com [data-revelar] surgirem suavemente ao entrar na tela.
 * Só esconde o conteúdo depois que o JavaScript carregou (classe .js), então
 * sem JS tudo continua visível.
 */
export function Revelar() {
  useEffect(() => {
    const raiz = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    raiz.classList.add("js");

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-visivel", "");
          obs.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const observar = () =>
      document.querySelectorAll("[data-revelar]:not([data-visivel])").forEach((el) => obs.observe(el));
    observar();

    // O cardápio troca de conteúdo (abas e busca): observa os novos elementos também
    const mo = new MutationObserver(observar);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
