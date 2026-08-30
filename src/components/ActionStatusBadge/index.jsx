import { Badge } from '~components/ui';

/**
 * A API devolve a situacao da acao ja traduzida ('Pendente', 'Aprovada',
 * 'Reprovada'), entao o mapa e por rotulo e nao pelo enum SituacaoAcao.
 *
 * `color` acompanha o valor usado pelo react-big-calendar em eventPropGetter,
 * que precisa de uma cor literal e nao de uma classe.
 */
const SITUACOES = {
  Pendente: { variant: 'warning', color: '#F2AF25' },
  Aprovada: { variant: 'success', color: '#36A339' },
  Reprovada: { variant: 'danger', color: '#D83624' },
};

const FALLBACK = { variant: 'neutral', color: '#26708C' };

const getActionStatus = (situacao) => SITUACOES[situacao] ?? FALLBACK;

const ActionStatusBadge = ({ situacao }) => (
  <Badge variant={getActionStatus(situacao).variant}>{situacao || 'Desconhecida'}</Badge>
);

export { ActionStatusBadge, getActionStatus };
