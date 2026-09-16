import { CalendarDays, ChevronRight, Clock, MapPin, Tag } from 'lucide-react';
import { ActionStatusBadge } from '~components/ActionStatusBadge';
import { ActionFormatBadge } from '~components/ActionFormatBadge';
import {
  agruparPorDia,
  formatarChipDeData,
  formatarDiaLongo,
  formatarHora,
  obterLocalAcao,
  type Acao,
} from '~/lib/acoes';

export interface ActionAgendaProps {
  /** Ja ordenada cronologicamente — `agruparPorDia` preserva a ordem recebida. */
  acoes: Acao[];
  onSelecionar: (acao: Acao) => void;
  /**
   * Anonimo e usuario comum so recebem acoes aprovadas, entao um badge
   * "Aprovada" em toda linha seria ruido. So o admin ve situacoes mistas.
   */
  mostrarSituacao?: boolean;
}

/** Teto do atraso em cascata: sem ele a ultima secao nasceria segundos depois. */
const MAXIMO_GRUPOS_ANIMADOS = 6;

const ActionAgenda = ({ acoes, onSelecionar, mostrarSituacao = false }: ActionAgendaProps) => {
  if (acoes.length === 0) {
    return (
      <div className="animate-fade-in rounded-2xl border-2 border-dashed border-brand-leaf/60 bg-brand-cream/60 px-6 py-12 text-center">
        <CalendarDays className="mx-auto h-10 w-10 text-brand-sage" aria-hidden="true" />

        <h3 className="mt-4 text-lg text-brand-forest">Não há ações para esses filtros</h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-brand-dark/70">
          Ajuste a pesquisa ou limpe os filtros para ver toda a programação da Semana Lixo Zero.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-9">
      {agruparPorDia(acoes).map(({ chave, data, acoes: acoesDoDia }, indice) => {
        const { dia, mes } = formatarChipDeData(data);

        return (
          <li
            key={chave}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${Math.min(indice, MAXIMO_GRUPOS_ANIMADOS) * 70}ms`,
              animationFillMode: 'backwards',
            }}
          >
            {/* Cabecalho do dia */}
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-sage text-brand-forest-deep"
              >
                <span className="text-xl font-black leading-none">{dia}</span>
                <span className="label-condensed mt-0.5 text-[0.625rem] leading-none">{mes}</span>
              </span>

              <div className="min-w-0">
                {/* first-letter, nao `capitalize`: o moment pt-br devolve
                    "sábado, 22 de agosto" e o capitalize do Tailwind subiria
                    tambem o "De" do meio. */}
                <h3 className="text-base text-brand-forest first-letter:uppercase sm:text-lg">
                  {formatarDiaLongo(data)}
                </h3>

                <p className="label-condensed text-xs text-brand-dark/60">
                  {acoesDoDia.length} {acoesDoDia.length === 1 ? 'ação' : 'ações'}
                </p>
              </div>
            </div>

            {/* Trilho vertical + linhas do dia. O trilho so aparece de sm: para
                cima, onde ha largura para a indentacao. */}
            <ul className="mt-3 space-y-2 sm:ml-7 sm:border-l-2 sm:border-brand-leaf/40 sm:pl-6">
              {acoesDoDia.map((acao) => {
                const local = obterLocalAcao(acao);

                return (
                  <li key={acao.id}>
                    <button
                      type="button"
                      onClick={() => onSelecionar(acao)}
                      className="group flex w-full flex-col gap-3 rounded-2xl border border-brand-leaf/30 bg-white p-4 text-left transition-all hover:border-brand-sage hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-forest focus:ring-offset-2 sm:flex-row sm:items-center"
                    >
                      <span className="flex items-center gap-2 text-brand-forest sm:w-[4.5rem] sm:shrink-0">
                        <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="font-condensed text-base font-semibold tracking-wide">
                          {formatarHora(acao.data_acao)}
                        </span>
                      </span>

                      <span className="min-w-0 flex-1">
                        {/* font-black explicito: span nao herda a regra base dos headings. */}
                        <span className="block font-black leading-snug text-brand-dark transition-colors group-hover:text-brand-forest">
                          {acao.titulo_acao}
                        </span>

                        <span className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-dark/70">
                          {acao.categoria?.descricao && (
                            <span className="inline-flex items-center gap-1.5">
                              <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              {acao.categoria.descricao}
                            </span>
                          )}

                          {local && (
                            <span className="inline-flex min-w-0 items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              <span className="truncate">{local}</span>
                            </span>
                          )}
                        </span>
                      </span>

                      <span className="flex shrink-0 flex-wrap items-center gap-2">
                        <ActionFormatBadge forma={acao.forma_realizacao_acao} />

                        {mostrarSituacao && <ActionStatusBadge situacao={acao.situacao_acao} />}

                        <ChevronRight
                          className="hidden h-5 w-5 text-brand-forest/40 transition-transform group-hover:translate-x-0.5 sm:block"
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ol>
  );
};

export { ActionAgenda };
