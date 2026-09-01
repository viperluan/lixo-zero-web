import { Badge, Button, Collapse } from '~components/ui';

interface IAdditionalInfoProps {
  collapseState: boolean;
  handleChangeCollapseState: () => void;
}

const AdditionalInfoEventCreate = ({
  collapseState = true,
  handleChangeCollapseState,
}: IAdditionalInfoProps) => {
  const badgeMessage = collapseState ? 'fechar' : 'abrir';

  return (
    <div className="flex flex-col">
      <Button
        variant={collapseState ? 'warning' : 'primary'}
        className="self-start"
        onClick={handleChangeCollapseState}
      >
        Informações
        <Badge variant={collapseState ? 'danger' : 'success'}>{badgeMessage}</Badge>
      </Button>

      <Collapse isOpen={collapseState}>
        <div className="flex flex-col gap-4 pt-6 text-sm leading-relaxed text-brand-dark">
          <h2 className="font-display text-xl text-brand-primary-dark">
            Vamos juntos construir a 6ª edição da Semana Lixo Zero de Caxias do Sul? :)
          </h2>

          <p className="font-semibold">A Semana Lixo Zero é um evento colaborativo e voluntário.</p>

          <p>
            Mobilize sua empresa, escritório, estabelecimento, escola, grupo de amigos e familiares
            e cadastre sua ação{' '}
            <mark className="bg-brand-warning/40 font-bold uppercase">até o dia 07 de outubro</mark>
          </p>

          <p className="font-semibold">
            Para maiores informações sobre a SLZ, acesse o site:{' '}
            <a
              href="https://www.caxiaslixozero.com.br"
              className="text-brand-primary-dark underline hover:text-brand-primary-light"
            >
              Caxias Lixo Zero
            </a>
          </p>

          <div className="mt-2">
            <h3 className="mb-4 font-display text-lg uppercase text-brand-primary-dark">
              Por favor, leia antes de prosseguir:
            </h3>

            <ol className="list-decimal space-y-4 pl-5 marker:font-semibold marker:text-brand-primary-dark">
              <li>
                As atividades cadastradas deverão ocorrer entre os dias 17 à 26 de outubro de 2025.
                Todas as ações devem ser GRATUITAS, porém não precisam ser necessariamente abertas
                ao público.
              </li>

              <li>
                Caso você tenha mais de uma atividade para cadastrar envie um formulário PARA CADA
                ação.
              </li>

              <li>
                A 6ª Semana Lixo Zero ocorrerá de forma híbrida, ou seja, as ações poderão ser
                presenciais ou online.
              </li>

              <li>
                <span className="font-semibold">
                  Você é responsável por ORGANIZAR, DIVULGAR E REALIZAR a sua atividade cadastrada.
                </span>{' '}
                O Coletivo Lixo Zero de Caxias do Sul oferece suporte e ajuda na divulgação das
                ações cadastradas na programação, porém não as executa
              </li>

              <li>
                Após preencher sua inscrição,{' '}
                <mark className="bg-brand-warning/40">
                  você será informado através do email cadastrado
                </mark>{' '}
                sobre a confirmação da sua inscrição e receberá informações para a divulgação da sua
                ação (templates de cards e materiais para divulgação) e outras orientações
                relevantes. Por isso, preencha com CONTATOS VÁLIDOS.
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
                  className="text-brand-primary-dark underline hover:text-brand-primary-light"
                >
                  caxiaslixozero@gmail.com
                </a>
                <br />
                Muito obrigado!
              </li>
            </ol>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default AdditionalInfoEventCreate;
