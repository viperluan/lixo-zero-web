import { cn } from './cn';

const SIZES = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
} as const;

export interface SpinnerProps {
  size?: keyof typeof SIZES;
  className?: string;
}

const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <span
    role="status"
    aria-label="Carregando"
    className={cn(
      'inline-block animate-spin rounded-full border-current border-r-transparent',
      SIZES[size],
      className
    )}
  />
);

export { Spinner };
