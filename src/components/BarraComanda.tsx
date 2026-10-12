"use client";

import { reais } from "@/lib/format";
import { useComanda } from "./ComandaProvider";

/** Barra fixa no rodapé do celular, aparece quando a comanda tem itens. */
export function BarraComanda() {
  const { quantidade, total, abrir, aberta, itemAberto } = useComanda();
  if (!quantidade || aberta || itemAberto) return null;
  return (
    <div className="barra-comanda">
      <button type="button" className="barra-comanda__botao" onClick={abrir}>
        <span>
          Ver comanda <span className="barra-comanda__qtd">({quantidade} {quantidade === 1 ? "item" : "itens"})</span>
        </span>
        <strong>{reais(total)}</strong>
      </button>
    </div>
  );
}
