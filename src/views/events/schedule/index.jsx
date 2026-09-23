import { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from '~/lib/moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarDays, List } from 'lucide-react';
import { listarEnumerados, FormaRealizacaoAcao, SituacaoAcao, TipoUsuario } from '~/Enumerados';
import api from '~api';
import messages from './locales'; // Importar mensagens traduzidas
import { LoadingOverlay } from '~components/Loading';
import { getActionStatus } from '~components/ActionStatusBadge';
import { ActionAgenda } from '~components/ActionAgenda';
import { ordenarPorData } from '~/lib/acoes';
import { useAuth } from '~context/AuthContext';
import { useEdicao } from '~context/EdicaoContext';
import { rotuloPeriodo } from '~/lib/periodoSlz';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  cn,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
} from '~components/ui';

// O locale pt-br ja vem aplicado por ~/lib/moment
const localizer = momentLocalizer(moment);

const LEGENDA = [
  { situacao: 'Pendente', descricao: 'Aguardando Confirmação' },
  { situacao: 'Aprovada', descricao: 'Confirmada' },
  { situacao: 'Reprovada', descricao: 'Cancelada' },
];

const VISOES = [
  { id: 'lista', rotulo: 'Lista', icone: List },
  { id: 'mes', rotulo: 'Mês', icone: CalendarDays },
];

/** Teto imposto por `normalizarPaginacao` no back, independente do que se peça. */
const LIMITE_POR_PAGINA = 100;

