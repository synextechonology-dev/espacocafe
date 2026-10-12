"use client";

import { useEffect, useState } from "react";

/**
 * Abra o site com ?revisao=1 para destacar tudo que ainda está pendente:
 * fotos que faltam, textos a confirmar e itens com dúvida no cardápio.
 * Em produção, sem o parâmetro, nada aparece.
 */
export function ModoRevisao() {
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const on = new URLSearchParams(window.location.search).has("revisao");
    setAtivo(on);
    document.documentElement.classList.toggle("modo-revisao", on);
  }, []);

  if (!ativo) return null;
  return (
    <div className="revisao-aviso" role="status">
      Modo revisão: itens em destaque ainda estão pendentes. Veja PREENCHER.md.
    </div>
  );
}
