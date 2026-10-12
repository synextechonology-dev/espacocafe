"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site";
import {
  mesmaMontagem,
  novoNumeroComanda,
  resolverComanda,
  subtotal,
  type Comanda,
  type LinhaComanda,
  type LinhaResolvida,
} from "@/lib/pedido";

const CHAVE = "espacocafe:comanda:v1";
const VALIDADE_MS = site.pedidos.expiraEmMinutos * 60 * 1000;

const vazia = (): Comanda => ({ numero: novoNumeroComanda(), criadaEm: Date.now(), atualizadaEm: Date.now(), linhas: [] });

function ler(): Comanda {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return vazia();
    const c = JSON.parse(bruto) as Comanda;
    // A comanda some 1 hora depois da última alteração.
    if (!Array.isArray(c.linhas) || Date.now() - c.atualizadaEm > VALIDADE_MS) {
      window.localStorage.removeItem(CHAVE);
      return vazia();
    }
    return c;
  } catch {
    return vazia();
  }
}

function gravar(c: Comanda) {
  try {
    if (c.linhas.length) window.localStorage.setItem(CHAVE, JSON.stringify(c));
    else window.localStorage.removeItem(CHAVE);
  } catch {
    /* navegação anônima ou armazenamento bloqueado: a comanda vive só na memória */
  }
}

interface Contexto {
  comanda: Comanda;
  linhas: LinhaResolvida[];
  quantidade: number;
  total: number;
  adicionar: (linha: Omit<LinhaComanda, "uid">) => void;
  alterarQtd: (uid: string, qtd: number) => void;
  remover: (uid: string) => void;
  esvaziar: () => void;
  expiraEm: number | null;
  /** Painel da comanda */
  aberta: boolean;
  abrir: () => void;
  fechar: () => void;
  /** Ficha do item (detalhes + adicionar) */
  itemAberto: string | null;
  abrirItem: (id: string) => void;
  fecharItem: () => void;
  /** Contador que muda a cada item adicionado (para animar o botão) */
  pulso: number;
}

const Ctx = createContext<Contexto | null>(null);

export function ComandaProvider({ children }: { children: ReactNode }) {
  const [comanda, setComanda] = useState<Comanda>(() => vazia());
  const [pronto, setPronto] = useState(false);
  const [aberta, setAberta] = useState(false);
  const [itemAberto, setItemAberto] = useState<string | null>(null);
  const [pulso, setPulso] = useState(0);
  const comandaRef = useRef(comanda);
  comandaRef.current = comanda;

  // Carrega do aparelho e verifica a validade de minuto em minuto e ao voltar para a aba.
  useEffect(() => {
    setComanda(ler());
    setPronto(true);
    const verificar = () => {
      const atual = comandaRef.current;
      if (atual.linhas.length && Date.now() - atual.atualizadaEm > VALIDADE_MS) {
        try {
          window.localStorage.removeItem(CHAVE);
        } catch {}
        setComanda(vazia());
      }
    };
    const timer = window.setInterval(verificar, 60_000);
    document.addEventListener("visibilitychange", verificar);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", verificar);
    };
  }, []);

  useEffect(() => {
    if (pronto) gravar(comanda);
  }, [comanda, pronto]);

  const atualizar = useCallback((fn: (linhas: LinhaComanda[]) => LinhaComanda[]) => {
    setComanda((c) => {
      const linhas = fn(c.linhas);
      const base = c.linhas.length === 0 && linhas.length > 0 ? vazia() : c;
      return { ...base, linhas, atualizadaEm: Date.now() };
    });
  }, []);

  const adicionar = useCallback(
    (nova: Omit<LinhaComanda, "uid">) => {
      atualizar((linhas) => {
        const igual = linhas.find((l) => mesmaMontagem(l, nova));
        if (igual) return linhas.map((l) => (l === igual ? { ...l, qtd: l.qtd + nova.qtd } : l));
        return [...linhas, { ...nova, uid: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}` }];
      });
      setPulso((p) => p + 1);
    },
    [atualizar],
  );

  const alterarQtd = useCallback(
    (uid: string, qtd: number) =>
      atualizar((linhas) => (qtd <= 0 ? linhas.filter((l) => l.uid !== uid) : linhas.map((l) => (l.uid === uid ? { ...l, qtd } : l)))),
    [atualizar],
  );
  const remover = useCallback((uid: string) => atualizar((linhas) => linhas.filter((l) => l.uid !== uid)), [atualizar]);
  const esvaziar = useCallback(() => setComanda(vazia()), []);

  const valor = useMemo<Contexto>(() => {
    const linhas = resolverComanda(comanda);
    return {
      comanda,
      linhas,
      quantidade: linhas.reduce((s, l) => s + l.linha.qtd, 0),
      total: subtotal(linhas),
      adicionar,
      alterarQtd,
      remover,
      esvaziar,
      expiraEm: comanda.linhas.length ? comanda.atualizadaEm + VALIDADE_MS : null,
      aberta,
      abrir: () => setAberta(true),
      fechar: () => setAberta(false),
      itemAberto,
      abrirItem: (id) => setItemAberto(id),
      fecharItem: () => setItemAberto(null),
      pulso,
    };
  }, [comanda, adicionar, alterarQtd, remover, esvaziar, aberta, itemAberto, pulso]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useComanda() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useComanda precisa estar dentro de <ComandaProvider>");
  return c;
}
