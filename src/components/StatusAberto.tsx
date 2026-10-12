"use client";

import { useEffect, useState } from "react";
import { situacao, type Situacao } from "@/lib/horario";

/** Selo "Aberto até 18h30" calculado no fuso da cafeteria. Atualiza a cada minuto. */
export function StatusAberto({ className = "" }: { className?: string }) {
  const [s, setS] = useState<Situacao | null>(null);

  useEffect(() => {
    const atualizar = () => setS(situacao());
    atualizar();
    const t = window.setInterval(atualizar, 60_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <p className={`status ${s ? (s.aberto ? "status--aberto" : "status--fechado") : ""} ${className}`} aria-live="polite">
      <span className="status__ponto" aria-hidden="true" />
      <span>{s ? s.resumo : "Consultando o horário"}</span>
    </p>
  );
}
