import { ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

const VARIANTS = {
  primary:
    'bg-brand-primary-dark text-white hover:bg-brand-primary-dark/90 focus:ring-brand-primary-dark',
  secondary:
    'bg-brand-secondary-light text-brand-dark hover:bg-brand-secondary-light/90 focus:ring-brand-secondary-dark',
  success: 'bg-brand-accent text-white hover:bg-brand-accent/90 focus:ring-brand-accent',
  warning: 'bg-brand-warning text-brand-dark hover:bg-brand-warning/90 focus:ring-brand-warning',
  danger: 'bg-brand-danger text-white hover:bg-brand-danger/90 focus:ring-brand-danger',
  neutral: 'bg-gray-200 text-brand-dark hover:bg-gray-300 focus:ring-gray-400',
  outline:
    'border-2 border-brand-primary-dark text-brand-primary-dark hover:bg-brand-primary-dark hover:text-white focus:ring-brand-primary-dark',
  ghost: 'text-brand-primary-dark hover:bg-brand-primary-dark/10 focus:ring-brand-primary-dark',
  icon: 'text-brand-dark hover:bg-gray-100 focus:ring-gray-400 p-2 rounded-full',
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
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all',
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
