# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Quem visita, em geral no celular ou no computador, quer entender a Semana Lixo Zero de Caxias do Sul, ver a programação e inscrever uma ação. Quem já tem conta acompanha as próprias ações. Quem administra o coletivo Caxias Lixo Zero aprova ou rejeita ações e mantém categorias, cotas, parceiros, usuários e a edição do ano.

## Product Purpose

O site publica a campanha e recebe as ações que vão compor a semana. O coletivo existe desde 2020 para educar o cidadão caxiense, mobilizar a cidade e encaminhar resíduos para a cadeia da reciclagem. Sucesso, neste cliente, é a pessoa achar a edição vigente, cadastrar uma ação e a administração moderar sem sair do fluxo.

## Positioning

A ação é proposta pelo público e confirmada por quem organiza a edição. A agenda mostra o que já foi aprovado. Um site institucional genérico não faz essa moderação nem amarra o conteúdo ao período da edição.

## Operating Context

O cliente conversa com a API da campanha. Em desenvolvimento a base é `http://localhost:3000`; em outros ambientes, `VITE_API_URL`. A sessão viaja em cookie e o Axios envia `Authorization: Bearer`. A edição vigente carrega as datas de realização e a data limite de cadastro. A interface está em português do Brasil.

## Capabilities and Constraints

Público: início, sobre, agenda, cadastro, recuperação de senha e pedido de ação autenticado. Administração, só com tipo admin: fila de ações, usuários, categorias, cotas, parceiros e edições.

Este repositório não persiste dados. Não há suíte de testes automatizados. Persistência, autorização definitiva e o formato dos recursos pertencem à API.

## Brand Commitments

O nome público é Semana Lixo Zero. O coletivo local é Caxias Lixo Zero, representação do ILZB em Caxias do Sul. A paleta, as fontes e os componentes da campanha estão em `DESIGN.md` e em `tailwind.config.js`. Texto de interface em português do Brasil.

## Evidence on Hand

A definição da campanha está em `src/views/about/index.jsx`. O mapa de rotas está em `src/routes.jsx` e nos layouts `Home`, `Auth` e `Admin`. O contrato de listagem de ações está em `src/lib/acoes.ts`. Arte e ícones da campanha estão em `src/assets/img/`. Não há depoimentos, preços nem métricas de audiência neste repositório; não os invente.

## Product Principles

- A unidade do produto é a ação da campanha.
- O site público convida, o painel organiza e a API persiste.
- A edição vigente delimita o período que a pessoa vê.
- A identidade visual da campanha permanece; o detalhe está em `DESIGN.md`.

## Accessibility & Inclusion

A interface é em português do Brasil. Texto sobre o verde-sálvia usa o verde floresta profundo, como `DESIGN.md` registra. Não há, neste repositório, um alvo formal de WCAG além dessa regra.
