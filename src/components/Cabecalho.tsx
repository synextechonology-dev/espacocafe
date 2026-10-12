"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useComanda } from "./ComandaProvider";
import { Monograma } from "./Ornamentos";

const LINKS = [
  { href: "#cardapio", rotulo: "Cardápio" },
  { href: "#espaco", rotulo: "O espaço" },
  { href: "#visite", rotulo: "Como chegar" },
  { href: "#duvidas", rotulo: "Dúvidas" },
];

export function Cabecalho() {
  const { quantidade, abrir, pulso } = useComanda();
  const [rolou, setRolou] = useState(false);
  const [menu, setMenu] = useState(false);
  const [batida, setBatida] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let quadro = 0;
    const onScroll = () => {
      setRolou(window.scrollY > 40);
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        ref.current?.style.setProperty("--leitura", total > 0 ? (window.scrollY / total).toFixed(4) : "0");
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!pulso) return;
    setBatida(true);
    const t = window.setTimeout(() => setBatida(false), 650);
    return () => window.clearTimeout(t);
  }, [pulso]);

  useEffect(() => {
    document.body.classList.toggle("sem-rolagem", menu);
  }, [menu]);

  return (
    <header ref={ref} className={`cabecalho ${rolou ? "cabecalho--fixo" : ""}`}>
      <span className="cabecalho__leitura" aria-hidden="true" />
      <div className="cabecalho__barra">
        <a href="#inicio" className="cabecalho__marca" aria-label="Espaço Café, voltar ao início">
          <Monograma className="cabecalho__monograma" />
          <span className="cabecalho__nome">
            <span>Espaço Café</span>
            <small>Cafeteria</small>
          </span>
        </a>

        <nav className="cabecalho__nav" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.rotulo}
            </a>
          ))}
        </nav>

        <div className="cabecalho__acoes">
          <button type="button" className={`botao-comanda ${batida ? "botao-comanda--batida" : ""}`} onClick={abrir}>
            <span>Comanda</span>
            <span className="botao-comanda__qtd" aria-label={`${quantidade} itens`}>
              {quantidade}
            </span>
          </button>
          <button
            type="button"
            className="cabecalho__menu-botao"
            aria-expanded={menu}
            aria-controls="menu-movel"
            onClick={() => setMenu((m) => !m)}
          >
            <span className="visualmente-oculto">{menu ? "Fechar menu" : "Abrir menu"}</span>
            <span className={`hamburguer ${menu ? "hamburguer--x" : ""}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div id="menu-movel" className={`menu-movel ${menu ? "menu-movel--aberto" : ""}`} hidden={!menu}>
        <nav aria-label="Menu">
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setMenu(false)} style={{ "--i": i } as React.CSSProperties}>
              <span className="menu-movel__indice" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {l.rotulo}
            </a>
          ))}
          <p className="menu-movel__rodape">{site.slogan}</p>
        </nav>
      </div>
    </header>
  );
}
