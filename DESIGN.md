---
name: Semana Lixo Zero
description: Site e painel da Semana Lixo Zero de Caxias do Sul, na paleta e na tipografia do manual da campanha.
colors:
  forest: "#246352"
  forest-deep: "#153C31"
  cream: "#FFFCE6"
  sage: "#86B499"
  leaf: "#A5B798"
  primary-dark: "#26708C"
  primary-light: "#6AA0D1"
  secondary-dark: "#6D9B3E"
  secondary-light: "#BECC50"
  accent: "#36A339"
  warning: "#F2AF25"
  danger: "#D83624"
  purple: "#9178B5"
  dark: "#2E292C"
  light: "#FFFFFF"
typography:
  display:
    fontFamily: "Shrikhand, Barlow, serif"
    fontWeight: 400
    letterSpacing: "normal"
  headline:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 900
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 900
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontWeight: 300
  label:
    fontFamily: "\"Barlow Condensed\", Barlow, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.025em"
  accent:
    fontFamily: "Caveat, Barlow, cursive"
    fontWeight: 400
rounded:
  lg: "8px"
  xl: "12px"
  "3xl": "24px"
  full: "9999px"
spacing:
  control-x: "12px"
  control-y: "10px"
  button-x: "20px"
  button-y: "10px"
  card: "24px"
  container-x: "16px"
  section: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.forest-deep}"
    rounded: "{rounded.xl}"
    padding: "10px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.forest-deep}"
  button-secondary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.cream}"
    rounded: "{rounded.xl}"
    padding: "10px 20px"
  button-outline:
    backgroundColor: "{colors.light}"
    textColor: "{colors.forest}"
    rounded: "{rounded.xl}"
    padding: "10px 20px"
  button-ghost:
    textColor: "{colors.forest}"
    rounded: "{rounded.xl}"
    padding: "10px 20px"
  input:
    backgroundColor: "{colors.light}"
    textColor: "{colors.dark}"
    rounded: "{rounded.lg}"
    padding: "10px 12px"
    typography: "{typography.body}"
  card:
    backgroundColor: "{colors.light}"
    rounded: "{rounded.xl}"
    padding: "24px"
  card-campaign:
    backgroundColor: "{colors.light}"
    rounded: "{rounded.3xl}"
    padding: "24px"
  badge-primary:
    textColor: "{colors.forest}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
    typography: "{typography.label}"
---

# Design System: Semana Lixo Zero

## Overview

**Creative North Star: "O cartaz da campanha"**

A interface parte da arte oficial da Semana Lixo Zero 2026 e do manual institucional do ILZB. O fundo é creme, as faixas e o rodapé são verde-floresta, e os botões de ação são verde-sálvia. A tipografia pesada dos títulos imita o cartaz: Barlow Black, com Shrikhand reservada à assinatura da marca.

Há duas superfícies no mesmo sistema. O site público (início, agenda, sobre, parceiros) pode ter mais respiro, cartaz e imagem. O painel (ações, usuários, categorias, cotas, edições) é uma ferramenta: tabelas, formulários e cartões planos, com a marca nos detalhes e não num hero. As duas usam os mesmos tokens.

**Key Characteristics:**

- Paleta amostrada da arte da campanha, mais as cores semânticas do manual do ILZB.
- Barlow Black nos títulos, Barlow Light no corpo, Barlow Condensed nos rótulos.
- Cantos generosos nos botões e cartões; nada de retângulo afiado nem pílula genérica de SaaS.
- Profundidade curta: sombra leve no painel, sombra mais alta só no cartão de campanha.

## Colors

A campanha fala em verdes e creme. Azul, laranja, vermelho e roxo entram só como estado ou identidade institucional, nunca como tema de uma tela nova.

### Primary

- **Verde-floresta** (`{colors.forest}`): navbar, faixas, rodapé, títulos de seção e botão secundário.
- **Floresta profunda** (`{colors.forest-deep}`): texto e ícone sobre o sálvia. Existe porque floresta sobre sálvia fica perto de 3:1.
- **Sálvia** (`{colors.sage}`): botão primário e realces suaves, como o dia de hoje no calendário.
- **Folha** (`{colors.leaf}`): bordas, detalhes e o botão neutro.

### Secondary

- **Azul institucional** (`{colors.primary-dark}` e `{colors.primary-light}`): identidade do ILZB. Não substitui o verde da campanha em botões e faixas.
- **Verde institucional** (`{colors.secondary-dark}` e `{colors.secondary-light}`): segunda voz do manual. Uso pontual, não fundo de página.

### Tertiary

- **Acento vivo** (`{colors.accent}`): sucesso e confirmação.
- **Âmbar** (`{colors.warning}`): aviso. Texto sobre ele usa `{colors.dark}`.
- **Vermelho campanha** (`{colors.danger}`): erro, campo inválido e ação destrutiva.
- **Roxo institucional** (`{colors.purple}`): token do manual. Não vira gradiente, destaque de hero nem tema de tela.

### Neutral

- **Creme** (`{colors.cream}`): fundo da página e texto sobre o verde-floresta.
- **Tinta** (`{colors.dark}`): texto corrido.
- **Papel** (`{colors.light}`): cartões, campos e superfícies elevadas.

**The Sage Text Rule.** Texto sobre `{colors.sage}` usa `{colors.forest-deep}`. Não use `{colors.forest}` nem branco nesse fundo.

**The Campaign First Rule.** Uma tela nova usa floresta, creme, sálvia e folha. As cores institucionais só aparecem quando o estado semântico pede.

## Typography

