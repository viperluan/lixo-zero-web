import { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from '~/lib/moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { listarEnumerados, FormaRealizacaoAcao, SituacaoAcao, TipoUsuario } from '~/Enumerados';
import api from '~api';
import messages from './locales'; // Importar mensagens traduzidas
import { LoadingOverlay } from '~components/Loading';
import { getActionStatus } from '~components/ActionStatusBadge';
import { useAuth } from '~context/AuthContext';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
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

const ActionCalendar = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
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

  const { defaultDate } = useMemo(
    () => ({
      defaultDate: new Date('2025-10-17'),
    }),
    []
  );

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

    const { data } = await api.get(`/acoes?page=1&limit=5000&${queryString}`);

    if (!data) {
      setIsLoading(false);
      return;
    }

    if (data.actions) {
      const formattedEvents = data.actions.map((action) => ({
        ...action,
        title: action.titulo_acao,
        description: action.descricao_acao,
        start: moment(action.data_acao).toDate(),
        end: moment(action.data_acao).toDate(),
      }));

      setFilteredEvents(formattedEvents);
    }

    setIsLoading(false);
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
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
              Filtros
            </h3>

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
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              popup
              onSelectEvent={handleSelectEvent}
              defaultView="month"
              views={['month', 'day']}
              defaultDate={defaultDate}
              messages={messages}
              eventPropGetter={eventPropGetter}
            />

            {isAdmin && (
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                  Legenda
                </h4>

                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {LEGENDA.map(({ situacao, descricao }) => (
                    <li key={situacao} className="flex items-center gap-2 text-sm text-gray-600">
                      <Badge variant={getActionStatus(situacao).variant}>{situacao}</Badge>
                      {descricao}
                    </li>
                  ))}
                </ul>
              </div>
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
              <p>
                <b>Celular organizador:</b> {selectedEvent.celular}
              </p>
              <p>
                <b>Data:</b> {moment(selectedEvent.data_acao).format('DD/MM/YYYY')}
              </p>
              <p>
                <b>Horário:</b> {moment(selectedEvent.data_acao).format('HH:mm')}
              </p>
              <p>
                <b>Forma de Realização:</b> {selectedEvent.forma_realizacao_acao}
              </p>
              <p>
                <b>Atividade:</b> {selectedEvent.categoria.descricao}
              </p>

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

              <p>
                <b>Link para divulgação:</b> {selectedEvent.link_divulgacao_acesso_acao}
              </p>
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
