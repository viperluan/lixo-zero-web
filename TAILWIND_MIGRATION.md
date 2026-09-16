# Migração para Tailwind CSS — Lixo Zero

Status: **concluída**. O projeto não depende mais de Bootstrap, Reactstrap nem do
template Argon Dashboard.

## Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS 3 (paleta e tipografia da marca)
- Lucide React (ícones de interface) e React Icons (ícones de marca)
- React Router 6, Formik + Yup, Axios, React Toastify

## Biblioteca de componentes

Tudo que vinha do Reactstrap foi reescrito em `src/components/ui/` (TypeScript,
tipado, sem dependências externas além do Lucide):

| Arquivo | Exporta |
| --- | --- |
| `Button.tsx` | `Button` — variantes `primary`, `secondary`, `success`, `warning`, `danger`, `neutral`, `outline`, `ghost`, `icon`; tamanhos `sm`/`md`/`lg` |
| `ActionLink.tsx` | `ActionLink` — CTA com ícone em círculo, tons `sage` (pílula da faixa) e `bare` (rodapé dos cards) |
| `Card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardBody`, `CardFooter` |
| `Form.tsx` | `FormGroup`, `Label`, `HelpText`, `FieldError`, `Input`, `Textarea`, `Select`, `Checkbox` |
| `Modal.tsx` | `Modal`, `ModalHeader`, `ModalBody`, `ModalFooter` — portal no body, trava de scroll, fecha com Esc/backdrop |
| `Table.tsx` | `Table`, `Thead`, `Th`, `Tbody`, `Tr`, `Td`, `Tdh`, `TableEmpty` — rolagem horizontal no wrapper |
| `Pagination.tsx` | `Pagination` — janela de páginas em vez de listar todas |
| `Dropdown.tsx` | `Dropdown`, `DropdownHeader`, `DropdownDivider`, `DropdownItem` |
| `Collapse.tsx` | `Collapse` — anima a altura real do conteúdo |
| `Badge.tsx`, `Spinner.tsx`, `Container.tsx` | `Badge`, `Spinner`, `Container` |

Importe sempre pelo barrel:

```jsx
import { Button, Card, CardBody, Input } from '~components/ui';
```

Além desses, três componentes de domínio montados sobre a biblioteca:

| Componente | Papel |
| --- | --- |
| `~components/ActionStatusBadge` | Cor e rótulo da **situação** — listagem admin, "minhas ações", legenda do calendário e linhas da agenda |
| `~components/ActionFormatBadge` | Cor, ícone e rótulo da **forma de realização** — espelha o anterior; agenda e home |
| `~components/ActionAgenda` | A programação em lista agrupada por dia (visão padrão de `/auth/schedule`) |
| `~components/UpcomingActions` | Faixa "Próximas ações" da home; busca sozinha e não renderiza nada se falhar |

Os dois primeiros são indexados pelo **rótulo em português** que a API devolve,
não pelo enum de `~/Enumerados` — a API traduz na saída mas espera os códigos
nos filtros. Cuidado com `'Hibrida'`: a API devolve sem acento, o enum do front
com. `ActionFormatBadge` aceita as duas grafias por isso.

Ordenação e formatação de data das listagens ficam em `~/lib/acoes`
(`ordenarPorData`, `agruparPorDia`, `formatarChipDeData`, `ehFutura`, …). A API
**não** ordena a listagem paginada por conta própria, então toda lista
cronológica passa por ali.

## Paleta e tipografia

Definidas em `tailwind.config.js` e carregadas em `index.html`. A interface segue
a arte da 7ª Semana Lixo Zero; as cores foram amostradas da própria arte:

```javascript
brand: {
  forest:        '#246352',  // navbar, faixas, rodapé, seções
  'forest-deep': '#153C31',  // texto sobre o sage (contraste)
  cream:         '#FFFCE6',  // fundo do hero e texto sobre o verde
  sage:          '#86B499',  // botões
  leaf:          '#A5B798',  // folhas: bordas e detalhes
  // ... paleta institucional do manual (primary-*, secondary-*, accent,
  //     warning, danger, purple, dark, light) segue disponível para
  //     estados semânticos e para o material do ILZB.
}
```

