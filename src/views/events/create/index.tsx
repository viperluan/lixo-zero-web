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
  Label,
  Button,
  CardTitle,
  Container,
  FormFeedback,
} from 'reactstrap';
import InputMask, { Props } from 'react-input-mask';
import { LoadingOverlay } from '~components/Loading';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import api from '~/api';
import AdditionalInfoEventCreate from '~/components/AdditionalInfoEventCreate';

import * as yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';

type Categoria = {
  id: string;
  descricao: string;
};

type CategoriasResponseData = {
  categories: Categoria[];
  totalPages: number;
  currentPage: number;
};

type DadosFormik = {
  nomeDoOrganizador: string;
  numeroDoWhatsapp: string;
  tituloDaAtividade: string;
  descricaoDaAtividade: string;
  tipoDaAtividade: string;
  dataDaAcao: null | Moment;
  formaDeRealizacaoAtividade: string;
  linkDeDivulgacaoAcessoDoEvento: string;
  nomeDoLocalDoEvento: string;
  enderecoDoLocalDoEvento: string;
  informacoesDeOndeOcorreraOEvento: string;
  linkParaInscricao: string;
  tipoDePublicoEvento: string;
  descricaoDivulgacaoEvento: string;
  numeroDeOrganizadores: string;
};

const ActionContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [additionalInfoState, setAdditionalInfoState] = useState(true);
  const [listaDeCategorias, setListaDeCategorias] = useState<Categoria[]>([]);

  const valoresIniciaisFormik = {
    nomeDoOrganizador: '',
    numeroDoWhatsapp: '',
    tituloDaAtividade: '',
    descricaoDaAtividade: '',
    tipoDaAtividade: '',
    dataDaAcao: null,
    formaDeRealizacaoAtividade: '',
    linkDeDivulgacaoAcessoDoEvento: '',
    nomeDoLocalDoEvento: '',
    enderecoDoLocalDoEvento: '',
    informacoesDeOndeOcorreraOEvento: '',
    linkParaInscricao: '',
    tipoDePublicoEvento: '',
    descricaoDivulgacaoEvento: '',
    numeroDeOrganizadores: '',
  };

  const schema = yup.object().shape({
    nomeDoOrganizador: yup.string().required('É necessário informar um nome de organizador.'),
    numeroDoWhatsapp: yup
      .string()
      .test('telefoneValido', 'É necessário informar um número de telefone válido.', (value) => {
        const regexCelular = /^\d{10,11}$/;

        const cleanedValue = value?.replace(/\D/g, '');

        return regexCelular.test(cleanedValue!);
      })
      .required('É necessário informar um número de whatsapp.'),
    tituloDaAtividade: yup.string().required('É necessário informar um título para atividade.'),
    descricaoDaAtividade: yup
      .string()
      .required('É necessário informar uma descrição resumida da atividade.'),
    tipoDaAtividade: yup.string().required('É necessário selecionar um tipo de atividade.'),
    dataDaAcao: yup
      .date()
      .required('É necessário selecionar uma data e hora para realização da atividade.')
      .test('is-valid-date', 'Data fora do intervalo permitido', (value) => {
        const minDate = moment(`${moment().year()}-10-18`);
        const maxDate = moment(`${moment().year()}-10-26`);
        return value && moment(value).isBetween(minDate, maxDate, undefined, '[]');
      }),
    formaDeRealizacaoAtividade: yup
      .string()
      .required('É necessário selecionar uma forma de realização da atividade.'),
    linkDeDivulgacaoAcessoDoEvento: yup.string().when('formaDeRealizacaoAtividade', {
      is: FormaRealizacaoAcao.Online,
      then: (schema) => schema.required('É necessário incluir um link para divulgação do evento.'),
      otherwise: (schema) => schema.notRequired(),
    }),
    nomeDoLocalDoEvento: yup.string().when('formaDeRealizacaoAtividade', {
      is: (value: string) =>
        value === FormaRealizacaoAcao.Hibrida || value === FormaRealizacaoAcao.Presencial,
      then: (schema) => schema.required('É necessário incluir um nome de local para evento.'),
      otherwise: (schema) => schema.notRequired(),
    }),
    enderecoDoLocalDoEvento: yup.string().when('formaDeRealizacaoAtividade', {
      is: (value: string) =>
        value === FormaRealizacaoAcao.Hibrida || value === FormaRealizacaoAcao.Presencial,
      then: (schema) => schema.required('É necessário incluir um endereço do local para o evento.'),
      otherwise: (schema) => schema.notRequired(),
    }),
    informacoesDeOndeOcorreraOEvento: yup.string().when('formaDeRealizacaoAtividade', {
      is: (value: string) =>
        value === FormaRealizacaoAcao.Hibrida || value === FormaRealizacaoAcao.Presencial,
      then: (schema) =>
        schema.required('É necessário incluir informações de onde ocorrerá o evento.'),
      otherwise: (schema) => schema.notRequired(),
    }),
    tipoDePublicoEvento: yup
      .string()
      .required('É necessário selecionar o tipo de público para o evento.'),
    descricaoDivulgacaoEvento: yup
      .string()
      .required('É necessário incluir informações de como você pretende divulgar o evento.'),
    numeroDeOrganizadores: yup
      .number()
      .min(1, 'Você precisa incluir no mínimo 1 (um) organizador.')
      .required('É necessário incluir o número de organizadores do evento, incluindo você.'),
  });

  const fetchCategories = async () => {
    const { data }: AxiosResponse<CategoriasResponseData> = await api.get(
      `/categorias?page=1&limit=150`
    );

    if (data.categories) {
      setListaDeCategorias(data.categories);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmitForm = async (dadosFormulario: DadosFormik) => {
    if (!user) return;

    const payload = {
      id_usuario_responsavel: user.id,
      celular: dadosFormulario.numeroDoWhatsapp.replace(/\D/g, ''),
      nome_organizador: dadosFormulario.nomeDoOrganizador,
      titulo_acao: dadosFormulario.tituloDaAtividade,
      descricao_acao: dadosFormulario.descricaoDaAtividade,
      id_categoria: dadosFormulario.tipoDaAtividade,
      data_acao: new Date(dadosFormulario.dataDaAcao!.toDate()),
      forma_realizacao_acao: dadosFormulario.formaDeRealizacaoAtividade,
      link_divulgacao_acesso_acao: dadosFormulario.linkDeDivulgacaoAcessoDoEvento,
      nome_local_acao: dadosFormulario.nomeDoLocalDoEvento,
      endereco_local_acao: dadosFormulario.enderecoDoLocalDoEvento,
      informacoes_acao: dadosFormulario.informacoesDeOndeOcorreraOEvento,
      link_para_inscricao_acao: dadosFormulario.linkParaInscricao,
      tipo_publico_acao: dadosFormulario.tipoDePublicoEvento,
      orientacao_divulgacao_acao: dadosFormulario.descricaoDivulgacaoEvento,
      numero_organizadores_acao: dadosFormulario.numeroDeOrganizadores,
    };

    setIsLoading(true);

    const { data } = await api.post(`/acoes`, payload);

    if (data.id) {
      toast.success(
        'Recebemos a solicitação de cadastro da sua ação. Em breve você receberá um email com as informações de cadastro.',
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

  const renderizaFormaDeRealizacaoAtividade = () => (
    <>
      <option value="">Selecione uma opção</option>

      {listaFormaAcao.map((forma) => (
        <option key={forma.value} value={forma.value}>
          {forma.label}
        </option>
      ))}
    </>
  );

  const renderizaOpcoesDeCategorias = () => (
    <>
      <option value="">Selecione uma opção</option>

      {listaDeCategorias.map(({ id, descricao }) => (
        <option key={id} value={id}>
          {descricao}
        </option>
      ))}
    </>
  );

  const renderizaOpcoesTipoDePublicoEvento = () => (
    <>
      <option value="">Selecione uma opção</option>

      {listaTipoPublico.map((tipoPublico) => (
        <option key={tipoPublico.value} value={tipoPublico.value}>
          {tipoPublico.label}
        </option>
      ))}
    </>
  );

  return (
    <Container>
      <LoadingOverlay isLoading={isLoading} />

      <Formik
        initialValues={valoresIniciaisFormik}
        validationSchema={schema}
        onSubmit={handleSubmitForm}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="form">
            <Card>
              <CardHeader>
                <CardTitle>INSCRIÇÃO DE AÇÃO - SEMANA LIXO ZERO CAXIAS DO SUL</CardTitle>

                <AdditionalInfoEventCreate
                  collapseState={additionalInfoState}
                  handleChangeCollapseState={() =>
                    setAdditionalInfoState((prevState) => !prevState)
                  }
                />
              </CardHeader>

              <CardBody>
                {/* Nome do organizador */}
                <FormGroup>
                  <Label for="nomeDoOrganizador">Nome do organizador da ação</Label>

                  <span className="form-text text-muted small">
                    {`Empresa/Instituição/Grupo que você representa. Se for 'pessoa física' insira seu
                nome`}
                  </span>

                  <Input
                    type="text"
                    id="nomeDoOrganizador"
                    name="nomeDoOrganizador"
                    placeholder="Nome do responsável pela ação"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.nomeDoOrganizador && !!errors.nomeDoOrganizador}
                  />

                  <FormFeedback>
                    <ErrorMessage name="nomeDoOrganizador" />
                  </FormFeedback>
                </FormGroup>

                {/* Numero do whatsapp */}
                <FormGroup>
                  <Label for="numeroDoWhatsapp">Whatsapp do responsável pela ação</Label>
                  <InputMask mask="(99) 99999-9999" onChange={handleChange} onBlur={handleBlur}>
                    {
                      ((inputProps: Props) => (
                        <Input
                          {...inputProps}
                          type="text"
                          id="numeroDoWhatsapp"
                          name="numeroDoWhatsapp"
                          placeholder="(99) 99999-9999"
                          invalid={touched.numeroDoWhatsapp && !!errors.numeroDoWhatsapp}
                        />
                      )) as unknown as ReactNode
                    }
                  </InputMask>

                  <FormFeedback>
                    <ErrorMessage name="numeroDoWhatsapp" />
                  </FormFeedback>
                </FormGroup>

                {/* Titulo da atividade */}
                <FormGroup>
                  <Label for="tituloDaAtividade">
                    Título da atividade para divulgação na programação
                  </Label>

                  <span className="form-text text-muted small">
                    Ex: Webinar sobre coleta seletiva / Live: Compostagem na Prática / Oficina de
                    receitas....
                  </span>

                  <Input
                    type="text"
                    id="tituloDaAtividade"
                    name="tituloDaAtividade"
                    placeholder="Título da atividade"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.tituloDaAtividade && !!errors.tituloDaAtividade}
                  />

                  <FormFeedback>
                    <ErrorMessage name="tituloDaAtividade" />
                  </FormFeedback>
                </FormGroup>

                {/* Descrição da atividade */}
                <FormGroup>
                  <Label for="descricaoDaAtividade">
                    Descrição resumida da atividade (o que será falado / feito?)
                  </Label>

                  <span className="form-text text-muted small">
                    Se houver necessidade de INSCRIÇÃO de participantes para acesso ao seu evento,
                    por favor informe aqui como deve acontecer.
                  </span>

                  <Input
                    type="textarea"
                    id="descricaoDaAtividade"
                    name="descricaoDaAtividade"
                    placeholder="Descrição da atividade"
                    rows={5}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.descricaoDaAtividade && !!errors.descricaoDaAtividade}
                    style={{ resize: 'none' }}
                  />

                  <FormFeedback>
                    <ErrorMessage name="descricaoDaAtividade" />
                  </FormFeedback>
                </FormGroup>

                {/* Tipo da atividade */}
                <FormGroup>
                  <Label for="tipoDaAtividade">Tipo da atividade</Label>

                  <Field
                    as="select"
                    id="tipoDaAtividade"
                    name="tipoDaAtividade"
                    className={`form-control ${touched.tipoDaAtividade && errors.tipoDaAtividade ? 'is-invalid' : ''}`}
                  >
                    {renderizaOpcoesDeCategorias()}
                  </Field>

                  <FormFeedback>
                    <ErrorMessage name="tipoDaAtividade" />
                  </FormFeedback>
                </FormGroup>

                {/* Data da ação */}
                <FormGroup>
                  <Label for="dataDaAcao">
                    Data e horário que a atividade será realizada (datas entre 18/10/
                    {moment().year()} e 26/10/{moment().year()})
                  </Label>

                  <Field
                    name="dataDaAcao"
                    component={DateTimePicker}
                    placeholder="Selecione uma data e hora"
                  />

                  {touched.dataDaAcao && errors.dataDaAcao && (
                    <FormFeedback style={{ display: 'block' }}>{errors.dataDaAcao}</FormFeedback>
                  )}
                </FormGroup>

                {/* Forma de realização da atividade */}
                <FormGroup>
                  <Label for="formaDeRealizacaoAtividade">Forma de realização da atividade</Label>

                  <Field
                    as="select"
                    id="formaDeRealizacaoAtividade"
                    name="formaDeRealizacaoAtividade"
                    className={`form-control ${touched.formaDeRealizacaoAtividade && errors.formaDeRealizacaoAtividade ? 'is-invalid' : ''}`}
                  >
                    {renderizaFormaDeRealizacaoAtividade()}
                  </Field>

                  <FormFeedback>
                    <ErrorMessage name="formaDeRealizacaoAtividade" />
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label for="linkDeDivulgacaoAcessoDoEvento">
                    Link de divulgação de acesso ao evento
                  </Label>

                  <Input
                    type="text"
                    id="linkDeDivulgacaoAcessoDoEvento"
                    name="linkDeDivulgacaoAcessoDoEvento"
                    placeholder="Link de divulgação de acesso ao evento"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={
                      touched.linkDeDivulgacaoAcessoDoEvento &&
                      !!errors.linkDeDivulgacaoAcessoDoEvento
                    }
                  />

                  <FormFeedback>
                    <ErrorMessage name="linkDeDivulgacaoAcessoDoEvento" />
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label for="nomeDoLocalDoEvento">Nome do local do evento</Label>

                  <Input
                    disabled={values.formaDeRealizacaoAtividade === FormaRealizacaoAcao.Online}
                    type="text"
                    id="nomeDoLocalDoEvento"
                    name="nomeDoLocalDoEvento"
                    placeholder="Nome do local do evento"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.nomeDoLocalDoEvento && !!errors.nomeDoLocalDoEvento}
                  />

                  <FormFeedback>
                    <ErrorMessage name="nomeDoLocalDoEvento" />
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label for="enderecoDoLocalDoEvento">Endereço do local do evento</Label>

                  <Input
                    disabled={values.formaDeRealizacaoAtividade === FormaRealizacaoAcao.Online}
                    type="text"
                    id="enderecoDoLocalDoEvento"
                    name="enderecoDoLocalDoEvento"
                    placeholder="Endereço do local do evento"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.enderecoDoLocalDoEvento && !!errors.enderecoDoLocalDoEvento}
                  />

                  <FormFeedback>
                    <ErrorMessage name="enderecoDoLocalDoEvento" />
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label for="informacoesDeOndeOcorreraOEvento">
                    Informações sobre como ocorrerá o evento
                  </Label>

                  <Input
                    disabled={values.formaDeRealizacaoAtividade === FormaRealizacaoAcao.Online}
                    type="textarea"
                    id="informacoesDeOndeOcorreraOEvento"
                    name="informacoesDeOndeOcorreraOEvento"
                    placeholder="Informações sobre como ocorrerá o evento"
                    rows={5}
                    style={{ resize: 'none' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={
                      touched.informacoesDeOndeOcorreraOEvento &&
                      !!errors.informacoesDeOndeOcorreraOEvento
                    }
                  />

                  <FormFeedback>
                    <ErrorMessage name="informacoesDeOndeOcorreraOEvento" />
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label for="linkParaInscricao">
                    Link para inscrição (se não tiver, deixe em branco)
                  </Label>

                  <Input
                    type="text"
                    id="linkParaInscricao"
                    name="linkParaInscricao"
                    placeholder="Link para inscrição"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.linkParaInscricao && !!errors.linkParaInscricao}
                  />

                  <FormFeedback>
                    <ErrorMessage name="linkParaInscricao" />
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label for="tipoDePublicoEvento">
                    Evento será para o público externo ou interno?
                  </Label>

                  <Input
                    id="tipoDePublicoEvento"
                    name="tipoDePublicoEvento"
                    type="select"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.tipoDePublicoEvento && !!errors.tipoDePublicoEvento}
                  >
                    {renderizaOpcoesTipoDePublicoEvento()}
                  </Input>

                  <FormFeedback>
                    <ErrorMessage name="tipoDePublicoEvento" />
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label for="descricaoDivulgacaoEvento">
                    Descrição resumida de como você pretende divulgar o evento
                  </Label>

                  <Input
                    type="textarea"
                    id="descricaoDivulgacaoEvento"
                    name="descricaoDivulgacaoEvento"
                    placeholder="Descrição resumida de como você pretende divulgar o evento"
                    rows={5}
                    style={{ resize: 'none' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={
                      touched.descricaoDivulgacaoEvento && !!errors.descricaoDivulgacaoEvento
                    }
                  />

                  <FormFeedback>
                    <ErrorMessage name="descricaoDivulgacaoEvento" />
                  </FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label for="numeroDeOrganizadores">
                    Quantas pessoas irão organizar essa ação? (Incluindo você)
                  </Label>

                  <span className="form-text text-muted small">
                    Se não tiver certeza, insira uma média
                  </span>

                  <Input
                    id="numeroDeOrganizadores"
                    name="numeroDeOrganizadores"
                    type="number"
                    placeholder="Número de participantes"
                    min="0"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.numeroDeOrganizadores && !!errors.numeroDeOrganizadores}
                  />

                  <FormFeedback>
                    <ErrorMessage name="numeroDeOrganizadores" />
                  </FormFeedback>
                </FormGroup>
              </CardBody>

              <CardFooter className="d-flex justify-content-center">
                <Button type="submit" color="primary">
                  Enviar
                </Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export { ActionContainer };
