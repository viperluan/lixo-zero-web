# Semana Lixo Zero

Frontend da Semana Lixo Zero de Caxias do Sul, a campanha do coletivo Caxias Lixo Zero, que representa o Instituto Lixo Zero Brasil (ILZB) na cidade desde 2020. A pessoa entra para conhecer a campanha, ver a agenda e cadastrar uma ação. Quem administra aprova ações e cuida da edição vigente.

Este repositório é só o cliente web. A API é outro serviço: `http://localhost:3000` em desenvolvimento e `VITE_API_URL` em produção. Não invente endpoints, campos ou regras de negócio que o código e a API ainda não têm.

## Leia antes de mudar qualquer coisa

- `PRODUCT.md` — para quem é o produto e o que ele faz.
- `DESIGN.md` — paleta, tipo e componentes. A marca não se inventa de novo.
- `docs/specs/` — especificações de funcionalidade. O formato deste projeto vale mais do que o padrão genérico de uma skill.

## Stack

React 18, Vite 5, React Router 6, Tailwind CSS 3, Formik e Yup nos formulários, Axios com JWT. Prettier com aspas simples, ponto e vírgula e linha de 100. Não há suíte de testes. Antes de encerrar, rode `npm run lint` e, se a mudança for de tela, confira no app que já está em `npm run start:dev`.

Ignore regras de Next.js, React Server Components e React 19. `use()` no lugar de `useContext` não entra aqui.

## Três superfícies

| Prefixo | Quem entra | O que faz |
| --- | --- | --- |
| `/` | Qualquer pessoa | Início, sobre, esqueci e redefinir senha. Layout em `src/layouts/Home.jsx`. |
| `/auth` | Cadastro e agenda são públicos; criar ação, minhas ações e parceiro exigem login | Fluxos de quem participa. Layout em `src/layouts/Auth.jsx`. |
| `/admin` | Só `TipoUsuario.Admin` (`'0'`) | Ações, usuários, categorias, cotas, parceiros e edições. Layout em `src/layouts/Admin.jsx`. |

A edição vigente (`EdicaoProvider`) define o período da campanha e se o cadastro de ações está aberto.

## Vocabulário

Use estas palavras na interface, nos comentários e nos docs.

- **Ação**: a atividade que alguém propõe para a semana (palestra, mutirão, oficina). A API fala `/acoes`. No código legado, pastas e rotas ainda dizem `events`; em texto visível, diga ação.
- **Edição**: a realização da campanha naquele ano, com datas de realização e de cadastro.
- **Situação da ação**: código na escrita (`0` pendente, `1` aprovada, `2` rejeitada) e texto em português na leitura da listagem. Não misture os dois.
- **Cota** e **categoria**: cadastros do painel, não seções do site público.
- **Parceiro**: patrocinador da edição.

## Onde o código mora

Alias `~` aponta para `src/`. Os prefixos `~api`, `~components`, `~context`, `~layouts`, `~views` e `~assets` estão no `vite.config.ts`.

- `src/views/` — páginas.
- `src/components/ui/` — primitivos (`Button`, `Card`, `Form`, `Table`, `Modal`, `Badge`). Reutilize antes de criar markup solto.
- `src/lib/` — tipos e regras do cliente (`acoes.ts`, `edicoes.ts`, `sessao.ts`).
- `src/api/index.ts` — o Axios. `silenciarErro: true` só em pedido decorativo, como a faixa da home.
- `src/Enumerados.js` — códigos que a API entende. Papel de sessão fica no cookie; o header é `Authorization: Bearer`.

Texto da interface em português do Brasil. Comentário de código explica o porquê, em português, e só quando o código sozinho não mostra.

## Como trabalhar

Funcionalidade nova, mudança ambígua, decisão de arquitetura ou trabalho que atravessa vários módulos: a skill `spec-driven-development` escreve a spec em `docs/specs/<slug>/` e para na revisão da pessoa antes do código.

Correção local e pedido já fechado: implemente direto. Não abra spec para trocar um texto, um espaçamento ou um bug de uma tela.

Segurança, sessão, dado pessoal, upload ou contrato da API: a skill `security-and-hardening`. Não grave segredo, não confie em dado que veio do navegador e não alargue o que a API já entrega para anônimo.

Tela e componente: `DESIGN.md`, tokens `brand-*` e o que está em `src/components/ui`. React: `vercel-react-best-practices`, só o que vale para SPA com Vite. Componente com muitos booleanos: `vercel-composition-patterns`. Código difícil de ler: `code-simplification`, sem reformatar o que a tarefa não pediu.

## O que registrar

- Spec viva em `docs/specs/<slug>/` quando a funcionalidade tiver spec. Se a decisão mudar no meio, atualize a spec antes de continuar.
- `docs/decisions/NNNN-titulo.md` quando a arquitetura mudar: rota, sessão, contrato com a API, estado global.
- `CHANGELOG.md` quando a pessoa que usa o site perceber a mudança. Correção interna sem efeito visível fica de fora.
