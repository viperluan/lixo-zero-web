import { FormaRealizacaoAcao, TipoPublico } from '~/Enumerados';
import { listarEnumerados } from '~/Enumerados';
import { DateTimePicker } from '~components/DatePicker';
import { useAuth } from '~context/AuthContext';
import moment, { Moment } from '~/lib/moment';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import InputMask, { Props } from 'react-input-mask';
import { LoadingOverlay } from '~components/Loading';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import api from '~api';
import AdditionalInfoEventCreate from '~components/AdditionalInfoEventCreate';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Container,
  FieldError,
  FormGroup,
  HelpText,
  Input,
  Label,
  Select,
  Textarea,
} from '~components/ui';

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
  termoDeCompromisso: boolean;
};

const INSCRICOES_ENCERRADAS = false;

// O ErrorMessage do Formik so renderiza quando o campo foi tocado e tem erro,
// entao envolve-lo no FieldError mantem o espacamento fora do fluxo quando nao
// ha mensagem.
const CampoErro = ({ name }: { name: string }) => (
  <ErrorMessage name={name}>{(mensagem) => <FieldError>{mensagem}</FieldError>}</ErrorMessage>
);

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
    termoDeCompromisso: false,
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
        const minDate = moment(`${moment().year()}-10-17`).format('YYYY-MM-DD');
        const maxDate = moment(`${moment().year()}-10-26`).format('YYYY-MM-DD');
        const recievedDate = moment(value).format('YYYY-MM-DD');

        return moment(recievedDate).isBetween(minDate, maxDate, undefined, '[]');
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
    termoDeCompromisso: yup
      .boolean()
      .oneOf([true], 'Você deve aceitar o termo de compromisso para cadastrar a ação.'),
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

      if (user.tipo === '0') {
        navigate('/admin/events');
        return;
      }

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

  const renderizaFormulario = () => (
    <Formik
      initialValues={valoresIniciaisFormik}
      validationSchema={schema}
      onSubmit={handleSubmitForm}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Card>
            <CardHeader className="space-y-5">
              <CardTitle>INSCRIÇÃO DE AÇÃO - SEMANA LIXO ZERO CAXIAS DO SUL</CardTitle>

              <AdditionalInfoEventCreate
                collapseState={additionalInfoState}
                handleChangeCollapseState={() => setAdditionalInfoState((prevState) => !prevState)}
              />
            </CardHeader>

            <CardBody>
              {/* Nome do organizador */}
              <FormGroup>
                <Label htmlFor="nomeDoOrganizador">Nome do organizador da ação</Label>

                <HelpText>
                  {`Empresa/Instituição/Grupo que você representa. Se for 'pessoa física' insira seu
                nome`}
                </HelpText>

                <Input
                  type="text"
                  id="nomeDoOrganizador"
                  name="nomeDoOrganizador"
                  placeholder="Nome do responsável pela ação"
                  autoComplete="on"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.nomeDoOrganizador && !!errors.nomeDoOrganizador}
                />

                <CampoErro name="nomeDoOrganizador" />
              </FormGroup>

              {/* Numero do whatsapp */}
              <FormGroup>
                <Label htmlFor="numeroDoWhatsapp">Whatsapp do responsável pela ação</Label>

                <InputMask mask="(99) 99999-9999" onChange={handleChange} onBlur={handleBlur}>
                  {
                    ((inputProps: Props) => (
                      <Input
                        {...inputProps}
                        type="text"
                        id="numeroDoWhatsapp"
                        name="numeroDoWhatsapp"
                        autoComplete="tel"
                        placeholder="(99) 99999-9999"
                        invalid={touched.numeroDoWhatsapp && !!errors.numeroDoWhatsapp}
                      />
                    )) as unknown as ReactNode
                  }
                </InputMask>

                <CampoErro name="numeroDoWhatsapp" />
              </FormGroup>

              {/* Titulo da atividade */}
              <FormGroup>
                <Label htmlFor="tituloDaAtividade">
                  Título da atividade para divulgação na programação
                </Label>

                <HelpText>
                  Ex: Webinar sobre coleta seletiva / Live: Compostagem na Prática / Oficina de
                  receitas....
                </HelpText>

                <Input
                  type="text"
                  id="tituloDaAtividade"
                  name="tituloDaAtividade"
                  placeholder="Título da atividade"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.tituloDaAtividade && !!errors.tituloDaAtividade}
                />

                <CampoErro name="tituloDaAtividade" />
              </FormGroup>

              {/* Descrição da atividade */}
              <FormGroup>
                <Label htmlFor="descricaoDaAtividade">
                  Descrição resumida da atividade (o que será falado / feito?)
                </Label>

                <HelpText>
                  Se houver necessidade de INSCRIÇÃO de participantes para acesso ao seu evento, por
                  favor informe aqui como deve acontecer.
                </HelpText>

                <Textarea
                  id="descricaoDaAtividade"
                  name="descricaoDaAtividade"
                  placeholder="Descrição da atividade"
                  rows={5}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.descricaoDaAtividade && !!errors.descricaoDaAtividade}
                />

                <CampoErro name="descricaoDaAtividade" />
              </FormGroup>

              {/* Tipo da atividade */}
              <FormGroup>
                <Label htmlFor="tipoDaAtividade">Tipo da atividade</Label>

                <Field
                  as={Select}
                  id="tipoDaAtividade"
                  name="tipoDaAtividade"
                  invalid={touched.tipoDaAtividade && !!errors.tipoDaAtividade}
                >
                  {renderizaOpcoesDeCategorias()}
                </Field>

                <CampoErro name="tipoDaAtividade" />
              </FormGroup>

              {/* Data da ação */}
              <FormGroup>
                <Label htmlFor="dataDaAcao">
                  Data e horário que a atividade será realizada (datas entre 17/10/
                  {moment().year()} e 26/10/{moment().year()})
                </Label>

                <Field
                  name="dataDaAcao"
                  component={DateTimePicker}
                  placeholder="Selecione uma data e hora"
                />

                {touched.dataDaAcao && errors.dataDaAcao && (
                  <FieldError>{errors.dataDaAcao as string}</FieldError>
                )}
              </FormGroup>

              {/* Forma de realização da atividade */}
              <FormGroup>
                <Label htmlFor="formaDeRealizacaoAtividade">Forma de realização da atividade</Label>

                <Field
                  as={Select}
                  id="formaDeRealizacaoAtividade"
                  name="formaDeRealizacaoAtividade"
                  invalid={
                    touched.formaDeRealizacaoAtividade && !!errors.formaDeRealizacaoAtividade
                  }
                >
                  {renderizaFormaDeRealizacaoAtividade()}
                </Field>

                <CampoErro name="formaDeRealizacaoAtividade" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="linkDeDivulgacaoAcessoDoEvento">
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

                <CampoErro name="linkDeDivulgacaoAcessoDoEvento" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="nomeDoLocalDoEvento">Nome do local do evento</Label>

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

                <CampoErro name="nomeDoLocalDoEvento" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="enderecoDoLocalDoEvento">Endereço do local do evento</Label>

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

                <CampoErro name="enderecoDoLocalDoEvento" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="informacoesDeOndeOcorreraOEvento">
                  Informações sobre como ocorrerá o evento
                </Label>

                <Textarea
                  disabled={values.formaDeRealizacaoAtividade === FormaRealizacaoAcao.Online}
                  id="informacoesDeOndeOcorreraOEvento"
                  name="informacoesDeOndeOcorreraOEvento"
                  placeholder="Informações sobre como ocorrerá o evento"
                  rows={5}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={
                    touched.informacoesDeOndeOcorreraOEvento &&
                    !!errors.informacoesDeOndeOcorreraOEvento
                  }
                />

                <CampoErro name="informacoesDeOndeOcorreraOEvento" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="linkParaInscricao">
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

                <CampoErro name="linkParaInscricao" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="tipoDePublicoEvento">
                  Evento será para o público externo ou interno?
                </Label>

                <Select
                  id="tipoDePublicoEvento"
                  name="tipoDePublicoEvento"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.tipoDePublicoEvento && !!errors.tipoDePublicoEvento}
                >
                  {renderizaOpcoesTipoDePublicoEvento()}
                </Select>

                <CampoErro name="tipoDePublicoEvento" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="descricaoDivulgacaoEvento">
                  Descrição resumida de como você pretende divulgar o evento
                </Label>

                <Textarea
                  id="descricaoDivulgacaoEvento"
                  name="descricaoDivulgacaoEvento"
                  placeholder="Descrição resumida de como você pretende divulgar o evento"
                  rows={5}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.descricaoDivulgacaoEvento && !!errors.descricaoDivulgacaoEvento}
                />

                <CampoErro name="descricaoDivulgacaoEvento" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="numeroDeOrganizadores">
                  Quantas pessoas irão organizar essa ação? (Incluindo você)
                </Label>

                <HelpText>Se não tiver certeza, insira uma média</HelpText>

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

                <CampoErro name="numeroDeOrganizadores" />
              </FormGroup>

              <FormGroup className="mb-0">
                <Checkbox
                  id="termoDeCompromisso"
                  name="termoDeCompromisso"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.termoDeCompromisso && !!errors.termoDeCompromisso}
                  label="Eu me comprometo a preencher o relatório de indicadores da atividade que desenvolvi ao final da SLZ. Você receberá um email com o formulário."
                />

                <CampoErro name="termoDeCompromisso" />
              </FormGroup>
            </CardBody>

            <CardFooter className="justify-center">
              <Button type="submit" size="lg">
                Cadastrar ação
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Formik>
  );

  const renderizaMensagemAcabouPrazo = () => (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          As inscrições de ações para a 6ª Semana Lixo Zero estão encerradas! 💚
        </CardTitle>
      </CardHeader>

      <CardBody className="space-y-6 px-6 py-10 text-center sm:px-12">
        <p className="text-lg text-gray-700">
          Se você já inscreveu sua ação, confira seu email cadastrado para orientações. Em breve
          divulgaremos a programação completa!
        </p>

        <p className="text-lg text-gray-700">
          Fiquem ligados na nossa página e nos vemos nas ações da Semana Lixo Zero!
        </p>
      </CardBody>
    </Card>
  );

  return (
    <Container className="max-w-4xl">
      <LoadingOverlay isLoading={isLoading} />

      {INSCRICOES_ENCERRADAS ? renderizaMensagemAcabouPrazo() : renderizaFormulario()}
    </Container>
  );
};

export { ActionContainer };
