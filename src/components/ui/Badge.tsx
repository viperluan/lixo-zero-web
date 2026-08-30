import { HTMLAttributes } from 'react';
import { cn } from './cn';

const VARIANTS = {
  neutral: 'bg-gray-100 text-gray-700',
  primary: 'bg-brand-primary-dark/10 text-brand-primary-dark',
  success: 'bg-brand-accent/15 text-brand-secondary-dark',
  warning: 'bg-brand-warning/20 text-amber-800',
  danger: 'bg-brand-danger/10 text-brand-danger',
} as const;

export type BadgeVariant = keyof typeof VARIANTS;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const Badge = ({ variant = 'neutral', className, children, ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold',
      VARIANTS[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export { Badge };
