# Espaço Café: site

Site da cafeteria Espaço Café (Santa Cruz do Rio Pardo, SP), com cardápio completo e pedido pelo WhatsApp.

Feito em Next.js (App Router), React e CSS puro, sem bibliotecas de interface.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # confere se está tudo certo para publicar
```

`http://localhost:3000/?revisao=1` destaca tudo que ainda falta preencher. A lista completa está em **PREENCHER.md**.

## Onde mudar cada coisa

| Quero mudar... | Arquivo |
|---|---|
| Preço, nome ou descrição de um item | `src/content/menu.ts` |
| Adicionais de uma categoria | `src/content/menu.ts` (campo `adicionais`) |
| Itens da vitrine (fotos grandes) | `src/content/menu.ts` (lista `vitrine` no fim) |
| Horário, WhatsApp, endereço, Instagram | `src/content/site.ts` |
| Taxa de entrega, formas de pagamento, tempo da comanda | `src/content/site.ts` > `pedidos` |
| Perguntas frequentes | `src/content/site.ts` > `duvidas` |
| Textos das seções, manifesto, faixa, sugestões da hora | `src/content/textos.ts` |
| Frase de cada destaque da vitrine | `src/content/menu.ts` (campo `chamada` em `vitrine`) |
| Cores e fontes | `src/styles/base.css` (bloco `:root`) |
| Fotos | `public/fotos/` (veja PREENCHER.md) |

## Estrutura

```
src/
  app/
    layout.tsx        fontes da marca, SEO, dados estruturados (Google)
    page.tsx          ordem das seções
    globals.css       importa os arquivos de estilo
    icon.svg          favicon com o monograma EC
  content/
    site.ts           dados da cafeteria, horário, dúvidas, legendas das fotos
    textos.ts         copy das seções e momentos do dia
    menu.ts           cardápio completo (2 cardápios, 24 categorias)
    menu-types.ts     tipos do cardápio
  lib/
    pedido.ts         cálculo da comanda e mensagem do WhatsApp
    horario.ts        aberto/fechado no fuso de São Paulo, horários para agendar
    format.ts         formato de preço e hora
  components/
    ComandaProvider   estado da comanda, salva no aparelho, esvazia após 1 hora
    Topo              primeira dobra: o selo "acende", anel de texto girando, luz que segue o mouse
    Faixa             sabores da casa correndo numa faixa cobre
    Manifesto         texto que "acende" palavra por palavra ao rolar + números do cardápio
    Vitrine           destaques em moldura de arco (foto ou ilustração em traço)
    HoraCerta         "Sugestão da hora": destaca o momento do dia pela hora de Santa Cruz
    Espaco            galeria do espaço: no computador a página trava e as fotos correm para o lado
    Cardapio          capas dos 2 cardápios, busca, atalhos, cartões de papel
    FichaItem         janela do item: tamanho, opções, adicionais, quantidade
    PainelComanda     comanda (canhoto de papel) e dados do pedido
    Secoes            Como pedir, Visite (mapa + rota no Google Maps), Dúvidas, Fidelidade, Rodapé
    Revelar           animação de entrada dos blocos ao rolar (só com JS e sem movimento reduzido)
  styles/
    base.css          tokens da marca, botões, campos, modo revisão
    secoes.css        cabeçalho e seções
    cardapio.css      cardápio no modelo do manual
    comanda.css       ficha do item e comanda
public/
  marca/              selo recortado, textura de arabesco, imagem de compartilhamento
  fotos/espaco/       fotos do estabelecimento
  fotos/cardapio/     fotos dos pratos (a preencher)
```

## Identidade visual

Tudo segue o manual da marca (2026):

- Cores: Espresso `#2E1A16`, Grão torrado `#43261F`, Cobre `#8C4A33`, Xícara `#5E3A2F`, Linho `#D8C9B1`, Creme `#F3EDE3`.
- Fontes: **Cinzel** nos títulos (caixa-alta, espaçamento aberto) e **Cormorant Garamond** nos textos e no cardápio.
- Elementos: arabesco recortado do próprio selo (`public/marca/arabesco.png`), filete com losango cobre, moldura oval.
- Os fundos das seções alternam entre Espresso, Creme, Grão torrado e Linho.
- Tom de voz: "gentil como um convite". Nada de "PROMOÇÃO IMPERDÍVEL!!!".

## Como funciona o pedido

1. O cliente toca no item, escolhe tamanho, opções e adicionais e anota na comanda.
2. A comanda fica salva no aparelho (localStorage) e esvazia sozinha 1 hora depois da última alteração.
3. Ao finalizar, ele escolhe retirada ou entrega, horário e pagamento.
4. O site abre o WhatsApp da cafeteria com a mensagem pronta: número da comanda, nome, endereço, itens com adicionais e valores, subtotal, taxa, pagamento e troco.

Nenhum dado do cliente é guardado em servidor. Tudo vai direto para a conversa no WhatsApp.

## Publicar

Na Vercel: importe o repositório e publique. Não precisa de variáveis de ambiente. Depois, ajuste `site.url` em `src/content/site.ts` para o domínio final.
