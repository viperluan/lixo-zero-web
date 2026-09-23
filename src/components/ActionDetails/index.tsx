import moment from '~/lib/moment';
import { Button, cn, Modal, ModalBody, ModalFooter, ModalHeader } from '~components/ui';
import type { Acao } from '~/lib/acoes';

export interface ActionDetailsProps {
  acao: Acao;
  className?: string;
}

const ActionDetails = ({ acao, className }: ActionDetailsProps) => (
  <div className={cn('space-y-2 text-sm text-brand-dark', className)}>
    <p>
      <b>Nome do organizador:</b> {acao.nome_organizador}
    </p>
    {/* A API sanitiza a saida para quem nao e admin: sem o guard, o rotulo
        aparece com o valor em branco. */}
    {acao.celular && (
      <p>
        <b>Celular organizador:</b> {acao.celular}
      </p>
    )}

    <p>
      <b>Data:</b> {moment(acao.data_acao).format('DD/MM/YYYY')}
    </p>
    <p>
      <b>Horário:</b> {moment(acao.data_acao).format('HH:mm')}
    </p>
    <p>
      <b>Forma de Realização:</b> {acao.forma_realizacao_acao}
    </p>
    {/* Os endpoints por data nao fazem `include` dos relacionamentos; sem o
        optional chaining, trocar de endpoint viraria tela branca. */}
    {acao.categoria?.descricao && (
      <p>
        <b>Atividade:</b> {acao.categoria.descricao}
      </p>
    )}

    {acao.nome_local_acao && (
      <p>
        <b>Nome do local:</b> {acao.nome_local_acao}
      </p>
    )}

    {acao.endereco_local_acao && (
      <p>
        <b>Endereço do local:</b> {acao.endereco_local_acao}
      </p>
    )}

    {acao.link_para_inscricao_acao && (
      <p>
        <b>Link para inscrição:</b> {acao.link_para_inscricao_acao}
      </p>
    )}

    {acao.link_divulgacao_acesso_acao && (
      <p>
        <b>Link para divulgação:</b> {acao.link_divulgacao_acesso_acao}
      </p>
    )}

    <p>
      <b>Número de organizadores:</b> {acao.numero_organizadores_acao}
    </p>
    <p>
      <b>Descrição:</b> {acao.descricao_acao}
    </p>
  </div>
);

export interface ActionDetailsModalProps {
  /** `null` mantem o modal fechado. */
  acao: Acao | null;
  onFechar: () => void;
}

const ActionDetailsModal = ({ acao, onFechar }: ActionDetailsModalProps) => (
  <Modal isOpen={acao !== null} toggle={onFechar}>
    {acao && (
      <>
        <ModalHeader toggle={onFechar}>{acao.titulo_acao}</ModalHeader>

        <ModalBody>
          <ActionDetails acao={acao} />
        </ModalBody>

        <ModalFooter>
          <Button variant="neutral" onClick={onFechar}>
            Fechar
          </Button>
        </ModalFooter>
      </>
    )}
  </Modal>
);

export { ActionDetails, ActionDetailsModal };
