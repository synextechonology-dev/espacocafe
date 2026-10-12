/**
 * Dados da cafeteria. Tudo que aparece no site e que pode mudar fica aqui.
 *
 * Campos com `pendente: true` (ou textos em PENDENTES) ainda precisam ser
 * confirmados com a dona. Abra o site com ?revisao=1 para ver tudo que está
 * pendente destacado na tela.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Expediente {
  dia: DiaSemana;
  abre: string; // "07:30"
  fecha: string; // "18:30"
}

export const site = {
  nome: "Espaço Café",
  complemento: "Cafeteria",
  slogan: "Um lugar para repousar.",
  apresentacao:
    "Tradição de cafeteria, acolhimento de casa e o requinte dos pequenos detalhes.",

  url: "https://www.espacocafecafeteria.com.br", // PENDENTE: domínio definitivo

  whatsapp: {
    numero: "5514998180995", // só dígitos, com DDI e DDD
    exibicao: "(14) 99818-0995",
  },

  instagram: {
    usuario: "espacocafecafeteria",
    url: "https://www.instagram.com/espacocafecafeteria/",
  },

  endereco: {
    logradouro: "Av. Dr. Ciro Melo Camarinha, 437",
    bairro: "", // PENDENTE: bairro
    cidade: "Santa Cruz do Rio Pardo",
    uf: "SP",
    cep: "18900-073",
    mapsUrl:
      "https://www.google.com/maps/place/espa%C3%A7o+caf%C3%A9+cafeteria+santa+cruz+do+rio+pardo/data=!4m2!3m1!1s0x94c06a376d221239:0x92ee16dc0bc8105f",
    /** Abre o Google Maps já com a rota até a cafeteria. */
    rotaUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Espa%C3%A7o+Caf%C3%A9+Cafeteria,+Av.+Dr.+Ciro+Melo+Camarinha,+437,+Santa+Cruz+do+Rio+Pardo+-+SP",
    mapsEmbed:
      "https://www.google.com/maps?q=Espa%C3%A7o+Caf%C3%A9+Cafeteria,+Av.+Dr.+Ciro+Melo+Camarinha,+437,+Santa+Cruz+do+Rio+Pardo+-+SP&output=embed",
  },

  fusoHorario: "America/Sao_Paulo",

  expediente: [
    { dia: 1, abre: "07:30", fecha: "18:30" },
    { dia: 2, abre: "07:30", fecha: "18:30" },
    { dia: 3, abre: "07:30", fecha: "18:30" },
    { dia: 4, abre: "07:30", fecha: "18:30" },
    { dia: 5, abre: "07:30", fecha: "18:30" },
    { dia: 6, abre: "08:00", fecha: "17:30" },
  ] as Expediente[],

  pedidos: {
    /** Tempo que a comanda fica guardada no aparelho depois da última alteração. */
    expiraEmMinutos: 60,
    /** Antecedência mínima para agendar uma retirada ou entrega. */
    antecedenciaMinutos: 20,
    /** Último horário de pedido = fechamento menos este valor. */
    encerraAntesDoFechamentoMinutos: 15,
    entrega: {
      ativa: true,
      /** null = taxa combinada pelo WhatsApp. Use um número (ex.: 5) para taxa fixa. */
      taxa: null as number | null, // PENDENTE: confirmar taxa e área de entrega
      area: "", // PENDENTE: ex.: "Atendemos toda a cidade de Santa Cruz do Rio Pardo"
    },
    pagamentos: ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"], // PENDENTE: confirmar
  },

  /**
   * Cartão fidelidade aparece no manual da marca ("o 10º café é por nossa conta").
   * Só ative se a cafeteria realmente oferece.
   */
  fidelidade: {
    ativo: false, // PENDENTE: confirmar se existe
    texto: "A cada 9 cafés carimbados, o 10º é por nossa conta.",
  },
};

