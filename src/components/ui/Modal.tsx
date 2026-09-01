import { HTMLAttributes, PropsWithChildren, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from './cn';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const;

export interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  /**
   * Opcional: as confirmacoes que so podem sair pelos botoes internos (ex.:
   * mudanca de status de acao) simplesmente nao passam a prop, e assim Esc e o
   * clique no backdrop nao fecham o dialogo.
   */
  toggle?: () => void;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * Substitui o Modal do reactstrap. Renderiza em portal no body e prende o
 * scroll da pagina enquanto aberto.
 */
const Modal = ({ isOpen, toggle, size = 'md', className, children }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && toggle) toggle();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, toggle]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/50 animate-fade-in"
        onClick={toggle}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 my-8 w-full rounded-xl bg-white shadow-2xl animate-modal-in',
          SIZES[size],
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  toggle?: () => void;
  children?: ReactNode;
}

const ModalHeader = ({ toggle, className, children, ...props }: ModalHeaderProps) => (
  <div
    className={cn(
      'flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100',
      className
    )}
    {...props}
  >
    <h2 className="text-lg font-display font-bold text-brand-primary-dark">{children}</h2>

    {toggle && (
      <button
        type="button"
        onClick={toggle}
        aria-label="Fechar"
        className="-mr-2 -mt-1 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-dark"
      >
        <X className="h-5 w-5" />
      </button>
    )}
  </div>
);

const ModalBody = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-6 py-6', className)} {...props}>
    {children}
  </div>
);

const ModalFooter = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-wrap items-center justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export { Modal, ModalHeader, ModalBody, ModalFooter };
