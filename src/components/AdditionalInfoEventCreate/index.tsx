import { Badge, Button, Collapse } from 'reactstrap';

interface IAdditionalInfoProps {
  collapseState: boolean;
  handleChangeCollapseState: () => void;
}

const AdditionalInfoEventCreate = ({
  collapseState = true,
  handleChangeCollapseState,
}: IAdditionalInfoProps) => {
  const badgeMessage = collapseState ? 'fechar' : 'abrir';
  const badgeColor = collapseState ? 'danger' : 'success';
  const buttonColor = collapseState ? 'warning' : 'info';

  return (
    <div className="d-flex flex-column">
      <Button
        className="align-self-start"
        color={buttonColor}
        type="button"
        onClick={handleChangeCollapseState}
      >
        Informações{' '}
        <Badge color={badgeColor} pill>
          {badgeMessage}
        </Badge>
      </Button>

      <Collapse isOpen={collapseState}>
        <div className="d-flex flex-column pt-4">
          <h2 className="py-4">
            Vamos juntos construir a a 5ª edição da Semana Lixo Zero de Caxias do Sul? :){' '}
          </h2>

          <p className="font-weight-bold">
            A Semana Lixo Zero é um evento colaborativo e voluntário.
          </p>

          <p>
            Mobilize sua empresa, escritório, estabelecimento, grupo de amigos e familiares e
            cadastre sua ação{' '}
            <span
              style={{ backgroundColor: '#fffb11' }}
              className="text-uppercase font-weight-bold"
            >
              ATÉ O DIA 30 DE SETEMBRO
            </span>
          </p>

          <p className="font-weight-bold">
            Para maiores informações sobre a SLZ, acesse o site:{' '}
            <a href="https://www.caxiaslixozero.com.br">Caxias Lixo Zero</a>
          </p>

          <div className="mt-4">
            <h2 className="text-uppercase mb-4">Por favor, leia antes de prosseguir:</h2>

            <ol>
              <li className="mb-4">
                As atividades cadastradas deverão ocorrer entre os dias 18 à 26 de outubro de 2024.
                Todas as ações devem ser GRATUITAS, porém não precisam ser necessariamente abertas
                ao público.
              </li>

              <li className="mb-4">
                Caso você tenha mais de uma atividade para cadastrar envie um formulário PARA CADA
                ação.
              </li>

              <li className="mb-4">
                A 5ª Semana Lixo Zero ocorrerá de forma híbrida, ou seja, as ações poderão ser
                presenciais ou online.
              </li>

              <li className="mb-4">
                <span className="font-weight-bold">
                  Você é responsável por ORGANIZAR, DIVULGAR E REALIZAR a sua atividade cadastrada.
                </span>
                O Coletivo Lixo Zero de Caxias do Sul oferece suporte e ajuda na divulgação das
                ações cadastradas na programação, porém não as executa
              </li>

              <li className="mb-4">
                Após preencher sua inscrição,{' '}
                <span style={{ backgroundColor: '#fffb11' }}>
                  você será informado através do email cadastrado
                </span>{' '}
                sobre a confirmação da sua inscrição e receberá informações para a divulgação da sua
                ação (templates de cards e materiais para divulgação) e outras orientações
                relevantes. Por isso, preencha com CONTATOS VÁLIDOS.
              </li>

              <li className="mb-4">
                <span className="font-weight-bold">Se você precisar alterar alguma informação</span>{' '}
                de um formulário já enviado, CANCELAR ou ALTERAR A DATA/HORÁRIO da sua ação, por
                favor, entre em contato através do nosso e-mail (abaixo).
              </li>

              <li>
                Dúvidas ou esclarecimentos, contate-nos através do e-mail caxiaslixozero@gmail.com
                OU do Instagram @caxiaslixozero Muito obrigado!
              </li>
            </ol>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default AdditionalInfoEventCreate;