/** Fotos do espaço (enviadas pela cafeteria). Troque por versões em alta resolução. */
export const fotosEspaco = [
  {
    src: "/fotos/espaco/fachada-noite.webp",
    alt: "Fachada do Espaço Café à noite, com o letreiro e o selo iluminados",
    largura: 613,
    altura: 392,
    titulo: "A fachada",
    legenda: "Quando escurece, o letreiro acende e a casa chama.",
  },
  {
    src: "/fotos/espaco/entrada.webp",
    alt: "Entrada com piso de madeira, portas pretas e gradil em losangos",
    largura: 585,
    altura: 434,
    titulo: "A chegada",
    legenda: "Piso de madeira, portas pretas e o cheiro de café que chega antes de você.",
  },
  {
    src: "/fotos/espaco/salao-externo.webp",
    alt: "Salão com mesas redondas de madeira, parede de pastilhas e o selo da casa",
    largura: 588,
    altura: 405,
    titulo: "O salão",
    legenda: "Mesas redondas de madeira, sempre com lugar para mais uma xícara.",
  },
  {
    src: "/fotos/espaco/balcao.webp",
    alt: "Balcão ripado de madeira com vitrine de doces e prateleiras",
    largura: 585,
    altura: 415,
    titulo: "O balcão",
    legenda: "A vitrine de doces fica bem no caminho. Foi de propósito.",
  },
  {
    src: "/fotos/espaco/mezanino.webp",
    alt: "Mezanino com mesinhas, estante de livros e painel ripado",
    largura: 573,
    altura: 410,
    titulo: "O mezanino",
    legenda: "Livros, mesinhas e luz boa. O cantinho de quem veio para ficar.",
  },
  {
    src: "/fotos/espaco/lavabo.webp",
    alt: "Lavabo com parede terracota, quadro de flores e cuba de pedra",
    largura: 587,
    altura: 411,
    titulo: "Os detalhes",
    legenda: "Até o lavabo tem flor na parede. Cuidado mora nos detalhes.",
  },
];

export interface Duvida {
  pergunta: string;
  resposta: string;
  pendente?: boolean;
}

/**
 * Dúvidas frequentes. As marcadas como pendentes usam informação que ainda não
 * foi confirmada. Peça para a dona a lista real de perguntas que ela recebe.
 */
export const duvidas: Duvida[] = [
  {
    pergunta: "Qual o horário de funcionamento?",
    resposta:
      "De segunda a sexta, das 7h30 às 18h30. Aos sábados, das 8h às 17h30. Aos domingos a casa fecha.",
  },
  {
    pergunta: "Vocês fazem entrega?",
    resposta:
      "Fazemos. Monte sua comanda aqui no site, escolha entrega e envie pelo WhatsApp. A taxa e o tempo de entrega a gente confirma na conversa.",
    pendente: true,
  },
  {
    pergunta: "Como faço para retirar no balcão?",
    resposta:
      "Escolha os itens, toque em Retirar no balcão e diga se quer o pedido o quanto antes ou num horário marcado. Quando chegar, é só dizer seu nome.",
  },
  {
    pergunta: "Posso tirar um ingrediente do prato?",
    resposta:
      "Não alteramos produtos com valores diferentes, apenas incluímos adicional. Os adicionais aparecem quando você toca no item.",
  },
  {
    pergunta: "Tem opção sem glúten ou sem lactose?",
    resposta:
      "Nossos produtos podem conter glúten e lactose. Se você tem alergia ou intolerância, fale com a gente pelo WhatsApp antes de pedir.",
  },
  {
    pergunta: "Os sucos são naturais?",
    resposta:
      "Os sucos são feitos com polpa. Só os de laranja e de melancia são da fruta natural.",
  },
  {
    pergunta: "Todos os itens podem ir para entrega?",
    resposta:
      "Quase todos. O grand gateau e o choco s'more são servidos só aqui na casa. Bebidas quentes podem perder temperatura no caminho.",
  },
  {
    pergunta: "Quais formas de pagamento vocês aceitam?",
    resposta: "Pix, cartão de crédito, cartão de débito e dinheiro.",
    pendente: true,
  },
];
