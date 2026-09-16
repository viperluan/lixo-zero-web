import { Globe, MapPin, Monitor } from 'lucide-react';
import { Badge, type BadgeVariant } from '~components/ui';

/**
 * Espelha `~components/ActionStatusBadge`: a API ja devolve a forma de
 * realizacao traduzida, entao o mapa e indexado pelo ROTULO e nao pelo enum.
 *
 * Cuidado: a entidade do back devolve 'Hibrida' SEM acento
 * (`Acao.forma_realizacao_acao_texto`), enquanto o enum do front
 * (`FormaRealizacaoAcao.description`) devolve 'Híbrida' COM acento. As duas
 * chaves existem aqui para que nenhuma origem caia no fallback em silencio.
 */
const FORMAS: Record<string, { rotulo: string; icone: typeof Globe; variant: BadgeVariant }> = {
  Online: { rotulo: 'Online', icone: Monitor, variant: 'primary' },
  Presencial: { rotulo: 'Presencial', icone: MapPin, variant: 'success' },
  Hibrida: { rotulo: 'Híbrida', icone: Globe, variant: 'neutral' },
  Híbrida: { rotulo: 'Híbrida', icone: Globe, variant: 'neutral' },
};

const FALLBACK = { rotulo: 'A definir', icone: Globe, variant: 'neutral' as BadgeVariant };

const getActionFormat = (forma?: string) => (forma && FORMAS[forma]) || FALLBACK;

export interface ActionFormatBadgeProps {
  forma?: string;
  className?: string;
}

const ActionFormatBadge = ({ forma, className }: ActionFormatBadgeProps) => {
  const { rotulo, icone: Icone, variant } = getActionFormat(forma);

  return (
    <Badge variant={variant} className={className}>
      <Icone className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
      {rotulo}
    </Badge>
  );
};

export { ActionFormatBadge, getActionFormat };