**Display Font:** Shrikhand (com Barlow)
**Body Font:** Barlow (com system-ui)
**Label Font:** Barlow Condensed (com Barlow)
**Accent Font:** Caveat (com Barlow), no lugar de Dreaming Outloud Sans, que é comercial.

**Character:** O cartaz é uma sans pesada e condensada. Shrikhand é a assinatura, não o título da página. Caveat é o traço manuscrito, raro.

### Hierarchy

- **Display** (Shrikhand, peso 400): assinatura de marca. Não entra em título de seção, tabela ou formulário.
- **Headline** (Barlow 900, 2.25rem, tracking apertado): título de seção no site público.
- **Title** (Barlow 900, 1.25rem): título de cartão e bloco.
- **Body** (Barlow 300): texto corrido sobre `{colors.cream}` ou `{colors.light}`, em `{colors.dark}`.
- **Label** (Barlow Condensed 600, maiúsculas, tracking aberto): navegação, rótulo de campo e cabeçalho de tabela.
- **Accent** (Caveat): anotação manuscrita. Uma ocorrência por bloco, no máximo.

**The Signature Rule.** Shrikhand não substitui Barlow nos títulos. Se o texto informa, é Barlow. Se o texto assina a marca, é Shrikhand.

## Layout

O conteúdo senta num container central de no máximo 80rem, com respiro horizontal de 16px no celular, 24px a partir de 640px e 32px a partir de 1024px. Seções públicas usam o espaçamento `section` (6rem) entre blocos. Formulários agrupam campos com 20px entre grupos.

No painel, a densidade é a de uma ferramenta: cartão com 24px internos, tabela legível, ação primária à vista. No site público, o primeiro viewport mostra a campanha (marca, período, próxima ação), não um bloco de estatísticas genérico.

## Elevation & Depth

O sistema é quase plano. A cor da faixa separa as regiões; a sombra só confirma que um cartão está sobre o creme.

### Shadow Vocabulary

- **Painel** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): cartão administrativo em repouso, com fio `gray-100`.
- **Campanha** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): cartão público `.card-lixo`. No hover, sobe para a sombra extra (`0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`).

**The Flat Tool Rule.** Tabela, formulário e navbar não ganham sombra decorativa. Sombra é do cartão.

## Shapes

Botões e cartões do painel usam canto de 12px. Campos usam 8px. O cartão de campanha usa 24px. Selos e o botão de ícone são pílula. A borda de campo em repouso é cinza; no foco, vira floresta com anel de 2px. Botões também fecham o foco com anel de 2px e deslocamento de 2px.

## Components

Primitivos em `src/components/ui`. As classes `.btn-primary`, `.btn-secondary`, `.btn-outline` e `.card-lixo` em `src/styles.css` são o alias público e devem continuar visualmente iguais ao componente.

### Buttons

- **Shape:** canto de 12px, peso semibold, ícone e texto em linha com 8px de intervalo.
- **Primary:** fundo sálvia, texto floresta profunda, padding 10px 20px no tamanho médio.
- **Hover / Focus:** sálvia a 80% no primário; floresta a 90% no secundário. Foco com anel de 2px na cor da variante. Desabilitado fica a 50% de opacidade e sem clique.
- **Secondary:** fundo floresta, texto creme.
- **Outline:** borda de 2px floresta; no hover, preenche floresta e o texto vira creme.
- **Ghost e ícone:** sem fundo; hover com floresta a 10%. O ícone é pílula com padding de 8px.
- **Estados:** success, warning e danger existem para ação semântica, não para o botão padrão de uma tela.

### Chips

- **Style:** pílula, Barlow Condensed, maiúsculas, 12px. A variante primária é floresta a 10% com texto floresta.
- **State:** success, warning e danger seguem as cores semânticas. Neutro é cinza.

### Cards / Containers

- **Corner Style:** 12px no painel; 24px no cartão de campanha.
- **Background:** papel, com cabeçalho separado por fio e rodapé em creme.
- **Shadow Strategy:** sombra de painel; sombra de campanha só no cartão público.
- **Border:** fio cinza-claro no painel.
- **Internal Padding:** 24px no corpo.

### Inputs / Fields

- **Style:** papel, canto de 8px, borda cinza, texto tinta, 14px. Rótulo em Barlow Condensed maiúsculo. Obrigatório marca com asterisco na cor de erro.
- **Focus:** borda floresta e anel floresta a 30%.
- **Error / Disabled:** borda e anel vermelhos; desabilitado fica cinza, sem clique. Select usa a seta documentada em `.form-select-arrow`.

### Navigation

Barra floresta com texto creme e a marca à esquerda. Links em creme a 90%, hover branco. A ação principal da barra é o botão sálvia. No celular, o menu abre na mesma faixa verde. Atalhos de administração ficam numa faixa própria, abaixo, e não competem com os links públicos.

## Do's and Don'ts

### Do:

- **Do** reutilizar `Button`, `Card`, `Form`, `Badge`, `Table`, `Modal` e `Container` antes de criar markup solto.
- **Do** manter texto sobre sálvia em floresta profunda.
- **Do** usar `lucide-react` quando precisar de um ícone novo.
- **Do** tratar o painel como ferramenta: hierarquia curta, estados vazio, erro e carregando visíveis.

### Don't:

- **Don't** introduzir outra fonte, outra paleta ou uma biblioteca de componentes paralela.
- **Don't** usar Shrikhand em título de seção, tabela ou formulário.
- **Don't** pintar tela com gradiente roxo, glow ou cartão de vidro. Isso não está no manual.
- **Don't** colocar texto floresta direto sobre sálvia.
