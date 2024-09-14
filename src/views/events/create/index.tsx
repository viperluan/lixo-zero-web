import { FormaRealizacaoAcao, TipoPublico } from '~/Enumerados';
import { listarEnumerados } from '~/Enumerados';
import { DateTimePicker } from '~components/DatePicker';
import { useAuth } from '~context/AuthContext';
import moment, { Moment } from 'moment';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormGroup,
  Input,
  Form,
  Label,
  Button,
  CardTitle,
  Container,
} from 'reactstrap';
import InputMask, { Props } from 'react-input-mask';
import { SituacaoAcao } from '~/Enumerados';
import { LoadingOverlay } from '~components/Loading';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import api from '~/api';
import AdditionalInfoEventCreate from '~/components/AdditionalInfoEventCreate';

type Category = {
  id: string;
  descricao: string;
};

type CategoriesResponseData = {
  categories: Category[];
  totalPages: number;
  currentPage: number;
};

const ActionContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [listCategories, setListCategories] = useState<Category[]>([]);
  const [organizerName, setOrganizerName] = useState('');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [activityType, setActivityType] = useState('');
  const [realizationForm, setRealizationForm] = useState(FormaRealizacaoAcao.Online);
  const [publicType, setPublicType] = useState(TipoPublico.Interno);
  const [eventPublicity, setEventPublicity] = useState('');
  const [activityLocation, setActivityLocation] = useState('');
  const [organizerCount, setOrganizerCount] = useState<number>();
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [whatsapp, setWhatsapp] = useState('');

  const [additionalInfoState, setAdditionalInfoState] = useState(true);

  const fetchCategories = async () => {
    const { data }: AxiosResponse<CategoriesResponseData> = await api.get(
      `/categorias?page=1&limit=150`
    );

    if (data.categories) {
      setListCategories(data.categories);
      setActivityType(data.categories[0].id);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDateChange = (date: Moment) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !user.id)
      return toast.warn('É necessário realizar o login antes de cadastrar uma ação!');

    if (!organizerName)
      return toast.warn('É necessário informar um nome para o organizador da ação!');

    if (!whatsapp)
      return toast.warn('É necessário informar um número de whatsapp para o responsável da ação!');

    if (!activityTitle) return toast.warn('É necessário informar um título para atividade!');

    if (!activityDescription)
      return toast.warn('É necessário informar uma descrição para atividade!');

    if (!activityType) return toast.warn('É necessário informar um tipo de atividade!');

    if (!selectedDate)
      return toast.warn(
        'É necessário informar uma data de horário que a atividade será realizada!'
      );

    if (!realizationForm)
      return toast.warn('É necessário informar a forma de realização da atividade!');

    if (!activityLocation) {
      if (activityLocation === FormaRealizacaoAcao.Online)
        return toast.warn('É necessário informar um link com informações ou acesso ao evento!');

      if (activityLocation === FormaRealizacaoAcao.Hibrida)
        return toast.warn(
          'É necessário informar um nome e endereço do local para realização do evento!'
        );

      if (activityLocation === FormaRealizacaoAcao.Presencial)
        return toast.warn('É necessário informar dados sobre onde e como acontecerá o evento!');
    }

    if (!publicType)
      return toast.warn('É necessário informar o foco de público, interno ou externo!');

    if (!eventPublicity)
      return toast.warn(
        'É necessário informar a descrição com orientações de como você irá divulgar o evento!'
      );

    if (!organizerCount || organizerCount < 1)
      return toast.warn(
        'É necessário informar um número referente a quantidade de pessoas que estão organizando o evento!'
      );

    const payload = {
      id_usuario_responsavel: user.id,
      celular: whatsapp.replace(/\D/g, ''),
      nome_organizador: organizerName,
      link_organizador: 'https://www.google.com.br',
      titulo_acao: activityTitle,
      descricao_acao: activityDescription,
      id_categoria: activityType,
      data_acao: new Date(selectedDate.toDate()),
      forma_realizacao_acao: realizationForm,
      local_acao: activityLocation,
      numero_organizadores_acao: organizerCount,
      situacao_acao: SituacaoAcao.AguardandoConfirmacao,
      tipo_publico: publicType,
      orientacao_divulgacao: eventPublicity,
    };

    setIsLoading(true);

    const { data } = await api.post(`/acoes`, payload);

    if (data.id) {
      toast.success(
        'Recebemos a solicitação de cadastro da sua ação. Em breve você receberá mais informações para confirmar os detalhes.',
        {
          autoClose: 10 * 1000, // 10 segundos
        }
      );

      navigate(`/auth/events/my-events/${user.id}`);
    }

    if (data.error) toast.error(data.error);

    setIsLoading(false);
  };

  const listaFormaAcao = listarEnumerados(FormaRealizacaoAcao);
  const listaTipoPublico = listarEnumerados(TipoPublico);

  const renderLocalAcaoPlaceHolder = () => {
    switch (realizationForm) {
      case FormaRealizacaoAcao.Online:
        return 'Insira o link de onde será divulgado o evento.';
      case FormaRealizacaoAcao.Presencial:
        return 'Insira o NOME E O ENDEREÇO do local de realização do evento.';
      case FormaRealizacaoAcao.Hibrida:
        return 'Insira as informações de onde acontecerá o evento e o link de divulgação.';

      default:
        return 'Local de realização da ação';
    }
  };

  const renderCategoriesOptions = () => {
    if (!listCategories.length) return <option>Sem tipo de ação</option>;

    return listCategories.map((categorie) => (
      <option key={categorie.id} value={categorie.id}>
        {categorie.descricao}
      </option>
    ));
  };

  return (
    <Container>
      <LoadingOverlay isLoading={isLoading} />

      <Form className="form" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>INSCRIÇÃO DE AÇÃO - SEMANA LIXO ZERO CAXIAS DO SUL</CardTitle>

            <AdditionalInfoEventCreate
              collapseState={additionalInfoState}
              handleChangeCollapseState={() => setAdditionalInfoState((prevState) => !prevState)}
            />
          </CardHeader>

          <CardBody>
            <FormGroup>
              <Label for="organizerName">Nome do organizador da ação</Label>
              <span className="form-text text-muted small">
                {`Empresa/Instituição/Grupo que você representa. Se for 'pessoa física' insira seu
                nome`}
              </span>
              <Input
                id="organizerName"
                name="organizerName"
                type="text"
                placeholder="Nome do responsável pela ação"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="whatsapp">Whatsapp do responsável pela ação</Label>
              <InputMask
                mask="(99) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              >
                {
                  ((inputProps: Props) => (
                    <Input
                      {...inputProps}
                      id="whatsapp"
                      name="whatsapp"
                      type="text"
                      placeholder="(99) 99999-9999"
                    />
                  )) as unknown as ReactNode
                }
              </InputMask>
            </FormGroup>

            <FormGroup>
              <Label for="activityTitle">
                Título da atividade - para divulgação na programação
              </Label>
              <span className="form-text text-muted small">
                Ex: Webinar sobre coleta seletiva / Live: Compostagem na Prática / Oficina de
                receitas....
              </span>
              <Input
                id="activityTitle"
                name="activityTitle"
                type="text"
                placeholder="Título da atividade"
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="activityDescription">
                Descrição resumida da atividade (o que será falado / feito?)
              </Label>
              <span className="form-text text-muted small">
                Se houver necessidade de INSCRIÇÃO de participantes para acesso ao seu evento, por
                favor informe aqui como deve acontecer.
              </span>
              <Input
                id="activityDescription"
                name="activityDescription"
                type="textarea"
                placeholder="Descrição da atividade"
                rows={3}
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="activityType">Tipo da atividade</Label>
              <Input
                id="activityType"
                name="activityType"
                type="select"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
              >
                {renderCategoriesOptions()}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="dateTime">
                Data e horário que a atividade será realizada (datas entre 18 e 26/10/
                {moment().year()})
              </Label>
              <DateTimePicker onDateChange={handleDateChange} />
            </FormGroup>

            <FormGroup>
              <Label for="realizationForm">Forma de realização da atividade</Label>
              <Input
                id="realizationForm"
                name="realizationForm"
                type="select"
                value={realizationForm}
                onChange={(e) => setRealizationForm(e.target.value)}
              >
                {listaFormaAcao.map((forma) => (
                  <option key={forma.value} value={forma.value}>
                    {forma.label}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="activityLocation">{renderLocalAcaoPlaceHolder()}</Label>
              <Input
                id="activityLocation"
                name="activityLocation"
                type="text"
                placeholder={renderLocalAcaoPlaceHolder()}
                value={activityLocation}
                onChange={(e) => setActivityLocation(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="publicType">Evento será para o público externo ou interno?</Label>
              <Input
                id="publicType"
                name="publicType"
                type="select"
                value={publicType}
                onChange={(e) => setPublicType(e.target.value)}
              >
                {listaTipoPublico.map((tipoPublico) => (
                  <option key={tipoPublico.value} value={tipoPublico.value}>
                    {tipoPublico.label}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="eventPublicity">
                Descrição resumida de como você pretende divulgar o evento
              </Label>
              <Input
                id="eventPublicity"
                name="eventPublicity"
                type="textarea"
                placeholder="Descrição resumida de como você pretende divulgar o evento"
                rows={3}
                value={eventPublicity}
                onChange={(e) => setEventPublicity(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="organizerCount">
                Quantas pessoas irão organizar essa ação? (Incluindo você)
              </Label>
              <span className="form-text text-muted small">
                Se não tiver certeza, insira uma média
              </span>
              <Input
                id="organizerCount"
                name="organizerCount"
                type="number"
                placeholder="Número de participantes"
                value={organizerCount}
                onChange={(e) => setOrganizerCount(parseInt(e.target.value))}
              />
            </FormGroup>
          </CardBody>

          <CardFooter className="d-flex justify-content-center">
            <Button type="submit" color="primary">
              Enviar
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </Container>
  );
};

export { ActionContainer };
