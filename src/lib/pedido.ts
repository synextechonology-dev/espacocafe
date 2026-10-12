import { itensPorId } from "@/content/menu";
import type { Categoria, Escolha, GrupoDeOpcoes, Item, Marca } from "@/content/menu-types";
import { site } from "@/content/site";
import { reais } from "./format";
import { hhmmCurto } from "./horario";

export interface LinhaComanda {
  uid: string;
  itemId: string;
  qtd: number;
  variacaoId?: string;
  /** grupoId -> ids das escolhas */
  escolhas: Record<string, string[]>;
  adicionais: string[];
  observacao?: string;
}

export interface Comanda {
  numero: string;
  criadaEm: number;
  atualizadaEm: number;
  linhas: LinhaComanda[];
}

export type Recebimento = "retirada" | "entrega";

export interface DadosPedido {
  nome: string;
  recebimento: Recebimento;
  quando: "agora" | "agendado";
  horario?: string;
  rotuloDia?: string;
  endereco?: { rua: string; bairro: string; complemento?: string; referencia?: string };
  pagamento: string;
  trocoPara?: string;
  observacoes?: string;
}

export const gruposDoItem = (item: Item, categoria: Categoria): GrupoDeOpcoes[] =>
  item.opcoes !== undefined ? item.opcoes : categoria.opcoes ?? [];

export const marcasDoItem = (item: Item, categoria: Categoria): Marca[] =>
  Array.from(new Set([...(categoria.marcas ?? []), ...(item.marcas ?? [])]));

export interface LinhaResolvida {
  linha: LinhaComanda;
  item: Item;
  categoria: Categoria;
  nome: string;
  detalhes: string[];
  adicionais: Escolha[];
  unitario: number;
  total: number;
  marcas: Marca[];
}

export function resolverLinha(linha: LinhaComanda): LinhaResolvida | null {
  const achado = itensPorId.get(linha.itemId);
  if (!achado) return null;
  const { item, categoria } = achado;
  const variacao = item.variacoes?.find((v) => v.id === linha.variacaoId);
  let unitario = variacao?.preco ?? item.preco;
  const detalhes: string[] = [];
  if (variacao) detalhes.push([variacao.nome, variacao.detalhe].filter(Boolean).join(", "));

  for (const grupo of gruposDoItem(item, categoria)) {
    const ids = linha.escolhas[grupo.id] ?? [];
    const escolhidas = grupo.escolhas.filter((e) => ids.includes(e.id));
    if (!escolhidas.length) continue;
    unitario += escolhidas.reduce((s, e) => s + (e.preco ?? 0), 0);
    detalhes.push(`${grupo.titulo.replace(/\?$/, "")}: ${escolhidas.map((e) => e.nome).join(", ")}`);
  }

  const adicionais = (categoria.adicionais ?? []).filter((a) => linha.adicionais.includes(a.id));
  unitario += adicionais.reduce((s, a) => s + (a.preco ?? 0), 0);

  return {
    linha,
    item,
    categoria,
    // Itens numerados (Tostex 4, Omelete 9...) levam o recheio no nome para a cafeteria conferir
    nome: /\s\d+$/.test(item.nome) && item.descricao ? `${item.nome} (${item.descricao})` : item.nome,
    detalhes,
    adicionais,
    unitario,
    total: unitario * linha.qtd,
    marcas: marcasDoItem(item, categoria),
  };
}

export const resolverComanda = (comanda: Comanda) =>
  comanda.linhas.map(resolverLinha).filter((l): l is LinhaResolvida => l !== null);

export const subtotal = (linhas: LinhaResolvida[]) => linhas.reduce((s, l) => s + l.total, 0);

/** Duas linhas com o mesmo item e as mesmas escolhas viram uma só. */
export const mesmaMontagem = (a: Omit<LinhaComanda, "uid" | "qtd">, b: Omit<LinhaComanda, "uid" | "qtd">) =>
  a.itemId === b.itemId &&
  a.variacaoId === b.variacaoId &&
  (a.observacao ?? "") === (b.observacao ?? "") &&
  JSON.stringify([...a.adicionais].sort()) === JSON.stringify([...b.adicionais].sort()) &&
  JSON.stringify(ordenar(a.escolhas)) === JSON.stringify(ordenar(b.escolhas));

const ordenar = (o: Record<string, string[]>) =>
  Object.keys(o)
    .sort()
    .map((k) => [k, [...o[k]].sort()]);

export const novoNumeroComanda = () => String(Math.floor(100 + Math.random() * 900));

/**
 * Mensagem que vai para o WhatsApp da cafeteria.
 * Usa *negrito* do WhatsApp e só caracteres simples para funcionar em qualquer aparelho.
 */
export function montarMensagem(comanda: Comanda, dados: DadosPedido) {
  const linhas = resolverComanda(comanda);
  const sub = subtotal(linhas);
  const taxa = dados.recebimento === "entrega" ? site.pedidos.entrega.taxa : null;
  const m: string[] = [];

  m.push(`*Pedido pelo site - Comanda nº ${comanda.numero}*`);
  m.push("");
  m.push(`*Nome:* ${dados.nome.trim()}`);
  m.push(`*Recebimento:* ${dados.recebimento === "entrega" ? "Entrega" : "Retirada no balcão"}`);

  if (dados.recebimento === "entrega" && dados.endereco) {
    const e = dados.endereco;
    m.push(`*Endereço:* ${e.rua.trim()} - ${e.bairro.trim()}`);
    if (e.complemento?.trim()) m.push(`*Complemento:* ${e.complemento.trim()}`);
    if (e.referencia?.trim()) m.push(`*Referência:* ${e.referencia.trim()}`);
  }

  m.push(
    `*Quando:* ${
      dados.quando === "agora" ? "O quanto antes" : `${dados.rotuloDia ?? "Hoje"}, às ${hhmmCurto(dados.horario ?? "")}`
    }`,
  );
  m.push("");
  m.push("*Itens*");

  for (const l of linhas) {
    m.push(`${l.linha.qtd}x ${l.nome} - ${reais(l.total)}`);
    for (const d of l.detalhes) m.push(`   ${d}`);
    for (const a of l.adicionais) m.push(`   + ${a.nome} (${reais(a.preco ?? 0)})`);
    if (l.linha.observacao?.trim()) m.push(`   Obs.: ${l.linha.observacao.trim()}`);
  }

  m.push("");
  m.push(`*Subtotal:* ${reais(sub)}`);
  if (dados.recebimento === "entrega") {
    m.push(`*Taxa de entrega:* ${taxa === null ? "a combinar" : reais(taxa)}`);
    m.push(`*Total:* ${taxa === null ? `${reais(sub)} + entrega` : reais(sub + taxa)}`);
  } else {
    m.push(`*Total:* ${reais(sub)}`);
  }

  let pagamento = dados.pagamento;
  if (dados.pagamento === "Dinheiro") {
    pagamento += dados.trocoPara?.trim() ? `, troco para R$ ${dados.trocoPara.trim()}` : ", sem troco";
  }
  m.push(`*Pagamento:* ${pagamento}`);

  if (dados.observacoes?.trim()) {
    m.push("");
    m.push(`*Observações:* ${dados.observacoes.trim()}`);
  }

  if (linhas.some((l) => l.marcas.includes("mais-18"))) {
    m.push("");
    m.push("Confirmo que tenho 18 anos ou mais.");
  }

  return m.join("\n");
}

export const linkWhatsApp = (texto: string) =>
  `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(texto)}`;
