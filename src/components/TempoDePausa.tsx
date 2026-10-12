"use client";

import { useEffect, useState } from "react";

/** Um detalhe no rodapé: quanto tempo a pessoa já "pausou" no site. */
export function TempoDePausa() {
  const [segundos, setSegundos] = useState<number | null>(null);

  useEffect(() => {
    const inicio = Date.now();
    const atualizar = () => setSegundos(Math.floor((Date.now() - inicio) / 1000));
    atualizar();
    const t = window.setInterval(atualizar, 1000);
    return () => window.clearInterval(t);
  }, []);

  if (segundos === null) return <p className="pausa">&nbsp;</p>;

  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  const tempo = min > 0 ? `${min} min ${String(seg).padStart(2, "0")} s` : `${seg} s`;

  return (
    <p className="pausa">
      Você já está repousando com a gente há <strong>{tempo}</strong>.{" "}
      <span className="pausa__resto">Imagina com um cappuccino na mão.</span>
    </p>
  );
}
