"use client";

import { useEffect } from "react";
import { agoraNaCafeteria } from "@/lib/horario";
import { StatusAberto } from "./StatusAberto";

/** Destaca a linha de hoje na tabela de horário e mostra se está aberto agora. */
export function HojeNoHorario() {
  useEffect(() => {
    const { dia } = agoraNaCafeteria();
    document.querySelectorAll<HTMLElement>(".visite__dia").forEach((el) => {
      const dias = (el.dataset.dias ?? "").split(",").map(Number);
      el.classList.toggle("visite__dia--hoje", dias.includes(dia));
    });
  }, []);
  return <StatusAberto className="visite__status" />;
}