const ActionCalendar = () => {
  const { user } = useAuth();
  const { edicao, semVigente } = useEdicao();
  const [isLoading, setIsLoading] = useState(false);
  const [acoes, setAcoes] = useState([]);
  const [visao, setVisao] = useState('lista');
  const [listCategories, setListCategories] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const listaFormaAcao = listarEnumerados(FormaRealizacaoAcao);
  const listaSituacaoAcao = listarEnumerados(SituacaoAcao);
  const [situacaoFiltro, setSituacaoFiltro] = useState('');
  const [search, setSearch] = useState('');
  const [listUsers, setListUsers] = useState([]);
  const [userFilter, setUserFilter] = useState('');

  const isAdmin = user?.tipo === TipoUsuario.Admin;

  const acoesOrdenadas = useMemo(() => ordenarPorData(acoes), [acoes]);

  const eventosCalendario = useMemo(
    () =>
      acoesOrdenadas.map((acao) => ({
        ...acao,
        title: acao.titulo_acao,
        start: moment(acao.data_acao).toDate(),
        end: moment(acao.data_acao).toDate(),
      })),
    [acoesOrdenadas]
  );

  const [dataCalendario, setDataCalendario] = useState(() => new Date());

  /**
   * O calendario abria fixo em outubro/2025, um mes que ficou vazio quando a
   * campanha virou 2026. Agora ele se posiciona na proxima acao da lista; se
   * tudo ja passou, na ultima; sem acao nenhuma, no mes corrente. Reposiciona a
   * cada nova busca, que e quando recentralizar e o comportamento desejado.
   */
  useEffect(() => {
    if (acoesOrdenadas.length === 0) return;

    const proxima = acoesOrdenadas.find((acao) =>
      moment(acao.data_acao).isSameOrAfter(moment(), 'day')
    );

    setDataCalendario(
      moment((proxima ?? acoesOrdenadas[acoesOrdenadas.length - 1]).data_acao).toDate()
    );
  }, [acoesOrdenadas]);

  /**
   * O back trunca `limit` em 100 (`normalizarPaginacao`), entao a agenda monta
   * a lista completa somando as paginas. Depende do `orderBy` estavel do
   * repositorio para nao repetir nem pular registros entre elas.
   */
  const buscarTodasAsPaginas = async (queryString) => {
    const { data } = await api.get(`/acoes?page=1&limit=${LIMITE_POR_PAGINA}&${queryString}`);

    const primeiraPagina = data?.actions ?? [];
    const totalPaginas = data?.totalPages ?? 1;

    if (totalPaginas <= 1) return primeiraPagina;

    const demaisPaginas = await Promise.all(
      Array.from({ length: totalPaginas - 1 }, (_, indice) =>
        api.get(`/acoes?page=${indice + 2}&limit=${LIMITE_POR_PAGINA}&${queryString}`)
      )
    );

    return demaisPaginas.reduce(
      (todas, { data: pagina }) => todas.concat(pagina?.actions ?? []),
      primeiraPagina
    );
  };

  const fetchActions = async () => {
    setIsLoading(true);

    const filters = {};

    if (filterCategory) {
      filters.id_categoria = filterCategory;
    }

    if (isAdmin) {
      if (situacaoFiltro) filters.situacao = situacaoFiltro;
    } else {
      filters.situacao = SituacaoAcao.Confirmada;
    }

    if (userFilter) {
      filters.id_usuario = userFilter;
    }

    if (search) {
      filters.search = search.trim();
    }

    if (filterType) {
      filters.forma_realizacao_acao = filterType;
    }

    const queryString = new URLSearchParams(filters).toString();

    try {
      setAcoes(await buscarTodasAsPaginas(queryString));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = () => {
    api.get(`/categorias?page=1&limit=150`).then((res) => {
      setListCategories(res.data.categories || []);
    });
  };

  const fetchUsers = () => {
    api.get(`/usuarios?page=1&limit=150`).then((res) => {
      setListUsers(res.data.users || []);
    });
  };

  useEffect(() => {
    fetchActions();
    fetchCategories();

    if (isAdmin) {
      fetchUsers();
    }
  }, []);

  const toggleModal = () => setModalOpen(!modalOpen);

  const eventPropGetter = (event) => ({
    style: { backgroundColor: getActionStatus(event.situacao_acao).color },
  });

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    toggleModal();
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <Container>
        <Card>
          <CardHeader>
            <h3 className="label-condensed mb-3 text-sm text-brand-forest">Filtros</h3>

            <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <FormGroup className="mb-4">
                <Label htmlFor="pesquisa">Pesquisa</Label>
                <Input
                  id="pesquisa"
                  name="pesquisa"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FormGroup>

              <FormGroup className="mb-4">
                <Label htmlFor="tipo_atividade">Tipo da Atividade</Label>
                <Select
                  id="tipo_atividade"
                  name="activityType"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Todos</option>
                  {listCategories.map((categorie) => (
                    <option key={categorie.id} value={categorie.id}>
                      {categorie.descricao}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              {isAdmin && (
                <>
                  <FormGroup className="mb-4">
                    <Label htmlFor="situacao">Situação</Label>
                    <Select
                      id="situacao"
                      value={situacaoFiltro}
                      onChange={(e) => setSituacaoFiltro(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {listaSituacaoAcao.map((forma) => (
                        <option key={forma.value} value={forma.value}>
                          {forma.label}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Label htmlFor="id_usuario">Usuário</Label>
                    <Select
                      id="id_usuario"
                      name="id_usuario"
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {listUsers.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.nome}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                </>
              )}

              <FormGroup className="mb-4">
                <Label htmlFor="filterType">Tipo de Ação</Label>
                <Select
                  id="filterType"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Todos</option>
                  {listaFormaAcao.map((forma) => (
                    <option key={forma.value} value={forma.value}>
                      {forma.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </div>

            <Button onClick={() => fetchActions()}>Filtrar</Button>
          </CardHeader>

          <CardBody>
            {semVigente && (
              <div className="rounded-2xl border border-dashed border-brand-leaf/60 bg-brand-cream/60 px-6 py-8 text-center">
                <h3 className="text-lg text-brand-forest">
                  A programação desta edição ainda não está no ar.
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-brand-dark/70">
                  Quando houver edição vigente, as ações aprovadas aparecem nesta agenda.
                </p>
              </div>
            )}

            {edicao && (
              <p className="mb-4 text-sm text-brand-dark/70">
                Edição {edicao.ano}:{' '}
                {rotuloPeriodo(edicao.data_inicio_realizacao, edicao.data_fim_realizacao)}
              </p>
            )}

            {!semVigente && (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="label-condensed text-sm text-brand-dark/60">
                    {acoesOrdenadas.length}{' '}
                    {acoesOrdenadas.length === 1 ? 'ação encontrada' : 'ações encontradas'}
                  </p>

                  <div
                    role="group"
                    aria-label="Modo de visualização"
                    className="inline-flex rounded-xl border border-brand-leaf/40 bg-brand-cream p-1"
                  >
                    {VISOES.map(({ id, rotulo, icone: Icone }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setVisao(id)}
                        aria-pressed={visao === id}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-condensed text-sm font-semibold uppercase tracking-wide transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-brand-forest focus:ring-offset-1',
                          visao === id
                            ? 'bg-brand-forest text-brand-cream'
                            : 'text-brand-forest hover:bg-brand-sage/25'
                        )}
                      >
                        <Icone className="h-4 w-4" aria-hidden="true" />
                        {rotulo}
                      </button>
                    ))}
                  </div>
                </div>

                {visao === 'lista' ? (
                  <ActionAgenda
                    acoes={acoesOrdenadas}
                    onSelecionar={handleSelectEvent}
                    mostrarSituacao={isAdmin}
                  />
                ) : (
                  <Calendar
                    localizer={localizer}
                    events={eventosCalendario}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    popup
                    onSelectEvent={handleSelectEvent}
                    defaultView="month"
                    views={['month', 'day']}
                    date={dataCalendario}
                    onNavigate={setDataCalendario}
                    messages={messages}
                    eventPropGetter={eventPropGetter}
                  />
                )}

                {/* A legenda explica as CORES do calendario. Na lista a situacao ja
                aparece rotulada em cada linha, entao ali ela e redundante. */}
                {isAdmin && visao === 'mes' && (
                  <div className="mt-6">
                    <h4 className="label-condensed mb-3 text-sm text-brand-forest">Legenda</h4>

                    <ul className="flex flex-wrap gap-x-6 gap-y-2">
                      {LEGENDA.map(({ situacao, descricao }) => (
                        <li
                          key={situacao}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <Badge variant={getActionStatus(situacao).variant}>{situacao}</Badge>
                          {descricao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Container>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        {selectedEvent && (
          <>
            <ModalHeader toggle={toggleModal}>{selectedEvent.titulo_acao}</ModalHeader>

            <ModalBody className="space-y-2 text-sm text-brand-dark">
              <p>
                <b>Nome do organizador:</b> {selectedEvent.nome_organizador}
              </p>
              {/* A API sanitiza a saida para quem nao e admin: sem o guard, o
                  rotulo aparece com o valor em branco. */}
              {selectedEvent.celular && (
                <p>
                  <b>Celular organizador:</b> {selectedEvent.celular}
                </p>
              )}

              <p>
                <b>Data:</b> {moment(selectedEvent.data_acao).format('DD/MM/YYYY')}
              </p>
              <p>
                <b>Horário:</b> {moment(selectedEvent.data_acao).format('HH:mm')}
              </p>
              <p>
                <b>Forma de Realização:</b> {selectedEvent.forma_realizacao_acao}
              </p>
              {/* Os endpoints por data nao fazem `include` dos relacionamentos;
                  sem o optional chaining, trocar de endpoint viraria tela branca. */}
              {selectedEvent.categoria?.descricao && (
                <p>
                  <b>Atividade:</b> {selectedEvent.categoria.descricao}
                </p>
              )}

              {selectedEvent.nome_local_acao && (
                <p>
                  <b>Nome do local:</b> {selectedEvent.nome_local_acao}
                </p>
              )}

              {selectedEvent.endereco_local_acao && (
                <p>
                  <b>Endereço do local:</b> {selectedEvent.endereco_local_acao}
                </p>
              )}

              {selectedEvent.link_para_inscricao_acao && (
                <p>
                  <b>Link para inscrição:</b> {selectedEvent.link_para_inscricao_acao}
                </p>
              )}

              {selectedEvent.link_divulgacao_acesso_acao && (
                <p>
                  <b>Link para divulgação:</b> {selectedEvent.link_divulgacao_acesso_acao}
                </p>
              )}

              <p>
                <b>Número de organizadores:</b> {selectedEvent.numero_organizadores_acao}
              </p>
              <p>
                <b>Descrição:</b> {selectedEvent.descricao_acao}
              </p>
            </ModalBody>

            <ModalFooter>
              <Button variant="neutral" onClick={toggleModal}>
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </>
  );
};

export { ActionCalendar };
