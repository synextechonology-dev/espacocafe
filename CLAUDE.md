# CLAUDE.md: contexto para o Claude Code

Site da cafeteria **Espaço Café** (Santa Cruz do Rio Pardo, SP), feito pela Synex.
Cafeteria rústica e chique. O site precisa transmitir essa presença e funcionar perfeitamente no celular.

## Stack e regras

- Next.js 15 (App Router) + React 19 + TypeScript. **CSS puro** em `src/styles/`, sem Tailwind e sem biblioteca de UI.
- Conteúdo fica em `src/content/` (`site.ts`, `menu.ts`, `textos.ts`). Componentes não devem ter texto de negócio fixo que mude com frequência.
- Conversão **só pelo WhatsApp**. Não criar formulário que envie dados para servidor.
- Usar só as cores do manual (tokens em `src/styles/base.css`). Cobre em pequenas doses.
- Fontes: Cinzel (títulos) e Cormorant Garamond (texto), via `next/font/google` em `layout.tsx`.
- Não usar banco de imagens. Só fotos reais da cafeteria.
- Textos em português, tom "gentil como um convite". Sem travessão (—) nos textos do site.
- Respeitar `prefers-reduced-motion`. Alvos de toque com no mínimo 44 px.

## Primeira tarefa ao abrir o projeto

`npm run build` já passa sem erros. Para conferir: `npm run dev` e abrir `/?revisao=1`.

## Pendências

Ver `PREENCHER.md`. Resumo: fotos dos pratos, fotos do espaço em alta resolução, taxa e área de entrega, formas de pagamento, nome de um item de Bebidas quentes, história da casa e dúvidas reais.

## Pontos de atenção no código

- `ComandaProvider.tsx`: a comanda vive no `localStorage` (`espacocafe:comanda:v1`) e expira `site.pedidos.expiraEmMinutos` depois da última alteração. Ela é conferida ao carregar, a cada minuto e ao voltar para a aba.
- `lib/horario.ts`: o status aberto/fechado e os horários de agendamento usam o fuso `America/Sao_Paulo`, não o do visitante.
- `lib/pedido.ts > montarMensagem`: formato da mensagem do WhatsApp. Usa `*negrito*` e só caracteres simples.
- Marcas de item (`menu-types.ts > Marca`): `so-no-salao` bloqueia o pedido, `mais-18` exige confirmação de idade, `quente` mostra aviso na entrega, `consulte-opcoes` troca a observação por "Qual sabor você quer?".
- `FichaItem` e `PainelComanda` usam `<dialog>` nativo (`showModal`), então Esc e o foco funcionam sem biblioteca.
- `Foto.tsx`: sem `src`, mostra um espaço reservado na identidade da marca com o nome do arquivo esperado (visível em `?revisao=1`).
