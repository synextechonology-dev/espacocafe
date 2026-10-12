/**
 * Textos de apresentação do site (copy). Tudo que é frase de seção fica aqui,
 * para a dona poder ajustar o tom sem mexer nos componentes.
 *
 * Regra da marca: tom "gentil como um convite" e nada de travessão.
 */

export const textos = {
  topo: {
    chamada: "Cafeteria em Santa Cruz do Rio Pardo",
    apresentacao:
      "Café feito com calma, doces de vitrine e mesas de madeira esperando por você. Tradição de cafeteria, acolhimento de casa e o requinte dos pequenos detalhes.",
    anel: "Um lugar para repousar · Cafeteria · Santa Cruz do Rio Pardo · ",
    rolar: "Role devagar. Aqui ninguém tem pressa.",
  },

  /** Faixa que corre logo abaixo da primeira dobra. */
  faixa: [
    "Cappuccino crocante",
    "Pão de queijo quentinho",
    "Waffle choco belga",
    "Café na prensa francesa",
    "Tapioca de Nutella com morango",
    "Milk shake de pistache",
    "Torta trufada",
    "Chocolate quente branco cremoso",
    "Soda italiana",
  ],

  manifesto: {
    chamada: "A casa",
    texto:
      "Tem dia que pede pressa. Aqui, não. Escolha uma mesa, peça o café do seu jeito e deixe o relógio esperando lá fora. O resto a gente prepara com calma, do espresso curto à última fatia de torta.",
    assinatura: "Espaço Café",
  },

  vitrine: {
    chamada: "Da vitrine",
    titulo: "Os queridinhos da casa",
    linhaFina: "Seis convites para começar. Toque em um deles para ver os detalhes e anotar na sua comanda.",
  },

  horaCerta: {
    chamada: "Sugestão da hora",
    titulo: "Cada hora tem o seu café",
    fechado: "Enquanto a casa descansa, a comanda não fecha: monte seu pedido e agende para quando a gente abrir.",
  },

  cardapio: {
    chamada: "Cardápio",
    titulo: "Escolha sem pressa",
    linhaFina:
      "Dois cardápios, uma casa cheia de vontades. Toque em qualquer item para ver os detalhes e anotar na sua comanda.",
  },

  espaco: {
    chamada: "O espaço",
    titulo: "Feito para ficar mais um pouco",
    texto:
      "Mesas de madeira no salão, um mezanino com livros para quem gosta de demorar e a vitrine de doces bem no caminho do balcão.",
    /** PENDENTE: história da casa, contada pela dona (2 a 4 frases). */
    historia:
      "O Espaço Café nasceu da vontade de ter na cidade um lugar onde o café fosse servido com tempo, cuidado e conversa. Cada detalhe, da xícara ao arabesco na parede, foi pensado para você se sentir em casa.",
    convite: "Seu café está pronto. Fique à vontade.",
    dica: "Arraste para o lado",
    dicaRolar: "Continue rolando para entrar",
  },

  comoPedir: {
    chamada: "Pedido pelo site",
    titulo: "Do cardápio ao WhatsApp em três toques",
    passos: [
      {
        titulo: "Escolha no cardápio",
        texto: "Toque no item, escolha tamanho e adicionais e anote na sua comanda.",
      },
      {
        titulo: "Retirada ou entrega",
        texto: "Diga se vem buscar no balcão ou se prefere receber em casa, e para que horas.",
      },
      {
        titulo: "Envie pelo WhatsApp",
        texto: "A mensagem sai prontinha, com tudo que a gente precisa. É só enviar e esperar a confirmação.",
      },
    ],
    botao: "Montar minha comanda",
  },

  visite: {
    chamada: "Como chegar",
    titulo: "Venha tomar um café com a gente",
    texto: "Procure o letreiro iluminado e o selo na parede. É aqui que o relógio anda mais devagar.",
  },

  duvidas: {
    chamada: "Dúvidas",
    titulo: "Perguntas que sempre chegam",
    whatsapp: "Não achou o que procurava? Chama a gente no WhatsApp, a resposta vem por lá.",
  },

  rodape: {
    despedida: "Até o próximo café.",
  },
};

/**
 * Momentos do dia da seção "Sugestão da hora". O site descobre a hora atual
 * em Santa Cruz do Rio Pardo e destaca o momento certo.
 * `inicio` e `fim` em "HH:MM". `sugestoes` usa ids de itens do cardápio.
 */
export const momentosDoDia = [
  {
    inicio: "07:30",
    fim: "10:00",
    titulo: "Primeiro café",
    agora: "É hora do primeiro café",
    texto: "A cidade ainda acordando e o espresso já pronto. Comece leve e sem pressa.",
    sugestoes: ["cafes--cafe-coado", "salgados--pao-de-queijo", "tostex--tostex-15"],
  },
  {
    inicio: "10:00",
    fim: "12:00",
    titulo: "Pausa da manhã",
    agora: "É hora da pausa da manhã",
    texto: "Aquele intervalo que salva o dia. Algo fresco, algo gostoso, cinco minutos só seus.",
    sugestoes: ["detox--detox-1", "tapiocas--tapioca-ou-crepioca-8", "saladas-de-frutas--salada-de-frutas-com-iogurte-granola-e-mel"],
  },
  {
    inicio: "12:00",
    fim: "14:30",
    titulo: "Almoço leve",
    agora: "É hora de um almoço leve",
    texto: "Para quem quer comer bem sem pesar a tarde inteira.",
    sugestoes: ["omeletes--omelete-8", "lanches-naturais--frango-com-queijo-branco", "sucos--laranja-com-capim-santo"],
  },
  {
    inicio: "14:30",
    fim: "17:00",
    titulo: "Café da tarde",
    agora: "É hora do café da tarde",
    texto: "A hora mais doce da casa. Peça sem culpa e saboreie com calma.",
    sugestoes: ["cappuccinos--cappuccino-crocante", "doces-e-sobremesas--torta-trufada", "waffles--waffle-doce-belga"],
  },
  {
    inicio: "17:00",
    fim: "18:30",
    titulo: "Fim de tarde",
    agora: "É fim de tarde",
    texto: "O dia já foi. Agora é você, uma mesa e algo gelado para brindar.",
    sugestoes: ["milk-shakes--milk-shake-de-pistache", "bebidas-18--aperol-spritz", "doces-e-sobremesas--petit-gateau"],
  },
];
