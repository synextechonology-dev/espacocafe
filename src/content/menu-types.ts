export type Cardapio = "bebidas" | "comidas";

/** Marcações que mudam o comportamento do item no pedido. */
export type Marca =
  | "so-no-salao" // não pode ir para retirada/entrega
  | "preparo-20" // tempo de preparo de 20 minutos
  | "copo-descartavel" // servido só em copo descartável
  | "mais-18" // bebida alcoólica
  | "quente" // pode perder temperatura na entrega
  | "consulte-opcoes"; // sabor do dia, combinado na observação

export interface Escolha {
  id: string;
  nome: string;
  preco?: number; // acréscimo em reais
}

export interface GrupoDeOpcoes {
  id: string;
  titulo: string;
  tipo: "uma" | "varias";
  obrigatorio?: boolean;
  escolhas: Escolha[];
}

export interface Variacao {
  id: string;
  nome: string; // "P"
  detalhe?: string; // "70 ml"
  preco: number;
}

export interface Item {
  id: string;
  nome: string;
  descricao?: string;
  preco: number; // preço base (ou da menor variação)
  variacoes?: Variacao[];
  opcoes?: GrupoDeOpcoes[];
  marcas?: Marca[];
  foto?: string; // /fotos/cardapio/<arquivo>.webp
  pendente?: string; // o que falta confirmar
}

export interface Categoria {
  id: string;
  cardapio: Cardapio;
  titulo: string;
  notas?: string[];
  itens: Item[];
  /** Adicionais da categoria. Aparecem no rodapé do cartão e em cada item. */
  adicionais?: Escolha[];
  /** Opções que valem para todos os itens da categoria (ex.: tipo de pão). */
  opcoes?: GrupoDeOpcoes[];
  marcas?: Marca[];
  foto?: { src?: string; alt: string; arquivoSugerido: string };
  /** Aviso exibido no topo da categoria (ex.: +18). */
  aviso?: string;
}
