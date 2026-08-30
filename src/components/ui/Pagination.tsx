import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './cn';

const PAGE_BUTTON =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Substitui o trio Pagination/PaginationItem/PaginationLink do reactstrap, que
 * estava duplicado em cinco listagens.
 *
 * Com muitas paginas mostra apenas uma janela ao redor da atual, em vez de
 * imprimir todos os numeros como a versao antiga fazia.
 */
const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const windowStart = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const windowEnd = Math.min(totalPages, windowStart + 4);
  const pages: number[] = [];

  for (let page = windowStart; page <= windowEnd; page += 1) pages.push(page);

  return (
    <nav
      aria-label="Paginação"
      className={cn('flex items-center justify-center gap-1.5', className)}
    >
      <button
        type="button"
        className={cn(PAGE_BUTTON, 'hover:bg-gray-50')}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {windowStart > 1 && <span className="px-1 text-gray-400">…</span>}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? 'page' : undefined}
          className={cn(
            PAGE_BUTTON,
            page === currentPage
              ? 'border-brand-primary-dark bg-brand-primary-dark text-white'
              : 'hover:bg-gray-50'
          )}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {windowEnd < totalPages && <span className="px-1 text-gray-400">…</span>}

      <button
        type="button"
        className={cn(PAGE_BUTTON, 'hover:bg-gray-50')}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export { Pagination };
