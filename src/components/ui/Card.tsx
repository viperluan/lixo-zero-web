import { HTMLAttributes } from 'react';
import { cn } from './cn';

type DivProps = HTMLAttributes<HTMLDivElement>;

const Card = ({ className, children, ...props }: DivProps) => (
  <div
    className={cn(
      'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }: DivProps) => (
  <div className={cn('px-6 py-5 border-b border-gray-100', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn('text-xl font-display font-bold text-brand-primary-dark', className)}
    {...props}
  >
    {children}
  </h2>
);

const CardBody = ({ className, children, ...props }: DivProps) => (
  <div className={cn('px-6 py-6', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }: DivProps) => (
  <div className={cn('px-6 py-5 border-t border-gray-100 bg-gray-50', className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardBody, CardFooter };
