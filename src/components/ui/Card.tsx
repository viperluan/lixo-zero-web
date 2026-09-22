import { HTMLAttributes } from 'react';
import { cn } from './cn';

type DivProps = HTMLAttributes<HTMLDivElement>;

type CardProps = DivProps & {
  overflowClip?: boolean;
};

const Card = ({ className, children, overflowClip = true, ...props }: CardProps) => (
  <div
    className={cn(
      'bg-white rounded-xl shadow-sm border border-gray-100',
      overflowClip && 'overflow-hidden',
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
  <h2 className={cn('text-xl font-black text-brand-forest', className)} {...props}>
    {children}
  </h2>
);

const CardBody = ({ className, children, ...props }: DivProps) => (
  <div className={cn('px-6 py-6', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }: DivProps) => (
  <div className={cn('px-6 py-5 border-t border-gray-100 bg-brand-cream', className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardBody, CardFooter };
