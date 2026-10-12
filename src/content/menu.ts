/**
 * Cardápio completo do Espaço Café, transcrito do cardápio impresso (PDF 2026).
 *
 * Preços em reais. Para mudar um preço, edite o número aqui; o site e a
 * mensagem do pedido se atualizam sozinhos.
 *
 * Fotos: coloque o arquivo em /public/fotos/cardapio/ e preencha `foto` no item
 * ou `foto.src` na categoria.
 */
import type { Categoria, Escolha, GrupoDeOpcoes, Item, Variacao } from "./menu-types";

export const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type ItemSemId = Omit<Item, "id"> & { id?: string };
type CategoriaEntrada = Omit<Categoria, "itens"> & { itens: ItemSemId[] };

const ad = (nome: string, preco?: number): Escolha => ({ id: slug(nome), nome, preco });

const it = (nome: string, preco: number, descricao?: string, extra: Partial<Item> = {}): ItemSemId => ({
  nome,
  preco,
  descricao,
  ...extra,
});

const tam = (nome: string, detalhe: string | undefined, preco: number): Variacao => ({
  id: slug(`${nome}-${detalhe ?? ""}`),
  nome,
  detalhe,
  preco,
});

const comTamanhos = (
  nome: string,
  descricao: string | undefined,
  variacoes: Variacao[],
  extra: Partial<Item> = {},
): ItemSemId => ({
  nome,
  descricao,
  preco: Math.min(...variacoes.map((x) => x.preco)),
  variacoes,
  ...extra,
});

const umaDe = (id: string, titulo: string, nomes: (string | [string, number])[], obrigatorio = true): GrupoDeOpcoes => ({
  id,
  titulo,
  tipo: "uma",
  obrigatorio,
  escolhas: nomes.map((n) => (Array.isArray(n) ? ad(n[0], n[1]) : ad(n))),
});

function categoria(c: CategoriaEntrada): Categoria {
  return {
    ...c,
    itens: c.itens.map((item) => ({ ...item, id: item.id ?? `${c.id}--${slug(item.nome)}` })),
  };
}

const FRANGO =
  "Nosso frango é refogado e leva milho, ervilha, cheiro-verde e molho de tomate.";
const ENTREGA_QUENTE = "As bebidas podem perder temperatura conforme o tempo de entrega.";

/* ------------------------------------------------------------------ */
/* Adicionais compartilhados                                           */
/* ------------------------------------------------------------------ */

const ADICIONAIS_CAFE: Escolha[] = [
  ad("Chantilly", 4),
  ad("Leite", 4.5),
  ad("Leite vegetal", 6),
  ad("Nutella na borda", 7),
  ad("Doce de leite na borda", 4.5),
  ad("Porção de petit four (10 unidades)", 13),
  ad("Creme de pistache na borda", 7),
  ad("Ovomaltine cremoso na borda", 7),
];
const ADICIONAIS_QUENTES = ADICIONAIS_CAFE.filter((a) => a.id !== "leite");

const ADICIONAIS_RECHEIO_450: Escolha[] = [
  ad("Muçarela", 4.5),
  ad("Queijo branco", 4.5),
  ad("Requeijão", 4.5),
  ad("Cheddar", 4.5),
];

/* ------------------------------------------------------------------ */
/* Bebidas e saladas de frutas                                         */
/* ------------------------------------------------------------------ */

