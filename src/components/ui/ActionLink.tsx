import { ComponentType } from 'react';
import { cn } from './cn';

/**
 * CTA com icone em circulo, o padrao que a arte da Semana Lixo Zero repete:
 *
 * - `sage`: pilula verde clara com o icone em circulo creme (faixa da home);
 * - `bare`: so o rotulo com o icone em circulo verde escuro (rodape dos cards).
 *
 * O rotulo sempre sai em verde escuro sobre o sage — creme sobre sage fica em
 * 2,3:1 de contraste e reprova no WCAG AA.
 */
const TONES = {
  sage: {
    root: 'bg-brand-sage px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl hover:bg-brand-sage/80',
    label: 'text-brand-forest-deep text-base sm:text-lg font-semibold',
    circle: 'bg-brand-cream text-brand-forest w-9 h-9 sm:w-10 sm:h-10',
  },
  bare: {
    root: 'hover:opacity-80',
    label: 'text-brand-forest text-base sm:text-lg font-black',
    circle: 'bg-brand-forest text-brand-cream w-9 h-9 sm:w-10 sm:h-10',
  },
} as const;

export type ActionLinkTone = keyof typeof TONES;

export interface ActionLinkProps {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick?: () => void;
  tone?: ActionLinkTone;
  className?: string;
}

const ActionLink = ({ label, icon: Icon, onClick, tone = 'sage', className }: ActionLinkProps) => {
  const style = TONES[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-3 transition-all',
        'focus:outline-none focus:ring-2 focus:ring-brand-forest focus:ring-offset-2',
        style.root,
        className
      )}
    >
      <span className={style.label}>{label}</span>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full border-2 border-current',
          style.circle
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
    </button>
  );
};

export { ActionLink };
