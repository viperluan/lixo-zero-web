import { ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

const VARIANTS = {
  primary: 'bg-brand-sage text-brand-forest-deep hover:bg-brand-sage/80 focus:ring-brand-forest',
  secondary: 'bg-brand-forest text-brand-cream hover:bg-brand-forest/90 focus:ring-brand-forest',
  success: 'bg-brand-accent text-white hover:bg-brand-accent/90 focus:ring-brand-accent',
  warning: 'bg-brand-warning text-brand-dark hover:bg-brand-warning/90 focus:ring-brand-warning',
  danger: 'bg-brand-danger text-white hover:bg-brand-danger/90 focus:ring-brand-danger',
  neutral: 'bg-brand-leaf/30 text-brand-forest hover:bg-brand-leaf/50 focus:ring-brand-leaf',
  outline:
    'border-2 border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-brand-cream focus:ring-brand-forest',
  ghost: 'text-brand-forest hover:bg-brand-forest/10 focus:ring-brand-forest',
  icon: 'text-brand-forest hover:bg-brand-forest/10 focus:ring-brand-forest p-2 rounded-full',
} as const;

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      VARIANTS[variant],
      variant !== 'icon' && SIZES[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export { Button };
