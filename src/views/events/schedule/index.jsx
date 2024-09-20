import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Input,
  FormGroup,
  Label,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  CardHeader,
  Container,
} from 'reactstrap';
import { listarEnumerados, FormaRealizacaoAcao, SituacaoAcao } from '~/Enumerados';
import api from '~api';
import messages from './locales'; // Importar mensagens traduzidas
import { LoadingOverlay } from '~components/Loading';
import { TipoUsuario } from '~/Enumerados';
import { useAuth } from '~context/AuthContext';

// Configurando o localizador para o calendário com locale pt-br
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

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
  const [userFilter, setUserFilter] = useState(null);

  const paddingContainer = user ? '0' : '24px 0 ';

  const fetchActions = async () => {
    setIsLoading(true);

    const filters = {};

    if (filterCategory) {
      filters.id_categoria = filterCategory;
    }

    if (user?.tipo === TipoUsuario.Admin) {
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

    if (user?.tipo === TipoUsuario.Admin) {
      fetchUsers();
    }
  }, []);

  const toggleModal = () => setModalOpen(!modalOpen);

  const eventPropGetter = (event) => {
    let backgroundColor = '#3174ad'; // Default color

    switch (event.situacao_acao) {
      case 'Pendente':
        backgroundColor = 'orange';
        break;
      case 'Aprovada':
        backgroundColor = 'green';
        break;
      case 'Reprovada':
        backgroundColor = 'red';
        break;
      default:
        backgroundColor = '#3174ad';
    }
    return { style: { backgroundColor } };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    toggleModal();
  };

  const renderCardContainer = () => {
    return (
      <Card>
        <CardHeader className="border-0">
          <div>
            <h3 className="mb-0">Filtros</h3>
            <Row>
              <Col xl="2">
                <FormGroup>
                  <Label for="pesquisa">Pesquisa</Label>
                  <Input
                    id="pesquisa"
                    name="pesquisa"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  ></Input>
                </FormGroup>
              </Col>
              <Col lg="3">
                <FormGroup>
                  <Label for="tipo_atividade">Tipo da Atividade</Label>
                  <Input
                    id="tipo_atividade"
                    name="activityType"
                    type="select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {listCategories.map((categorie) => (
                      <option key={categorie.id} value={categorie.id}>
                        {categorie.descricao}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              {user?.tipo === TipoUsuario.Admin && (
                <>
                  <Col lg="2">
                    <FormGroup>
                      <Label for="tipo_atividade">Situação</Label>
                      <Input
                        type="select"
                        id="filterType"
                        value={situacaoFiltro}
                        onChange={(e) => setSituacaoFiltro(e.target.value)}
                      >
                        <option value="">Todos</option>
                        {listaSituacaoAcao.map((forma) => (
                          <option key={forma.value} value={forma.value}>
                            {forma.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xl="3">
                    <FormGroup>
                      <Label for="id_usuario">Usuário</Label>
                      <Input
                        id="id_usuario"
                        name="id_usuario"
                        type="select"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                      >
                        <option value="">Todos</option>
                        {listUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.nome}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </>
              )}
              <Col lg="2" xl="2">
                <FormGroup>
                  <Label for="filterType">Tipo de Ação</Label>
                  <Input
                    type="select"
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
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" onClick={() => fetchActions()}>
              Filtrar
            </Button>
          </div>
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
            defaultView="week"
            views={['month', 'week', 'day']}
            defaultDate={new Date('2024-10-18')}
            messages={messages}
            eventPropGetter={eventPropGetter}
          />
        </CardBody>

        {user?.tipo === TipoUsuario.Admin && (
          <Row className="mt-4 pl-4">
            <Col>
              <h5>Legenda</h5>
              <ul className="list-unstyled">
                <li className="d-flex align-items-baseline">
                  <Badge style={{ backgroundColor: 'orange' }}>Pendente</Badge>
                  <p className="ml-2">Aguardando Confirmação</p>
                </li>

                <li className="d-flex align-items-baseline">
                  <Badge style={{ backgroundColor: 'green' }}>Aprovada</Badge>
                  <p className="ml-2">Confirmada</p>
                </li>

                <li className="d-flex align-items-baseline">
                  <Badge style={{ backgroundColor: 'red' }}>Rejeitada</Badge>
                  <p className="ml-2">Cancelada</p>
                </li>
              </ul>
            </Col>
          </Row>
        )}
      </Card>
    );
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <Container style={{ padding: paddingContainer }}>{renderCardContainer()}</Container>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        {selectedEvent && (
          <>
            <ModalHeader toggle={toggleModal}>
              <h3>{selectedEvent.titulo_acao}</h3>
            </ModalHeader>

            <ModalBody>
              <p>Nome do organizador: {selectedEvent.nome_organizador}</p>
              <p>Celular organizador: {selectedEvent.celular}</p>
              <p>Data: {moment(selectedEvent.data_acao).format('DD/MM/YYYY')}</p>
              <p>Horário: {moment(selectedEvent.data_acao).format('HH:mm')}</p>
              <p>Forma de Realização: {selectedEvent.forma_realizacao_acao}</p>
              <p>Atividade: {selectedEvent.categoria.descricao}</p>

              {selectedEvent.nome_local_acao && (
                <p>Nome do local: {selectedEvent.nome_local_acao}</p>
              )}

              {selectedEvent.endereco_local_acao && (
                <p>Endereço do local: {selectedEvent.endereco_local_acao}</p>
              )}

              {selectedEvent.link_para_inscricao_acao && (
                <p>Link para inscrição: {selectedEvent.link_para_inscricao_acao}</p>
              )}

              <p>Link para divulgação: {selectedEvent.link_divulgacao_acesso_acao}</p>
              <p>Número de organizador: {selectedEvent.numero_organizadores_acao}</p>
              <p>Descrição: {selectedEvent.descricao_acao}</p>
            </ModalBody>

            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
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
