import {
  HTMLAttributes,
  PropsWithChildren,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from 'react';
import { cn } from './cn';

/**
 * As listagens de admin tem muitas colunas, entao a rolagem horizontal fica no
 * wrapper e nunca no body da pagina.
 */
const Table = ({ className, children, ...props }: TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full min-w-max text-left text-sm', className)} {...props}>
      {children}
    </table>
  </div>
);

type SectionProps = HTMLAttributes<HTMLTableSectionElement>;

const Thead = ({ className, children, ...props }: SectionProps) => (
  <thead
    className={cn('bg-gray-50 text-xs uppercase tracking-wide text-gray-500', className)}
    {...props}
  >
    {children}
  </thead>
);

const Th = ({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th scope="col" className={cn('whitespace-nowrap px-4 py-3 font-semibold', className)} {...props}>
    {children}
  </th>
);

const Tbody = ({ className, children, ...props }: SectionProps) => (
  <tbody className={cn('divide-y divide-gray-100', className)} {...props}>
    {children}
  </tbody>
);

const Tr = ({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('transition-colors hover:bg-gray-50', className)} {...props}>
    {children}
  </tr>
);

const Td = ({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-4 py-3 align-middle text-brand-dark', className)} {...props}>
    {children}
  </td>
);

// Primeira coluna da linha: mesmo padding do Td, com peso de destaque.
const Tdh = ({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    scope="row"
    className={cn('px-4 py-3 text-left align-middle font-semibold text-brand-dark', className)}
    {...props}
  >
    {children}
  </th>
);

interface TableEmptyProps extends PropsWithChildren {
  colSpan: number;
}

const TableEmpty = ({ colSpan, children = 'Nenhum registro encontrado.' }: TableEmptyProps) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-gray-500">
      {children}
    </td>
  </tr>
);

export { Table, Thead, Th, Tbody, Tr, Td, Tdh, TableEmpty };
