import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import api from '~api';
import { ActionLink, Badge } from '~components/ui';
import { ActionFormatBadge } from '~components/ActionFormatBadge';
import { SituacaoAcao } from '~/Enumerados';
import moment from '~/lib/moment';
import {
  ehFutura,
  formatarChipDeData,
  formatarHora,
  obterLocalAcao,
  ordenarPorData,
  type Acao,
  type RespostaListaAcoes,
} from '~/lib/acoes';

const QUANTIDADE = 6;

/** `limit` e truncado em 100 pelo back (normalizarPaginacao). */
const LIMITE_BUSCA = 100;

/**
 * Faixa de "proximas acoes" da home.
 *
 * Nao renderiza nada enquanto carrega, se a busca falhar ou se nao houver acao
 * futura aprovada — a home e a porta de entrada da campanha e nao pode
 * depender da API estar de pe.
 *
 * O recorte por data e feito no cliente porque a API nao tem filtro de
 * intervalo publico: `data_acao` compara timestamp por igualdade exata (bug
 * conhecido) e `GET /acoes/:dataInicial/:dataFinal` exige JWT.
 */
const UpcomingActions = () => {
  const navigate = useNavigate();
  const [acoes, setAcoes] = useState<Acao[]>([]);

  useEffect(() => {
    let ativo = true;

    api
      .get<RespostaListaAcoes>('/acoes', {
        // `situacao` nao muda nada para anonimo (a API ja forca aprovadas), mas
        // para um admin logado navegando na home ela tem efeito e evita
        // pendentes vazarem na vitrine publica.
        params: { page: 1, limit: LIMITE_BUSCA, situacao: SituacaoAcao.Confirmada },
        silenciarErro: true,
      })
      .then(({ data }) => {
        if (!ativo || !data?.actions) return;

        setAcoes(
          ordenarPorData(data.actions)
            .filter((acao) => ehFutura(acao))
            .slice(0, QUANTIDADE)
        );
      })
      .catch(() => {
        // Silencio proposital: a home segue inteira sem esta faixa.
      });

    return () => {
      ativo = false;
    };
  }, []);

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

      <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {acoes.map((acao, indice) => {
          const { dia, mes } = formatarChipDeData(acao.data_acao);
          const local = obterLocalAcao(acao);

          return (
            <li
              key={acao.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${indice * 70}ms`, animationFillMode: 'backwards' }}
            >
              {/* Padrao de superficie de marketing da home (rounded-3xl +
                  shadow-lg), nao o <Card> do ui, que e visual de tela admin. */}
              <article className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-lg transition-shadow hover:shadow-xl sm:p-6">
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

                    <h3 className="mt-1 line-clamp-2 text-lg leading-snug text-brand-forest">
                      {acao.titulo_acao}
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

                {/* mt-auto + h-full: os rodapes se alinham mesmo com titulos de
                    alturas diferentes na mesma linha do grid. */}
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  <ActionFormatBadge forma={acao.forma_realizacao_acao} />

                  {acao.categoria?.descricao && (
                    <Badge variant="primary">{acao.categoria.descricao}</Badge>
                  )}
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
