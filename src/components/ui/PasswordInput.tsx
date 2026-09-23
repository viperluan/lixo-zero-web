import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from './cn';
import { Input, type InputProps } from './Form';

export type PasswordInputProps = Omit<InputProps, 'type'>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ invalid = false, className, disabled, ...props }, ref) => {
    const [visivel, setVisivel] = useState(false);

    const alternarVisibilidade = () => setVisivel((atual) => !atual);

    return (
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <Input
          ref={ref}
          type={visivel ? 'text' : 'password'}
          disabled={disabled}
          invalid={invalid}
          className={cn('pl-10 pr-10', className)}
          {...props}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={alternarVisibilidade}
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visivel}
          className={cn(
            'absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md',
            'text-gray-400 transition-colors hover:text-brand-forest',
            'focus:outline-none focus:ring-2 focus:ring-brand-forest/30',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {visivel ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
