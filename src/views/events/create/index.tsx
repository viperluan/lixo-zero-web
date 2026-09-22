import { FormaRealizacaoAcao, TipoPublico } from '~/Enumerados';
import { listarEnumerados } from '~/Enumerados';
import { DateTimePicker } from '~components/DatePicker';
import { useAuth } from '~context/AuthContext';
import moment, { Moment } from '~/lib/moment';
import { ReactNode, useEffect, useRef, useState } from 'react';
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
import { Formik, Field, Form, ErrorMessage, type FormikProps } from 'formik';

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

const ORDEM_CAMPOS: (keyof DadosFormik)[] = [
  'nomeDoOrganizador',
  'numeroDoWhatsapp',
  'tituloDaAtividade',
  'descricaoDaAtividade',
  'tipoDaAtividade',
  'dataDaAcao',
  'formaDeRealizacaoAtividade',
  'linkDeDivulgacaoAcessoDoEvento',
  'nomeDoLocalDoEvento',
  'enderecoDoLocalDoEvento',
  'informacoesDeOndeOcorreraOEvento',
  'linkParaInscricao',
  'tipoDePublicoEvento',
  'descricaoDivulgacaoEvento',
  'numeroDeOrganizadores',
  'termoDeCompromisso',
];

const CLASSE_TITULO_BLOCO =
  'mb-4 font-condensed text-sm font-semibold uppercase tracking-wide text-brand-forest';

type FormularioCadastroAcaoProps = FormikProps<DadosFormik> & {
  listaDeCategorias: Categoria[];
};