const bebidas: Categoria[] = [
  categoria({
    id: "cafes",
    cardapio: "bebidas",
    titulo: "Cafés",
    marcas: ["quente"],
    notas: [ENTREGA_QUENTE],
    foto: { alt: "Xícara de café espresso", arquivoSugerido: "cafes.webp" },
    itens: [
      it("Café espresso", 8, "60 ml"),
      it("Espresso curto", 8, "30 ml"),
      it("Espresso carioca", 8, "60 ml"),
      it("Espresso duplo", 13.5, "150 ml"),
      comTamanhos("Café coado", undefined, [tam("Simples", "até 150 ml", 10), tam("Duplo", "até 250 ml", 13.5)]),
      it("Café na prensa francesa", 15, "Até 200 ml"),
      comTamanhos("Espresso macchiato", "Café com espuma de leite", [
        tam("Simples", "60 ml", 9),
        tam("Duplo", "160 ml", 14),
      ]),
      comTamanhos("Café latte", "Café espresso com leite vaporizado", [tam("M", "160 ml", 12), tam("G", "250 ml", 14)]),
    ],
    adicionais: ADICIONAIS_CAFE,
  }),
  categoria({
    id: "cappuccinos",
    cardapio: "bebidas",
    titulo: "Cappuccinos",
    marcas: ["quente"],
    notas: [ENTREGA_QUENTE],
    foto: { alt: "Cappuccino crocante com Nutella na borda", arquivoSugerido: "cappuccinos.webp" },
    itens: [
      it("Cappuccino trufado", 13.5, "120 ml. Café espresso, chocolate ao leite e leite vaporizado"),
      comTamanhos("Cappuccino italiano", "Café espresso, chocolate em pó, canela e leite vaporizado", [
        tam("P", "70 ml", 9),
        tam("M", "160 ml", 12),
        tam("G", "250 ml", 14),
      ]),
      comTamanhos("Cappuccino da casa", "Cappuccino tradicional", [
        tam("P", "70 ml", 9),
        tam("M", "160 ml", 12),
        tam("G", "250 ml", 14),
      ]),
      comTamanhos("Cappuccino crocante", "Cappuccino, Nutella, Ovomaltine e chantilly", [
        tam("M", "160 ml", 16),
        tam("G", "250 ml", 19),
      ]),
      comTamanhos("Cappuccino paçoca", "Cappuccino, doce de leite, paçoca e chantilly", [
        tam("M", "160 ml", 15),
        tam("G", "250 ml", 18),
      ]),
    ],
    adicionais: ADICIONAIS_QUENTES,
  }),
  categoria({
    id: "bebidas-quentes",
    cardapio: "bebidas",
    titulo: "Bebidas quentes",
    marcas: ["quente"],
    notas: [ENTREGA_QUENTE],
    foto: { alt: "Choconinho e Ninho quente", arquivoSugerido: "bebidas-quentes.webp" },
    itens: [
      it("Moca", 15, "235 ml. Ganache de chocolate, café espresso e leite vaporizado", {
        pendente: "Nome cortado no print do cardápio. Confirmar o nome deste item.",
      }),
      it("Moca crocante", 15, "235 ml. Ovomaltine, café espresso e leite vaporizado"),
      it("Doce moca", 15, "235 ml. Leite Moça, café espresso e leite vaporizado"),
      it("Moca especial", 16, "235 ml. Ovomaltine, Leite Moça, café espresso e leite vaporizado"),
      it("Choconinho", 16, "235 ml. Leite Ninho, chocolate em pó, Leite Moça e leite"),
      it("Ninho quente", 16, "235 ml. Leite Ninho, Leite Moça e creme de leite"),
      it("Chocolate quente branco cremoso", 17.5, "235 ml. Chocolate branco, leite, especiarias e chantilly"),
      comTamanhos("Chocolate quente", "Chocolate quente tradicional", [
        tam("P", "70 ml", 9),
        tam("M", "160 ml", 12),
        tam("G", "250 ml", 14),
      ]),
      comTamanhos("Chocolate quente crocante", "Chocolate quente, Nutella, Ovomaltine e chantilly", [
        tam("M", "160 ml", 16),
        tam("G", "250 ml", 19),
      ]),
      comTamanhos("Achocolatado", "Leite com achocolatado", [tam("M", "160 ml", 8), tam("G", "250 ml", 11)]),
      it("Submarino", 10, "160 ml. Chocolate em gotas com leite vaporizado"),
      it("Doce de leite quente", 16, "235 ml. Doce de leite, leite, creme de leite e caramelo"),
      it("Choco s'more", 22, "235 ml. Chocolate quente, marshmallow, uma bola de sorvete, Nutella e brownie decorando", {
        marcas: ["so-no-salao"],
      }),
    ],
    adicionais: ADICIONAIS_QUENTES,
  }),
  categoria({
    id: "gelados-especiais",
    cardapio: "bebidas",
    titulo: "Gelados especiais",
    foto: { alt: "Shakerato servido em taça", arquivoSugerido: "gelados-especiais.webp" },
    itens: [
      it("Shakerato", 13, "250 ml. Espresso, creme de leite, gelo e açúcar"),
      it("Moca gelado", 17, "235 ml. Caramelo, chantilly, gelo, leite e espresso"),
      it("Café vienense", 20, "380 ml. Café espresso, sorvete de creme, leite, calda de chocolate e chantilly"),
      comTamanhos("Cappuccino ice", "Cappuccino, sorvete, calda e chantilly", [tam("P", "250 ml", 17), tam("G", "380 ml", 20)]),
      it("Frappé toffee", 20, "380 ml. Café, sorvete, doce de leite, paçoca e chantilly"),
      comTamanhos("Ice crocante", "Cappuccino, sorvete, Nutella, Ovomaltine e chantilly", [
        tam("P", "250 ml", 18),
        tam("G", "380 ml", 23),
      ]),
      it("Chocolate surpresa", 20, "235 ml. Sorvete de creme, chocolate quente, Ovomaltine cremoso e chantilly"),
      it("Chocolate gelado", 16, "380 ml. Leite, gelo, chocolate em pó, creme de leite, calda de chocolate e chantilly"),
      it("Gelado de Sonho de Valsa", 22, "235 ml. Chocolate gelado, uma bola de sorvete de creme, Sonho de Valsa cremoso, chantilly e um bombom decorando"),
      it("Gelado de Ouro Branco", 22, "235 ml. Chocolate gelado, uma bola de sorvete de chocolate, Ouro Branco cremoso, chantilly e um bombom decorando"),
      it("Latte crocante", 20, "400 ml. Chocolate meio amargo, gelo, leite e espresso", { marcas: ["copo-descartavel"] }),
    ],
  }),
  categoria({
    id: "milk-shakes",
    cardapio: "bebidas",
    titulo: "Milk shakes",
    notas: ["Todos com 500 ml."],
    foto: { alt: "Milk shakes de Kinder Bueno, morango e Ovomaltine", arquivoSugerido: "milk-shakes.webp" },
    itens: [
      it("Milk shake de cappuccino crocante", 27),
      it("Milk shake de Kinder Bueno", 27),
      it("Milk shake de Raffaello", 27),
      it("Milk shake de pistache", 27),
      it("Milk shake de Oreo", 25),
      it("Milk shake de Ovomaltine", 25),
      it("Milk shake de frutas vermelhas", 25),
      it("Milk shake de chocolate", 22),
      it("Milk shake de morango", 22),
    ],
  }),
  categoria({
    id: "bubble",
    cardapio: "bebidas",
    titulo: "Bubble",
    notas: ["500 ml. Todos os sabores pelo mesmo preço."],
    marcas: ["copo-descartavel"],
    foto: { alt: "Bubble verde com bolinhas de maçã verde", arquivoSugerido: "bubble.webp" },
    itens: [
      it("Bubble", 18, "Você escolhe o sabor da bebida e o sabor das bolinhas.", {
        opcoes: [
          umaDe("sabor-bebida", "Sabor da bebida", ["Frutas vermelhas", "Limão-siciliano", "Amora", "Maçã verde", "Tangerina", "Cranberry"]),
          umaDe("sabor-bubbles", "Sabor das bolinhas", ["Morango", "Maçã verde", "Blueberry", "Maracujá"]),
          {
            id: "complemento",
            titulo: "Quer completar?",
            tipo: "varias",
            escolhas: [ad("Leite fermentado", 4), ad("Água com gás", 4)],
          },
        ],
      }),
    ],
  }),
  categoria({
    id: "chas",
    cardapio: "bebidas",
    titulo: "Chás",
    foto: { alt: "Chá gelado de hibisco com limão", arquivoSugerido: "chas.webp" },
    itens: [
      it("Chá quente", 8, "150 ml. Sabores do dia", { marcas: ["quente", "consulte-opcoes"] }),
      it("Mate gelado de limão", 13, "380 ml"),
      it("Mate gelado de abacaxi", 13, "380 ml"),
      it("Mate gelado de Leite Ninho", 13, "380 ml"),
      it("Chá gelado de hibisco e limão", 15, "380 ml"),
    ],
  }),
  categoria({
    id: "sodas-italianas",
    cardapio: "bebidas",
    titulo: "Sodas italianas",
    notas: ["380 ml. Todos os sabores pelo mesmo preço."],
    foto: { alt: "Soda italiana colorida", arquivoSugerido: "sodas-italianas.webp" },
    itens: [
      it("Soda italiana", 15, undefined, {
        opcoes: [umaDe("sabor", "Sabor", ["Frutas vermelhas", "Limão-siciliano", "Amora", "Maçã verde", "Tangerina", "Cranberry"])],
      }),
    ],
  }),
  categoria({
    id: "smoothies",
    cardapio: "bebidas",
    titulo: "Smoothies",
    notas: ["Batido, 500 ml. Todos os sabores pelo mesmo preço."],
    foto: { alt: "Smoothie de açaí com morangos", arquivoSugerido: "smoothies.webp" },
    itens: [
      it("Smoothie", 22, undefined, {
        opcoes: [
          umaDe("sabor", "Sabor", [
            "Frutas vermelhas",
            "Frutas amarelas",
            "Piña colada",
            "Açaí com banana",
            "Açaí com morango",
            "Açaí com frutas vermelhas",
          ]),
        ],
      }),
    ],
  }),
  categoria({
    id: "sucos",
    cardapio: "bebidas",
    titulo: "Sucos",
    notas: ["Feitos com polpa. Só laranja e melancia são da fruta natural."],
    foto: { alt: "Sucos de melancia, manga e vitamina", arquivoSugerido: "sucos.webp" },
    itens: [
      it("Abacaxi", 12),
      it("Abacaxi com hortelã", 12),
      it("Acerola", 12),
      it("Amora", 12),
      it("Caju", 12),
      it("Coco", 12),
      it("Frutas vermelhas", 12),
      it("Laranja", 12),
      it("Limão", 12),
      it("Mamão", 12),
      it("Manga", 12),
      it("Maracujá", 12),
      it("Melancia", 12),
      it("Morango", 12),
      it("Uva", 12),
      it("Laranja com cenoura", 13),
      it("Açaí", 15),
      it("Laranja com capim-santo", 15),
      it("Limão com capim-santo", 15),
      it("Pink lemonade", 15),
      it("Vitamina com leite", 15),
      it("Laranja com açaí", 18),
      it("Laranja com vitamina", 18),
    ],
    adicionais: [
      ad("Whey protein 40 g", 9),
      ad("Leite", 4.5),
      ad("Leite vegetal", 6),
      ad("Mais uma fruta (polpa)", 6.5),
      ad("Leite Moça", 4),
      ad("Refrigerante", 7),
      ad("Gengibre", 0.5),
      ad("Água de coco", 8),
    ],
  }),
  categoria({
    id: "detox",
    cardapio: "bebidas",
    titulo: "Detox",
    notas: ["Todos com 500 ml."],
    foto: { alt: "Suco verde detox", arquivoSugerido: "detox.webp" },
    itens: [
      it("Detox 1", 16, "Abacaxi, hortelã, maçã, gengibre e couve"),
      it("Detox 2", 16, "Ameixa seca, abacaxi, linhaça e canela"),
      it("Detox 3", 16, "Maracujá, limão, coco, couve e gengibre"),
      it("Detox 4", 16, "Maracujá, morango, gengibre e cenoura"),
      it("Detox 5", 16, "Laranja, cenoura, couve, maçã e pó de guaraná"),
      it("Detox 6", 16, "Laranja, abacaxi, hortelã, canela e gengibre"),
      it("Detox 7", 16, "Chá verde, maçã, abacaxi e limão"),
      it("Detox 8", 16, "Chá de hibisco, melancia, maçã e gengibre"),
    ],
  }),
  categoria({
    id: "saladas-de-frutas",
    cardapio: "bebidas",
    titulo: "Saladas de frutas",
    foto: { alt: "Salada de frutas com suco de laranja", arquivoSugerido: "saladas-de-frutas.webp" },
    itens: [
      it("Salada de frutas", 12, "Sem acompanhamento"),
      it("Salada de frutas com suco de laranja", 16),
      it("Salada de frutas com creme de Leite Moça", 18),
      it("Salada de frutas com sorvete e chantilly", 18),
      it("Salada de frutas com iogurte, granola e mel", 20),
    ],
  }),
  categoria({
    id: "bebidas-18",
    cardapio: "bebidas",
    titulo: "Bebidas +18",
    marcas: ["mais-18"],
    aviso: "Venda proibida para menores de 18 anos. Beba com moderação.",
    foto: { alt: "Choco Amarula com chantilly", arquivoSugerido: "bebidas-18.webp" },
    itens: [
      it("Carajillo", 26, "250 ml. Licor 43, café espresso e gelo"),
      it("Irish coffee", 23, "120 ml. Uísque irlandês Jameson, café espresso, açúcar mascavo e chantilly"),
      it("Choco Amarula", 25, "235 ml. Chocolate quente, Amarula e chantilly"),
      it("Dolce coffee", 23, "320 ml. Café espresso, leite gelado, gelo, uma dose e meia de licor de doce de leite, espuma de leite e chocolate granulado", {
        pendente: "No cardápio impresso a marca do licor aparece como \"Bardera\". Confirmar o nome antes de exibir.",
      }),
      it("Aperol spritz", 28, "500 ml. Aperol, laranja, Schweppes Spritz e gelo"),
    ],
  }),
];

