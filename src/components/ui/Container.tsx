import { HTMLAttributes } from 'react';
import { cn } from './cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
}

const Container = ({ fluid = false, className, children, ...props }: ContainerProps) => (
  <div
    className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8', !fluid && 'max-w-7xl', className)}
    {...props}
  >
    {children}
  </div>
);

export { Container };