`forest-deep` existe por um motivo específico: rótulo em `forest` sobre `sage`
dá 3,0:1 de contraste e só passa no WCAG AA em texto grande. `forest-deep`
sobre `sage` dá 5,2:1 e vale para qualquer tamanho. Use-o em todo texto que
fique sobre o verde claro.

### As cinco fontes do manual

| Token | Fonte | Onde |
| --- | --- | --- |
| `font-sans` + `font-black` | **Barlow Black** | todos os títulos (`h1`–`h6` já saem assim pelo `@layer base`) |
| `font-sans` (padrão, 300) | **Barlow Light** | corpo de texto |
| `font-condensed` | **Barlow Condensed** | navegação, rótulos de formulário, cabeçalho de tabela, badges — via `.label-condensed` |
| `font-display` | **Shrikhand** | assinatura da marca: o `404` e o nome no rodapé |
| `font-accent` | **Caveat** | frases manuscritas de apoio |

`Dreaming Outloud Sans`, a quinta fonte do manual, é comercial (My Creative
Land, distribuída pela Adobe Fonts) e não tem versão web livre — `font-accent`
usa **Caveat** no lugar dela. Para migrar para a fonte oficial, troque o
`family=Caveat` no `index.html` pelo kit do Adobe Fonts e o nome em
`fontFamily.accent`; nenhum componente precisa mudar.

### Arte da campanha

Os assets do hero ficam em `src/assets/img/brand/` e foram recortados da arte
oficial (`banner site SLZ 2026.zip` e a capa do formulário):

| Arquivo | Papel |
| --- | --- |
| `hero-folhas.webp` | faixa de folhas, usada como `background-image` do hero |
| `hero-logo.webp` | logo "SEMANA 7 LIXO ZERO — CAXIAS DO SUL" |
| `hero-selo.webp` | selo "TRANSFORMANDO / IDEIAS EM AÇÕES!" |
| `icone-lixo-zero.png` | símbolo do coletivo na navbar (PNG com alpha, vai sobre o verde) |

O hero é montado em três camadas em `~components/HeroBanner` em vez de uma
imagem única: no celular a faixa de folhas encolhe até sumir, e o logo
sobreposto continua no tamanho certo. O componente é usado na home e no
"sobre", como na arte.

## Classes utilitárias em `src/styles.css`

`.btn-primary`, `.btn-secondary`, `.btn-outline`, `.card-lixo`,
`.section-title`, `.label-condensed` e `.form-select-arrow`.

O arquivo também estiliza `react-datetime` e `react-big-calendar`, que antes
herdavam a aparência do Bootstrap.

## Como rodar

```bash
npm install
npm run start:dev     # http://localhost:5173
npm run build         # tsc -b && vite build
npm run start         # preview do build em http://localhost:4173
npm run lint
```

O front consome a API do repositório `lixo-zero-api`. Em desenvolvimento
`src/api/index.ts` aponta para `http://localhost:3000` — a variável
`VITE_API_URL` só vale em produção.

## Convenções

Use a paleta, nunca cores literais:

```jsx
<button className="bg-brand-forest text-brand-cream">   // certo
<button style={{ backgroundColor: '#246352' }}>         // evitar
```

Mobile-first:

```jsx
<div className="text-sm md:text-base lg:text-lg px-4 md:px-6">
```

Ícones de interface vêm do Lucide; ícones de marca (redes sociais) vêm do
React Icons, porque o Lucide v1 removeu esse conjunto.

```jsx
import { Calendar } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
```

## Detalhes de build

- `vite.config.ts` usa alias em formato de array porque o `moment` precisa de
  match exato: com match por prefixo o `moment/locale/pt-br` também seria
  reescrito e o calendário voltaria a renderizar em inglês.
- `src/lib/moment.ts` é o único ponto que registra o locale pt-br.
- `manualChunks` separa `react`, `calendar` (moment + big-calendar + datetime) e
  `forms` (formik + yup + input-mask) do código da aplicação.
