# O que falta preencher: Espaço Café

Abra o site com `?revisao=1` no final do endereço (ex.: `localhost:3000/?revisao=1`).
Tudo que ainda está pendente aparece com borda rosa e uma etiqueta.

## 1. Confirmar com a dona

| O quê | Onde mexer | Situação hoje |
|---|---|---|
| Nome do 1º item de **Bebidas quentes** (R$ 15,00, ganache de chocolate, café espresso e leite vaporizado). O nome ficou coberto no print do cardápio. | `src/content/menu.ts`, item com `pendente` | Coloquei "Moca" provisório |
| Marca do licor do **Dolce coffee** (no impresso: "Bardera") | `src/content/menu.ts` | Texto diz "licor de doce de leite" |
| **Taxa de entrega** e **área atendida** | `src/content/site.ts` > `pedidos.entrega` | "A combinar pelo WhatsApp" |
| **Formas de pagamento** | `src/content/site.ts` > `pedidos.pagamentos` | Pix, crédito, débito, dinheiro |
| **Bairro** do endereço | `src/content/site.ts` > `endereco.bairro` | Vazio |
| Grafia da avenida: **Ciro** ou **Cyro** Melo Camarinha? (o endereço enviado tinha os dois) | `src/content/site.ts` | "Av. Dr. Ciro Melo Camarinha, 437" |
| **História da casa** (2 a 4 frases, na voz dela) | `src/content/textos.ts` > `espaco.historia` | Texto provisório genérico, sem datas nem fatos inventados |
| **Lista real de dúvidas** que ela recebe | `src/content/site.ts` > `duvidas` | 8 perguntas; 2 marcadas como pendentes |
| O **cartão fidelidade** do manual ("o 10º café é por nossa conta") existe de verdade? | `src/content/site.ts` > `fidelidade.ativo` | Desligado |
| "Bolo de cenoura" aparece numa foto do cardápio, mas não está na lista de preços | `src/content/menu.ts` | Não incluído |
| Domínio do site | `src/content/site.ts` > `url` | Provisório |

## 2. Grafias que corrigi no site

Eram erros de digitação no cardápio impresso. Se a dona preferir como estava, é só trocar o texto em `src/content/menu.ts`.

| No impresso | No site |
|---|---|
| Espresso Machiatto | Espresso macchiato |
| Afogatto | Affogato |
| Carajilo | Carajillo |
| Irish Coffe | Irish coffee |
| Whisky Irlandes Jamerson | Uísque irlandês Jameson |
| Milk Shake de Rafaello | Milk shake de Raffaello |
| Choco Smore | Choco s'more |
| Laranja com Campim Santo | Laranja com capim-santo |
| Doce de Leite com Côco / Água de Côco | coco |
| Cheesecake de Óreo | Cheesecake de Oreo |
| Mapple Syrup | Maple syrup |
| Abóbora Cabotiã | abóbora cabotiá |
| Café Expresso (Dolce Coffee) | café espresso |

Também deixei os nomes em caixa normal ("Cappuccino italiano" em vez de "Cappuccino Italiano"). A fonte Cinzel desenha tudo em versalete, então na tela aparece igual.

## 3. Fotos

Formato recomendado: `.webp` ou `.jpg`, lado maior com 1600 px, abaixo de 300 KB.

**Fotos do espaço** (`public/fotos/espaco/`): as 6 que vieram estão com cerca de 600 px de largura (são prints). Funcionam, mas ficam um pouco borradas em telas grandes. Peça os arquivos originais e substitua mantendo os mesmos nomes:
`fachada-noite`, `entrada`, `salao-externo`, `balcao`, `mezanino`, `lavabo`.

**Vitrine** (`public/fotos/cardapio/`), formato vertical 4:5. Enquanto não há foto, cada item mostra uma ilustração em traço da marca. Depois de colocar o arquivo, preencha `foto: "/fotos/cardapio/<arquivo>"` em `vitrine` no fim de `src/content/menu.ts` (a foto substitui a ilustração sozinha):
- `vitrine-cappuccino-crocante.webp`
- `vitrine-grand-gateau.webp`
- `vitrine-milk-shake-kinder-bueno.webp`
- `vitrine-waffle.webp`
- `vitrine-tostex-ovo.webp`
- `vitrine-torta-snickers.webp`

**Uma por categoria** (`public/fotos/cardapio/`), formato horizontal 2:1. Sem foto, o cartão da categoria fica só com o texto (o espaço reservado aparece apenas em `?revisao=1`). Preencha `foto.src` da categoria em `menu.ts`:
`cafes`, `cappuccinos`, `bebidas-quentes`, `gelados-especiais`, `milk-shakes`, `bubble`, `chas`, `sodas-italianas`, `smoothies`, `sucos`, `detox`, `saladas-de-frutas`, `bebidas-18`, `acai`, `lanches-naturais`, `omeletes`, `tapiocas`, `tapiocas-doces`, `tostex`, `paes-de-queijo`, `casquinha`, `salgados`, `waffles`, `doces`.

**Foto de um item específico** (opcional): preencha `foto` no próprio item. Ela aparece na ficha que abre ao tocar no item.

O cardápio em PDF da cafeteria já tem fotos de vários produtos (açaí, omelete, tostex, waffle, milk shakes, doces). Dá para recortar de lá enquanto não houver fotos novas.

## 4. Decisões que tomei (dá para mudar)

- **A comanda esvazia 1 hora depois da última alteração**, não da primeira. Assim quem ainda está montando o pedido não perde tudo no meio. Para contar a partir do primeiro item, troque `atualizadaEm` por `criadaEm` na verificação de `ComandaProvider.tsx`. O tempo fica em `site.ts` > `pedidos.expiraEmMinutos`.
- **Grand gateau** e **Choco s'more** aparecem no cardápio, mas não podem ser pedidos pelo site, porque o impresso diz "apenas consumo no local".
- **Bebidas +18** exigem marcar "Tenho 18 anos ou mais" antes de enviar o pedido.
- Itens de tamanhos diferentes (P/M/G, simples/duplo) viraram **um item com escolha de tamanho**, para o cardápio não repetir a mesma descrição três vezes.
- Tapiocas: "Tapioca ou crepioca 1 a 15", e o cliente escolhe a massa na ficha.
- Lanches naturais e Tostex: o cliente escolhe o pão (forma tradicional, integral, francês +3,00 ou caseiro +1,50).
- Não há campo para "tirar ingrediente". O cardápio diz "não alteramos produtos com valores diferentes, apenas incluímos adicional", e o site repete esse aviso.
- Fora do horário, o pedido pode ser montado e agendado para o próximo horário de abertura.

## 5. Textos do site (copy)

Todos os textos de apresentação ficam em `src/content/textos.ts`: chamada da primeira dobra, faixa de sabores, manifesto, títulos das seções, legendas e o "Sugestão da hora". As frases de cada destaque da vitrine ficam no campo `chamada` da lista `vitrine` em `src/content/menu.ts`, e as legendas das fotos do espaço em `fotosEspaco` (`src/content/site.ts`).

**Sugestão da hora** (`momentosDoDia` em `textos.ts`): o site lê a hora atual em Santa Cruz do Rio Pardo e destaca o momento do dia, com 3 sugestões do cardápio. Vale mostrar para a dona e trocar as sugestões pelas que ela mais gosta de indicar.
