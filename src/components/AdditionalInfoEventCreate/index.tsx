import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapse } from '~components/ui';
import { formatarDataCivil, rotuloPeriodo } from '~/lib/periodoSlz';
import type { Edicao } from '~/lib/edicoes';

type AdditionalInfoEventCreateProps = {
  edicao: Edicao;
};

const MIDIA_TELA_LARGA = '(min-width: 640px)';

const AdditionalInfoEventCreate = ({ edicao }: AdditionalInfoEventCreateProps) => {
  const [listaAberta, setListaAberta] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MIDIA_TELA_LARGA).matches
  );

  useEffect(() => {
    const media = window.matchMedia(MIDIA_TELA_LARGA);
    const aoMudar = (event: MediaQueryListEvent) => setListaAberta(event.matches);

    media.addEventListener('change', aoMudar);
    return () => media.removeEventListener('change', aoMudar);
  }, []);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-brand-warning/50 bg-brand-warning/20 px-4 py-4 text-sm leading-relaxed text-brand-dark">
      <h2 className="text-xl text-brand-forest">
        Vamos juntos transformar ideias em ações na 7ª edição da Semana Lixo Zero de Caxias do Sul?
        :)
      </h2>

      <p className="font-semibold">A Semana Lixo Zero é um evento colaborativo e voluntário.</p>

      <p>
        Mobilize sua empresa, escritório, estabelecimento, escola, grupo de amigos e familiares e
        cadastre sua ação{' '}
        <mark className="bg-brand-warning/40 font-bold uppercase">
          até o dia {formatarDataCivil(edicao.data_fim_cadastro, 'D [de] MMMM')}
        </mark>
        .
      </p>

      <p className="font-semibold">
        Para maiores informações sobre a SLZ, acesse o site:{' '}
        <a
          href="https://www.caxiaslixozero.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-forest underline hover:text-brand-forest/70"
        >
          Caxias Lixo Zero
          <span className="sr-only"> (abre em uma nova aba)</span>
        </a>
      </p>

      <div className="mt-2">
        <h3 className="sticky top-0 z-10 -mx-4 bg-[color-mix(in_srgb,#F2AF25_20%,white)] px-4 py-2">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-brand-forest/30 bg-white/60 px-3 py-2.5 text-left font-condensed text-lg uppercase tracking-wide text-brand-forest transition-colors hover:bg-brand-forest/10 focus:outline-none focus-visible:bg-brand-forest/10 focus-visible:ring-2 focus-visible:ring-brand-forest"
            aria-expanded={listaAberta}
            aria-controls="orientacoes-cadastro-acao"
            onClick={() => setListaAberta((aberta) => !aberta)}
          >
            Por favor, leia antes de prosseguir:
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-forest/10"
              aria-hidden="true"
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform ${listaAberta ? 'rotate-180' : ''}`}
              />
            </span>
          </button>
        </h3>

        <Collapse isOpen={listaAberta}>
          <ol
            id="orientacoes-cadastro-acao"
            className="list-decimal space-y-4 py-4 pl-5 marker:font-semibold marker:text-brand-forest"
          >
            <li>
              As atividades cadastradas deverão ocorrer entre{' '}
              {rotuloPeriodo(edicao.data_inicio_realizacao, edicao.data_fim_realizacao)}. Todas as
              ações devem ser GRATUITAS, porém não precisam ser necessariamente abertas ao público.
            </li>

            <li>
              Caso você tenha mais de uma atividade para cadastrar, envie um formulário PARA CADA
              ação.
            </li>

            <li>
              A 7ª Semana Lixo Zero ocorrerá de forma híbrida, ou seja, as ações poderão ser
              presenciais ou online.
            </li>

            <li>
              <span className="font-semibold">
                Você é responsável por ORGANIZAR, DIVULGAR E REALIZAR a sua atividade cadastrada.
              </span>{' '}
              O Coletivo Lixo Zero de Caxias do Sul oferece suporte e ajuda na divulgação das ações
              cadastradas na programação, porém não as executa.
            </li>

            <li>
              Após preencher sua inscrição,{' '}
              <mark className="bg-brand-warning/40">
                você será informado através do e-mail cadastrado
              </mark>{' '}
              sobre a confirmação da sua inscrição e receberá informações para a divulgação da sua
              ação (templates de cards e materiais para divulgação) e outras orientações relevantes.
              Por isso, preencha com CONTATOS VÁLIDOS.
            </li>

            <li>
              <span className="font-semibold">Se você precisar alterar alguma informação</span> de
              um formulário já enviado, CANCELAR ou ALTERAR A DATA/HORÁRIO da sua ação, por favor,
              entre em contato através do nosso e-mail (abaixo).
            </li>

            <li>
              Dúvidas ou esclarecimentos, contate-nos através do e-mail{' '}
              <a
                href="mailto:caxiaslixozero@gmail.com"
                className="text-brand-forest underline hover:text-brand-forest/70"
              >
                caxiaslixozero@gmail.com
              </a>
            </li>
          </ol>

          <p className="pb-4 text-center text-base font-semibold text-brand-forest">
            Muito obrigado!
          </p>
        </Collapse>
      </div>
    </div>
  );
};

export default AdditionalInfoEventCreate;
