import {
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cn } from './cn';

// Base compartilhada por input, textarea e select para que os tres tenham
// exatamente a mesma altura, borda e estado de foco.
const CONTROL_BASE =
  'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-brand-dark transition-colors ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ' +
  'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500';

const controlState = (invalid?: boolean) =>
  invalid
    ? 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger/30'
    : 'border-gray-300 focus:border-brand-primary-dark focus:ring-brand-primary-dark/30';

/** Marca visual de campo invalido, comum aos tres controles. */
interface InvalidProp {
  invalid?: boolean;
}

const FormGroup = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-5', className)} {...props}>
    {children}
  </div>
);

const Label = ({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('block mb-1.5 text-sm font-semibold text-brand-dark', className)} {...props}>
    {children}
  </label>
);

const HelpText = ({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('mb-1.5 text-xs text-gray-500', className)} {...props}>
    {children}
  </p>
);

const FieldError = ({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) => {
  if (!children) return null;

  return (
    <p className={cn('mt-1.5 text-xs font-medium text-brand-danger', className)} {...props}>
      {children}
    </p>
  );
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & InvalidProp;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid = false, className, ...props }, ref) => (
    <input ref={ref} className={cn(CONTROL_BASE, controlState(invalid), className)} {...props} />
  )
);
Input.displayName = 'Input';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & InvalidProp;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid = false, className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(CONTROL_BASE, 'resize-none', controlState(invalid), className)}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & InvalidProp;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ invalid = false, className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        CONTROL_BASE,
        'appearance-none form-select-arrow',
        controlState(invalid),
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement>, InvalidProp {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, invalid = false, className, id, ...props }, ref) => (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn(
          'mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-2 text-brand-primary-dark',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary-dark/30',
          invalid ? 'border-brand-danger' : 'border-gray-300'
        )}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-brand-dark">
          {label}
        </label>
      )}
    </div>
  )
);
Checkbox.displayName = 'Checkbox';

export { FormGroup, Label, HelpText, FieldError, Input, Textarea, Select, Checkbox };
