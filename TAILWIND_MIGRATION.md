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

Além desses, `~components/ActionStatusBadge` centraliza a cor e o rótulo da
situação de uma ação — usado na listagem admin, em "minhas ações" e na legenda
do calendário.

## Paleta e tipografia

Definidas em `tailwind.config.js` e carregadas em `index.html`:

```javascript
brand: {
  'primary-dark': '#26708C',    // Azul escuro
  'primary-light': '#6AA0D1',   // Azul claro
  'secondary-dark': '#6D9B3E',  // Verde escuro
  'secondary-light': '#BECC50', // Verde claro
  accent:  '#36A339',           // Verde vibrante
  warning: '#F2AF25',           // Laranja
  danger:  '#D83624',           // Vermelho
  purple:  '#9178B5',           // Roxo
  dark:    '#2E292C',           // Cinza escuro
  light:   '#FFFFFF',           // Branco
}
```

- `font-sans` → **Barlow** (corpo)
- `font-display` → **Shrikhand** (títulos)

## Classes utilitárias em `src/styles.css`

`.btn-primary`, `.btn-secondary`, `.btn-outline`, `.card-lixo`,
`.gradient-brand`, `.section-title` e `.form-select-arrow`.

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
<button className="bg-brand-primary-dark text-white">   // certo
<button style={{ backgroundColor: '#26708C' }}>          // evitar
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
