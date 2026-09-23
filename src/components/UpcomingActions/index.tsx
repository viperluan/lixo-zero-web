import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import api from '~api';
import { ActionLink, Badge, cn } from '~components/ui';
import { ActionFormatBadge } from '~components/ActionFormatBadge';
import { ActionDetails } from '~components/ActionDetails';
import { useEdicao } from '~context/EdicaoContext';
import { SituacaoAcao } from '~/Enumerados';
import moment from '~/lib/moment';
import { hojeCivil } from '~/lib/periodoSlz';
import {
  formatarChipDeData,
  formatarHora,
  obterLocalAcao,
  ordenarPorData,
  type Acao,
  type RespostaListaAcoes,
} from '~/lib/acoes';

const QUANTIDADE = 6;

/**
 * Faixa de "proximas acoes" da home.
 *
 * A API da edição vigente já corta anos anteriores. O recorte de "a partir de
 * hoje" usa `data_acao_inicial` / `data_acao_final` (dia civil em São Paulo).
 */
const UpcomingActions = () => {
  const navigate = useNavigate();
  const { edicao, loading, semVigente } = useEdicao();
  const [acoes, setAcoes] = useState<Acao[]>([]);
  const [abertas, setAbertas] = useState<Set<string>>(() => new Set());

  const alternar = (id: string) =>
    setAbertas((atuais) => {
      const proximas = new Set(atuais);
      if (!proximas.delete(id)) proximas.add(id);
      return proximas;
    });

  useEffect(() => {
    if (loading || !edicao) {
      setAcoes([]);
      return;
    }

    let ativo = true;

    api
      .get<RespostaListaAcoes>('/acoes', {
        // `situacao` nao muda nada para anonimo (a API ja forca aprovadas), mas
        // para um admin logado navegando na home ela tem efeito e evita
        // pendentes vazarem na vitrine publica.
        params: {
          page: 1,
          limit: 50,
          situacao: SituacaoAcao.Confirmada,
          data_acao_inicial: hojeCivil(),
          data_acao_final: edicao.data_fim_realizacao,
        },
        silenciarErro: true,
      })
      .then(({ data }) => {
        if (!ativo || !data?.actions) return;

        setAcoes(ordenarPorData(data.actions).slice(0, QUANTIDADE));
      })
      .catch(() => {
        // Silencio proposital: a home segue inteira sem esta faixa.
      });

    return () => {
      ativo = false;
    };
  }, [edicao, loading]);

  if (loading) return null;

  if (semVigente) {
    return (
      <section aria-labelledby="programacao-ausente" className="mx-auto mt-12 max-w-6xl">
        <div className="rounded-3xl border border-brand-cream/20 bg-white/10 px-6 py-10 text-center text-brand-cream">
          <p className="label-condensed text-sm text-brand-sage">Programação</p>
          <h2 id="programacao-ausente" className="mt-1 text-2xl sm:text-3xl">
            A programação desta edição ainda não está no ar.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-cream/80">
            Assim que a edição vigente for publicada, as ações aprovadas aparecem aqui.
          </p>
        </div>
      </section>
    );
  }

  if (acoes.length === 0) return null;

  return (
    <section aria-labelledby="proximas-acoes" className="mx-auto mt-12 max-w-6xl">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div>
          <p className="label-condensed text-sm text-brand-sage">Programação</p>

          <h2 id="proximas-acoes" className="mt-1 text-3xl text-brand-cream sm:text-4xl">
            Próximas ações
          </h2>
        </div>

        <ActionLink
          label="Ver programação completa"
          icon={ArrowRight}
          onClick={() => navigate('auth/schedule')}
        />
      </div>

      {/* items-start: um card aberto nao estica os vizinhos da mesma linha. O
          alinhamento dos fechados vem do titulo, que reserva duas linhas. */}
      <ul className="mt-7 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {acoes.map((acao, indice) => {
          const { dia, mes } = formatarChipDeData(acao.data_acao);
          const local = obterLocalAcao(acao);
          const aberta = abertas.has(acao.id);
          const idDetalhes = `detalhes-acao-${acao.id}`;

          return (
            <li
              key={acao.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${indice * 70}ms`, animationFillMode: 'backwards' }}
            >
              {/* Padrao de superficie de marketing da home (rounded-3xl +
                  shadow-lg), nao o <Card> do ui, que e visual de tela admin. */}
              <article className="relative flex flex-col rounded-3xl bg-white p-5 shadow-lg transition-shadow hover:shadow-xl sm:p-6">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-sage text-brand-forest-deep"
                  >
                    <span className="text-xl font-black leading-none">{dia}</span>
                    <span className="label-condensed mt-0.5 text-[0.625rem] leading-none">
                      {mes}
                    </span>
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="label-condensed text-xs capitalize text-brand-dark/60">
                      {moment(acao.data_acao).format('ddd')} · {formatarHora(acao.data_acao)}
                    </p>

                    {/* O ::after do botao cobre o card inteiro: o card todo fica
                        clicavel sem perder o <h3>, que nao pode ir dentro de <button>. */}
                    <h3 className="mt-1 text-lg leading-snug text-brand-forest sm:min-h-[2lh]">
                      <button
                        type="button"
                        onClick={() => alternar(acao.id)}
                        aria-expanded={aberta}
                        aria-controls={idDetalhes}
                        className={cn(
                          'text-left after:absolute after:inset-0 after:rounded-3xl focus:outline-none focus-visible:after:ring-4 focus-visible:after:ring-brand-sage',
                          !aberta && 'line-clamp-2'
                        )}
                      >
                        {acao.titulo_acao}
                      </button>
                    </h3>
                  </div>
                </div>

                {local && (
                  <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-brand-dark/80">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-forest"
                      aria-hidden="true"
                    />
                    <span className="line-clamp-2">{local}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-5">
                  <ActionFormatBadge forma={acao.forma_realizacao_acao} />

                  {acao.categoria?.descricao && (
                    <Badge variant="primary">{acao.categoria.descricao}</Badge>
                  )}

                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'ml-auto h-5 w-5 shrink-0 text-brand-forest transition-transform duration-300 motion-reduce:transition-none',
                      aberta && 'rotate-180'
                    )}
                  />
                </div>

                {/* 0fr -> 1fr anima a altura sem medir o conteudo em JS. O
                    `relative` sobe o painel acima do ::after do botao, para o
                    texto ser selecionavel sem fechar o card. */}
                <div
                  id={idDetalhes}
                  aria-hidden={!aberta}
                  className={cn(
                    'relative grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                    aberta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <ActionDetails
                      acao={acao}
                      className="mt-5 border-t border-brand-leaf/30 pt-5"
                    />
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export { UpcomingActions };
