import {
  ButtonHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from './cn';

export interface DropdownProps extends PropsWithChildren {
  trigger: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

/**
 * Substitui o UncontrolledDropdown do reactstrap: fecha ao clicar fora, ao
 * apertar Esc e ao selecionar um item.
 */
const Dropdown = ({ trigger, align = 'right', className, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/20"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          role="menu"
          onClick={() => setIsOpen(false)}
          className={cn(
            'absolute z-40 mt-2 min-w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownHeader = ({ children }: PropsWithChildren) => (
  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-400">
    {children}
  </div>
);

const DropdownDivider = () => <div className="my-1.5 h-px bg-gray-100" />;

const DropdownItem = ({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    role="menuitem"
    className={cn(
      'flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-brand-dark transition-colors hover:bg-gray-50',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export { Dropdown, DropdownHeader, DropdownDivider, DropdownItem };