/* ------------------------------------------------------------------ */
/* Comidas e doces                                                     */
/* ------------------------------------------------------------------ */

const recheios = (prefixo: string, precos: number[], comOvo = true): ItemSemId[] => {
  const descricoes = [
    "Muçarela",
    "Requeijão",
    "Queijo branco",
    "Presunto e muçarela",
    "Presunto, muçarela, tomate e orégano",
    "Presunto, muçarela e requeijão",
    "Peito de peru com queijo branco",
    "Frango com requeijão",
    "Frango com queijo branco",
    "Muçarela, queijo branco e requeijão",
    "Frango com cheddar",
    "Frango com muçarela",
    "Só frango",
    "Atum com muçarela",
    "Ovo mexido e muçarela",
  ];
  return precos.map((preco, n) => it(`${prefixo} ${n + 1}`, preco, descricoes[n])).slice(0, comOvo ? 15 : 14);
};

const comidas: Categoria[] = [
  categoria({
    id: "acai",
    cardapio: "comidas",
    titulo: "Açaí",
    notas: ["Para viagem, monte do seu jeito com os adicionais."],
    foto: { alt: "Tigela de açaí", arquivoSugerido: "acai.webp" },
    itens: [comTamanhos("Açaí", undefined, [tam("150 g", undefined, 10), tam("300 g", undefined, 20)])],
    adicionais: [
      ad("Banana 75 g", 5),
      ad("Morango 75 g", 8),
      ad("Salada de frutas", 12),
      ad("Leite Ninho 25 g", 5),
      ad("Leite Moça 50 g", 6.5),
      ad("Whey protein 40 g", 9),
      ad("Nutella 60 g", 8.5),
      ad("Granola 50 g", 4.5),
      ad("Paçoca 40 g", 4.5),
      ad("Ovomaltine creme 60 g", 8.5),
      ad("Ovomaltine crocante 60 g", 5),
    ],
  }),
  categoria({
    id: "lanches-naturais",
    cardapio: "comidas",
    titulo: "Lanches naturais",
    notas: ["Acompanham alface, tomate, cenoura e maionese defumada.", FRANGO],
    foto: { alt: "Lanche natural no pão de forma", arquivoSugerido: "lanches-naturais.webp" },
    opcoes: [
      umaDe("pao", "Pão", ["Pão de forma tradicional", "Pão de forma integral", ["Pão francês", 3], ["Pão caseiro", 1.5]]),
    ],
    itens: [
      it("Frango", 14.5),
      it("Presunto e muçarela", 15),
      it("Peito de peru com queijo branco", 17),
      it("Frango com requeijão", 17),
      it("Frango com queijo branco", 17),
      it("Patê de atum", 17),
    ],
    adicionais: [ad("Ovo", 3)],
  }),
  categoria({
    id: "omeletes",
    cardapio: "comidas",
    titulo: "Omeletes",
    notas: ["Feitos com 3 ovos.", FRANGO],
    foto: { alt: "Omelete recheado com queijo derretido", arquivoSugerido: "omeletes.webp" },
    itens: [
      it("Omelete simples", 9),
      it("Ovo mexido", 9),
      ...recheios("Omelete", [15, 15, 15, 17, 18, 19, 19, 23, 23, 21, 23, 23, 18, 23], false),
    ],
    adicionais: [
      ad("Pão francês na chapa", 8.5),
      ad("Pão caseiro na chapa", 7.5),
      ad("Salada (alface, tomate, cenoura e palmito)", 8.5),
      ad("Tomate", 1.5),
      ad("Frango", 8),
      ad("Presunto", 4.5),
      ad("Peito de peru", 6),
      ...ADICIONAIS_RECHEIO_450,
    ],
  }),
  categoria({
    id: "tapiocas",
    cardapio: "comidas",
    titulo: "Tapiocas ou crepiocas",
    notas: [FRANGO],
    foto: { alt: "Tapioca recheada com frango", arquivoSugerido: "tapiocas.webp" },
    opcoes: [umaDe("massa", "Massa", ["Tapioca", "Crepioca"])],
    itens: [
      it("Tapioca ou crepioca sem recheio", 9),
      ...recheios("Tapioca ou crepioca", [12, 12, 12, 14.5, 16, 17, 17, 18, 18, 18, 18, 18, 15, 18, 18]),
      it("Tapioca com manteiga", 10, undefined, { opcoes: [] }),
    ],
    adicionais: [
      ad("Salada", 8.5),
      ad("Tomate", 1.5),
      ad("Frango", 8),
      ad("Presunto", 4.5),
      ad("Peito de peru", 6),
      ...ADICIONAIS_RECHEIO_450,
    ],
  }),
  categoria({
    id: "tapiocas-doces",
    cardapio: "comidas",
    titulo: "Tapiocas doces",
    foto: { alt: "Tapioca doce com Nutella e morango", arquivoSugerido: "tapiocas-doces.webp" },
    itens: [
      it("Leite Moça cremoso", 15),
      it("Romeu e Julieta", 16),
      it("Banana com muçarela e canela", 16),
      it("Doce de leite com coco", 16),
      it("Doce de leite com banana e canela", 18),
      it("Nutella", 20),
      it("Nutella com banana e canela", 23),
      it("Nutella com morango", 25),
    ],
  }),
  categoria({
    id: "tostex",
    cardapio: "comidas",
    titulo: "Tostex",
    notas: [FRANGO],
    foto: { alt: "Tostex de presunto e muçarela na chapa", arquivoSugerido: "tostex.webp" },
    opcoes: [
      umaDe("pao", "Pão", ["Pão de forma tradicional", "Pão de forma integral", ["Pão francês", 3], ["Pão caseiro", 1.5]]),
    ],
    itens: recheios("Tostex", [11, 11, 11, 12.5, 13, 14.5, 14.5, 16, 16, 16, 16, 16, 13.5, 16, 16]),
    adicionais: [
      ad("Ovo frito", 3),
      ad("Tomate", 1.5),
      ad("Frango", 8),
      ad("Presunto", 4.5),
      ad("Peito de peru", 6),
      ...ADICIONAIS_RECHEIO_450,
    ],
  }),
  categoria({
    id: "paes-de-queijo-recheados",
    cardapio: "comidas",
    titulo: "Pães de queijo recheados",
    notas: [FRANGO],
    foto: { alt: "Pão de queijo recheado com presunto", arquivoSugerido: "paes-de-queijo.webp" },
    itens: [
      ...recheios("Panini", [10.5, 10.5, 10.5, 12, 13, 14, 14, 15, 15, 15, 15, 15, 13], false).slice(0, 13),
      it("Panini Romeu e Julieta", 12, "Goiabada e queijo branco"),
      it("Pão de queijo com doce de leite", 14.5, "Pão de queijo tradicional recheado com doce de leite"),
      it("Pão de queijo com Nutella", 16.5, "Pão de queijo tradicional recheado com Nutella"),
    ],
    adicionais: [
      ad("Tomate", 1),
      ad("Frango", 5),
      ad("Presunto", 3),
      ad("Peito de peru", 3.5),
      ad("Muçarela", 3),
      ad("Queijo branco", 3),
      ad("Requeijão", 3),
      ad("Cheddar", 3),
    ],
  }),
  categoria({
    id: "casquinha",
    cardapio: "comidas",
    titulo: "Casquinha",
    foto: { alt: "Casquinha de queijo gratinado", arquivoSugerido: "casquinha.webp" },
    opcoes: [umaDe("pao", "Pão", ["Pão de queijo", "Pão de forma", "Pão caseiro", "Pão francês"])],
    itens: [
      it("Casquinha tradicional", 15),
      it("Casquinha Romeu e Julieta", 15),
      it("Casquinha doce de leite com requeijão", 15),
      it("Casquinha banana com doce de leite", 15),
      it("Casquinha meio tradicional, meio Nutella", 17),
      it("Casquinha com Nutella", 19),
    ],
    adicionais: [ad("Frango", 8), ad("Presunto", 4.5), ad("Peito de peru", 6), ...ADICIONAIS_RECHEIO_450],
  }),
  categoria({
    id: "salgados",
    cardapio: "comidas",
    titulo: "Salgados",
    foto: { alt: "Salgados assados e tortinhas", arquivoSugerido: "salgados.webp" },
    itens: [
      it("Pão de queijo", 7),
      it("Pão caseiro na chapa com manteiga", 7.5),
      it("Salgado assado", 8.5),
      it("Pão francês na chapa com manteiga", 8.5),
      it("Tortinha de frango", 10),
      it("Tortinha de palmito", 10),
      it("Tortinha de carne-seca com abóbora cabotiá", 10),
      it("Pastel de bacalhau", 12),
    ],
  }),
  categoria({
    id: "waffles",
    cardapio: "comidas",
    titulo: "Waffles",
    marcas: ["preparo-20"],
    notas: ["Tempo de preparo de 20 minutos."],
    foto: { alt: "Waffles empilhados com calda", arquivoSugerido: "waffles.webp" },
    itens: [
      it("Waffle tradicional", 13),
      it("Waffle de pão de queijo", 13),
      it("Waffle doce belga", 23, "Sorvete de creme e doce de leite"),
      it("Waffle choco belga", 25, "Sorvete de creme e Nutella"),
    ],
    adicionais: [
      ad("Manteiga 30 g", 4),
      ad("Mel 30 g", 4),
      ad("Banana 75 g", 5),
      ad("Goiabada 50 g", 5),
      ad("Doce de leite 60 g", 6),
      ad("Requeijão 50 g", 6),
      ad("Cheddar 50 g", 6),
      ad("Manteiga e mel (25 g cada)", 7),
      ad("Morango 75 g", 8),
      ad("Requeijão com goiabada (25 g cada)", 8),
      ad("Nutella 60 g", 8.5),
      ad("Creme de pistache 60 g", 8.5),
      ad("Maple syrup 50 g", 10),
    ],
  }),
  categoria({
    id: "doces-e-sobremesas",
    cardapio: "comidas",
    titulo: "Doces e sobremesas",
    notas: ["Bolos, tortas e bombons variam. Pergunte as opções do dia."],
    foto: { alt: "Grand gateau, cookie supremo, bolo de cenoura e torta Snickers", arquivoSugerido: "doces.webp" },
    itens: [
      it("Grand gateau", 45, undefined, { marcas: ["so-no-salao", "preparo-20"] }),
      it("Petit gateau", 26),
      it("Affogato de doce de leite", 18),
      it("Affogato de Nutella", 22),
      it("Sorvete com calda", 7.5, "Uma bola", { marcas: ["consulte-opcoes"] }),
      it("Brigadeiro", 4.5, "Unidade", { marcas: ["consulte-opcoes"] }),
      it("Bolo caseiro", 8, "Fatia", { marcas: ["consulte-opcoes"] }),
      it("Bolo gelado", 10, "Unidade", { marcas: ["consulte-opcoes"] }),
      it("Bolo recheado", 13, "Fatia", { marcas: ["consulte-opcoes"] }),
      it("Cupcake", 13.5, "Unidade", { marcas: ["consulte-opcoes"] }),
      it("Bolo no pote", 15, "Unidade", { marcas: ["consulte-opcoes"] }),
      it("Bolo fudge", 17, "Unidade", { marcas: ["consulte-opcoes"] }),
      it("Mini bolo caseiro", 30, undefined, { marcas: ["consulte-opcoes"] }),
      it("Cheesecake de frutas vermelhas", 17, "Fatia"),
      it("Cheesecake de Oreo", 17, "Fatia"),
      it("Torta três amores", 17, "Fatia"),
      it("Torta Snickers", 17, "Fatia"),
      it("Torta trufada", 17, "Fatia"),
      it("Torta paulista", 14, "Fatia"),
      it("Torta holandesa", 14, "Fatia"),
      it("Pastel de Belém", 11.5, "Unidade"),
      it("Romeu e Julieta", 10, "Queijo fresco com goiabada cremosa"),
      it("Mineirinho", 10, "Queijo fresco com doce de leite"),
      comTamanhos("Brownie", undefined, [tam("Tradicional", undefined, 10), tam("Recheado", undefined, 14)]),
      it("Brownie supremo", 20, "Brownie, uma bola de sorvete e Nutella"),
      it("Cookie", 14, "Unidade"),
      it("Cookie supremo", 20, "Cookie, uma bola de sorvete e Nutella"),
      it("Bombom no pote", 15, "Unidade", { marcas: ["consulte-opcoes"] }),
      it("Bombom de morango", 15, "Unidade", { marcas: ["consulte-opcoes"] }),
      it("Coxinha de morango", 15),
      it("Fondue de chocolate", 40, "Acompanha morango, banana, uva e manga"),
    ],
  }),
];