const FormularioCadastroAcao = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  submitCount,
  setFieldValue,
  listaDeCategorias,
}: FormularioCadastroAcaoProps) => {
  const listaFormaAcao = listarEnumerados(FormaRealizacaoAcao);
  const listaTipoPublico = listarEnumerados(TipoPublico);
  const formaAnterior = useRef(values.formaDeRealizacaoAtividade);
  const submitCountVisto = useRef(submitCount);
  const errosRef = useRef(errors);
  errosRef.current = errors;

  const mostraLink =
    values.formaDeRealizacaoAtividade === FormaRealizacaoAcao.Online ||
    values.formaDeRealizacaoAtividade === FormaRealizacaoAcao.Hibrida;
  const mostraLocal =
    values.formaDeRealizacaoAtividade === FormaRealizacaoAcao.Presencial ||
    values.formaDeRealizacaoAtividade === FormaRealizacaoAcao.Hibrida;
  const exibirRevisao = submitCount > 0 && Object.keys(errors).length > 0;

  useEffect(() => {
    const anterior = formaAnterior.current;
    const atual = values.formaDeRealizacaoAtividade;
    if (anterior === atual) return;

    formaAnterior.current = atual;

    const exigeLink = atual === FormaRealizacaoAcao.Online || atual === FormaRealizacaoAcao.Hibrida;
    const exigeLocal =
      atual === FormaRealizacaoAcao.Presencial || atual === FormaRealizacaoAcao.Hibrida;

    if (!exigeLink) setFieldValue('linkDeDivulgacaoAcessoDoEvento', '');

    if (!exigeLocal) {
      setFieldValue('nomeDoLocalDoEvento', '');
      setFieldValue('enderecoDoLocalDoEvento', '');
      setFieldValue('informacoesDeOndeOcorreraOEvento', '');
    }
  }, [values.formaDeRealizacaoAtividade, setFieldValue]);

  useEffect(() => {
    if (submitCount === submitCountVisto.current) return;
    submitCountVisto.current = submitCount;

    const erros = errosRef.current;
    const nome = ORDEM_CAMPOS.find(
      (campo) => erros[campo] && document.getElementById(`campo-${campo}`)
    );
    if (!nome) return;

    const container = document.getElementById(`campo-${nome}`);
    if (!container) return;

    container.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const controle = container.querySelector<HTMLElement>('input, select, textarea');
    if (controle) {
      controle.focus();
      return;
    }

    container.tabIndex = -1;
    container.focus();
  }, [submitCount]);

  return (
    <Form>
      <Card overflowClip={false}>
        <CardHeader className="space-y-5">
          <div>
            <CardTitle>Inscrição de ação</CardTitle>
            <p className="text-sm text-gray-500">Semana Lixo Zero Caxias do Sul</p>
          </div>

          <AdditionalInfoEventCreate />
        </CardHeader>

        <CardBody>
          {exibirRevisao && (
            <p
              role="alert"
              className="mb-5 rounded-lg border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm font-medium text-brand-danger"
            >
              Revise os campos marcados.
            </p>
          )}

          <HelpText className="mb-5">Campos com * são obrigatórios</HelpText>

          <h3 className={CLASSE_TITULO_BLOCO}>Quem organiza</h3>

          <FormGroup id="campo-nomeDoOrganizador">
            <Label htmlFor="nomeDoOrganizador" required>
              Nome do organizador da ação
            </Label>

            <HelpText>
              Empresa/Instituição/Grupo que você representa. Se for &apos;pessoa física&apos; insira
              seu nome
            </HelpText>

            <Input
              type="text"
              id="nomeDoOrganizador"
              name="nomeDoOrganizador"
              autoComplete="on"
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.nomeDoOrganizador && !!errors.nomeDoOrganizador}
            />

            <CampoErro name="nomeDoOrganizador" />
          </FormGroup>

          <FormGroup id="campo-numeroDoWhatsapp">
            <Label htmlFor="numeroDoWhatsapp" required>
              Whatsapp do responsável pela ação
            </Label>

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

          <h3 className={`${CLASSE_TITULO_BLOCO} mt-8`}>A atividade</h3>

          <FormGroup id="campo-tituloDaAtividade">
            <Label htmlFor="tituloDaAtividade" required>
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
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.tituloDaAtividade && !!errors.tituloDaAtividade}
            />

            <CampoErro name="tituloDaAtividade" />
          </FormGroup>

          <FormGroup id="campo-descricaoDaAtividade">
            <Label htmlFor="descricaoDaAtividade" required>
              Descrição resumida da atividade (o que será falado / feito?)
            </Label>

            <Textarea
              id="descricaoDaAtividade"
              name="descricaoDaAtividade"
              rows={5}
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.descricaoDaAtividade && !!errors.descricaoDaAtividade}
            />

            <CampoErro name="descricaoDaAtividade" />
          </FormGroup>

          <FormGroup id="campo-tipoDaAtividade">
            <Label htmlFor="tipoDaAtividade" required>
              Tipo da atividade
            </Label>

            <Field
              as={Select}
              id="tipoDaAtividade"
              name="tipoDaAtividade"
              invalid={touched.tipoDaAtividade && !!errors.tipoDaAtividade}
            >
              <option value="">Selecione uma opção</option>
              {listaDeCategorias.map(({ id, descricao }) => (
                <option key={id} value={id}>
                  {descricao}
                </option>
              ))}
            </Field>

            <CampoErro name="tipoDaAtividade" />
          </FormGroup>

          <FormGroup id="campo-dataDaAcao">
            <Label htmlFor="dataDaAcao" required>
              Data e horário
            </Label>

            <HelpText>Entre 7 e 15 de novembro de 2026.</HelpText>

            <Field name="dataDaAcao" component={DateTimePicker} />

            {touched.dataDaAcao && errors.dataDaAcao && (
              <FieldError>{errors.dataDaAcao as string}</FieldError>
            )}
          </FormGroup>

          <h3 className={`${CLASSE_TITULO_BLOCO} mt-8`}>Onde acontece</h3>

          <FormGroup id="campo-formaDeRealizacaoAtividade">
            <Label htmlFor="formaDeRealizacaoAtividade" required>
              Forma de realização da atividade
            </Label>

            <Field
              as={Select}
              id="formaDeRealizacaoAtividade"
              name="formaDeRealizacaoAtividade"
              invalid={touched.formaDeRealizacaoAtividade && !!errors.formaDeRealizacaoAtividade}
            >
              <option value="">Selecione uma opção</option>
              {listaFormaAcao.map((forma) => (
                <option key={forma.value} value={forma.value}>
                  {forma.label}
                </option>
              ))}
            </Field>

            <CampoErro name="formaDeRealizacaoAtividade" />

            {values.formaDeRealizacaoAtividade === '' && (
              <HelpText>Escolha a forma para informar o link ou o local.</HelpText>
            )}
          </FormGroup>

          {mostraLink && (
            <FormGroup id="campo-linkDeDivulgacaoAcessoDoEvento">
              <Label htmlFor="linkDeDivulgacaoAcessoDoEvento" required>
                Link de divulgação de acesso ao evento
              </Label>

              <Input
                type="text"
                id="linkDeDivulgacaoAcessoDoEvento"
                name="linkDeDivulgacaoAcessoDoEvento"
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={
                  touched.linkDeDivulgacaoAcessoDoEvento && !!errors.linkDeDivulgacaoAcessoDoEvento
                }
              />

              <CampoErro name="linkDeDivulgacaoAcessoDoEvento" />
            </FormGroup>
          )}

          {mostraLocal && (
            <>
              <FormGroup id="campo-nomeDoLocalDoEvento">
                <Label htmlFor="nomeDoLocalDoEvento" required>
                  Nome do local do evento
                </Label>

                <Input
                  type="text"
                  id="nomeDoLocalDoEvento"
                  name="nomeDoLocalDoEvento"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.nomeDoLocalDoEvento && !!errors.nomeDoLocalDoEvento}
                />

                <CampoErro name="nomeDoLocalDoEvento" />
              </FormGroup>

              <FormGroup id="campo-enderecoDoLocalDoEvento">
                <Label htmlFor="enderecoDoLocalDoEvento" required>
                  Endereço do local do evento
                </Label>

                <Input
                  type="text"
                  id="enderecoDoLocalDoEvento"
                  name="enderecoDoLocalDoEvento"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.enderecoDoLocalDoEvento && !!errors.enderecoDoLocalDoEvento}
                />

                <CampoErro name="enderecoDoLocalDoEvento" />
              </FormGroup>

              <FormGroup id="campo-informacoesDeOndeOcorreraOEvento">
                <Label htmlFor="informacoesDeOndeOcorreraOEvento" required>
                  Informações sobre como ocorrerá o evento
                </Label>

                <Textarea
                  id="informacoesDeOndeOcorreraOEvento"
                  name="informacoesDeOndeOcorreraOEvento"
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
            </>
          )}

          <h3 className={`${CLASSE_TITULO_BLOCO} mt-8`}>Público e divulgação</h3>

          <FormGroup id="campo-linkParaInscricao">
            <Label htmlFor="linkParaInscricao">
              Link para inscrição (se não tiver, deixe em branco)
            </Label>

            <HelpText>
              Se houver necessidade de inscrição de participantes para acesso ao seu evento, informe
              aqui como deve acontecer.
            </HelpText>

            <Input
              type="text"
              id="linkParaInscricao"
              name="linkParaInscricao"
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.linkParaInscricao && !!errors.linkParaInscricao}
            />

            <CampoErro name="linkParaInscricao" />
          </FormGroup>

          <FormGroup id="campo-tipoDePublicoEvento">
            <Label htmlFor="tipoDePublicoEvento" required>
              Evento será para o público externo ou interno?
            </Label>

            <Select
              id="tipoDePublicoEvento"
              name="tipoDePublicoEvento"
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.tipoDePublicoEvento && !!errors.tipoDePublicoEvento}
            >
              <option value="">Selecione uma opção</option>
              {listaTipoPublico.map((tipoPublico) => (
                <option key={tipoPublico.value} value={tipoPublico.value}>
                  {tipoPublico.label}
                </option>
              ))}
            </Select>

            <CampoErro name="tipoDePublicoEvento" />
          </FormGroup>

          <FormGroup id="campo-descricaoDivulgacaoEvento">
            <Label htmlFor="descricaoDivulgacaoEvento" required>
              Descrição resumida de como você pretende divulgar o evento
            </Label>

            <Textarea
              id="descricaoDivulgacaoEvento"
              name="descricaoDivulgacaoEvento"
              rows={5}
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.descricaoDivulgacaoEvento && !!errors.descricaoDivulgacaoEvento}
            />

            <CampoErro name="descricaoDivulgacaoEvento" />
          </FormGroup>

          <FormGroup id="campo-numeroDeOrganizadores">
            <Label htmlFor="numeroDeOrganizadores" required>
              Quantas pessoas irão organizar essa ação? (Incluindo você)
            </Label>

            <HelpText>Se não tiver certeza, insira uma média</HelpText>

            <Input
              id="numeroDeOrganizadores"
              name="numeroDeOrganizadores"
              type="number"
              placeholder="Ex.: 3"
              min="0"
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.numeroDeOrganizadores && !!errors.numeroDeOrganizadores}
            />

            <CampoErro name="numeroDeOrganizadores" />
          </FormGroup>

          <FormGroup id="campo-termoDeCompromisso" className="mb-0">
            <Checkbox
              id="termoDeCompromisso"
              name="termoDeCompromisso"
              required
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.termoDeCompromisso && !!errors.termoDeCompromisso}
              label="Eu me comprometo a preencher o relatório de indicadores da atividade que desenvolvi ao final da SLZ. Você receberá um email com o formulário."
            />

            <CampoErro name="termoDeCompromisso" />
          </FormGroup>

          <div className="h-24 sm:hidden" aria-hidden="true" />
        </CardBody>

        <CardFooter className="sticky bottom-0 z-10 flex justify-center rounded-b-xl sm:static">
          <Button type="submit" size="lg">
            Cadastrar ação
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
};

const ActionContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [listaDeCategorias, setListaDeCategorias] = useState<Categoria[]>([]);

  const valoresIniciaisFormik: DadosFormik = {
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
      .test('is-valid-date', 'A data deve estar entre 7 e 15 de novembro de 2026.', (value) => {
        const minDate = moment(`${moment().year()}-11-07`).format('YYYY-MM-DD');
        const maxDate = moment(`${moment().year()}-11-15`).format('YYYY-MM-DD');
        const recievedDate = moment(value).format('YYYY-MM-DD');

        return moment(recievedDate).isBetween(minDate, maxDate, undefined, '[]');
      }),
    formaDeRealizacaoAtividade: yup
      .string()
      .required('É necessário selecionar uma forma de realização da atividade.'),
    linkDeDivulgacaoAcessoDoEvento: yup.string().when('formaDeRealizacaoAtividade', {
      is: (value: string) =>
        value === FormaRealizacaoAcao.Online || value === FormaRealizacaoAcao.Hibrida,
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
      navigate('/auth/events/create/success', { state: { cadastroRealizado: true } });
      return;
    }

    if (data.error) toast.error(data.error);

    setIsLoading(false);
  };

  const renderizaFormulario = () => (
    <Formik
      initialValues={valoresIniciaisFormik}
      validationSchema={schema}
      onSubmit={handleSubmitForm}
    >
      {(formik) => <FormularioCadastroAcao {...formik} listaDeCategorias={listaDeCategorias} />}
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
