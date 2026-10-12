const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const numero = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "R$ 13,50" */
export const reais = (valor: number) => brl.format(valor).replace(/ /g, " ");

/** "13,50" (usado no cardápio, como no impresso) */
export const preco = (valor: number) => numero.format(valor);

/** "7h30", "18h30", "8h" */
export const hora = (hhmm: string) => {
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
};