export const categorias: Categoria[] = [...bebidas, ...comidas];

export const cardapios = [
  { id: "bebidas" as const, titulo: "Bebidas e saladas de frutas", curto: "Bebidas" },
  { id: "comidas" as const, titulo: "Comidas e doces", curto: "Comidas" },
];

export const itensPorId = new Map<string, { item: Item; categoria: Categoria }>(
  categorias.flatMap((c) => c.itens.map((item) => [item.id, { item, categoria: c }] as const)),
);

/**
 * Itens da vitrine (seção "Os queridinhos da casa"). Use ids de `itensPorId`.
 * As fotos vêm de /public/fotos/cardapio/<arquivo>. Enquanto não houver foto,
 * aparece a ilustração em traço indicada em `ilustracao`.
 */
export type Ilustracao = "xicara" | "gateau" | "milkshake" | "waffle" | "tostex" | "torta";

export const vitrine: { id: string; arquivoSugerido: string; foto?: string; ilustracao: Ilustracao; chamada: string }[] = [
  {
    id: "cappuccinos--cappuccino-crocante",
    arquivoSugerido: "vitrine-cappuccino-crocante.webp",
    ilustracao: "xicara",
    chamada: "Nutella, Ovomaltine e chantilly sobre o cappuccino. O pedido de quem já se sente em casa.",
  },
  {
    id: "doces-e-sobremesas--grand-gateau",
    arquivoSugerido: "vitrine-grand-gateau.webp",
    ilustracao: "gateau",
    chamada: "Grande, quente por dentro e feito para dividir. Servido só aqui na casa, vale a visita.",
  },
  {
    id: "milk-shakes--milk-shake-de-kinder-bueno",
    arquivoSugerido: "vitrine-milk-shake-kinder-bueno.webp",
    ilustracao: "milkshake",
    chamada: "Meio litro gelado e cremoso para as tardes que pedem um agrado.",
  },
  {
    id: "waffles--waffle-choco-belga",
    arquivoSugerido: "vitrine-waffle.webp",
    ilustracao: "waffle",
    chamada: "Massa dourada, sorvete de creme e Nutella. Feito na hora, vale cada minuto de espera.",
  },
  {
    id: "tostex--tostex-15",
    arquivoSugerido: "vitrine-tostex-ovo.webp",
    ilustracao: "tostex",
    chamada: "Ovo mexido e muçarela no pão tostado. O café da manhã que abraça.",
  },
  {
    id: "doces-e-sobremesas--torta-snickers",
    arquivoSugerido: "vitrine-torta-snickers.webp",
    ilustracao: "torta",
    chamada: "Fatia generosa inspirada no clássico de chocolate, caramelo e amendoim.",
  },
];
