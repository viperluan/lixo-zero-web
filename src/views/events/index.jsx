import api from '~api';
import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Row,
  CardBody,
  Badge,
  Button,
  Input,
  Label,
  FormGroup,
  Col,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { FaCheck, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { LoadingOverlay } from '~components/Loading';
import { useAuth } from '~context/AuthContext';
import { listarEnumerados, SituacaoAcao } from '~/Enumerados';
import { FormaRealizacaoAcao } from '~/Enumerados';

const EventsContainer = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [listActions, setlistActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listCategories, setListCategories] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [userFilter, setUserFilter] = useState(null);
  const [activityType, setActivityType] = useState(null);
  const listaSituacaoAcao = listarEnumerados(SituacaoAcao);
  const [situacaoFiltro, setSituacaoFiltro] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    header: 'Mudança de status',
    body: 'Você confirma a mudança de status?',
    action: '',
    situation: '',
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const listaFormaAcao = listarEnumerados(FormaRealizacaoAcao);

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

  const fetchActions = (page) => {
    const filters = {};

    if (activityType) {
      filters.id_categoria = activityType;
    }

    if (situacaoFiltro) {
      filters.situacao = situacaoFiltro;
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

    setIsLoading(true);

    api
      .get(`/acoes?page=${page}&limit=10&${queryString}`)
      .then((res) => {
        setlistActions(res.data.actions || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchActions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleChangeActionStatus = async () => {
    setIsLoading(true);

    const { status, data } = await api.put(`/acoes/${modalInfo.action}`, {
      situacao_acao: modalInfo.situation,
      id_usuario_alteracao: user.id,
    });

    if (status === 200) {
      setlistActions((prevActions) =>
        prevActions.map((action) =>
          action.id === modalInfo.action ? { ...action, situacao_acao: data.situacao_acao } : action
        )
      );
    }

    toggleModal();
    setIsLoading(false);
  };

  const exportToCSV = () => {
    const headers = [
      'Título da ação',
      'Situação',
      'Nome do Organizador',
      'Celular',
      'Descrição da atividade',
      'Tipo da atividade',
      'Data da ação',
      'Forma de realização',
      'Link de divulgação',
      'Nome do local',
      'Endereço do local',
      'Informações',
      'Link para inscrição',
      'Tipo de público',
      'Descrição sobre divulgação',
      'Número de participantes',
      'Nome usuário responsável',
      'Email usuário responsável',
    ];

    const rows = listActions.map((action) => [
      action.titulo_acao,
      action.situacao_acao,
      action.nome_organizador,
      action.celular,
      `"${action.descricao_acao}"`,
      action.categoria.descricao,
      new Date(action.data_acao).toLocaleDateString('pt-BR'),
      action.forma_realizacao_acao,
      action.link_divulgacao_acesso_acao,
      action.nome_local_acao,
      action.endereco_local_acao,
      `"${action.informacoes_acao}"`,
      action.link_para_inscricao_acao,
      action.tipo_publico_acao,
      `"${action.orientacao_divulgacao_acao}"`,
      action.numero_organizadores_acao,
      action.usuario_responsavel.nome,
      action.usuario_responsavel.email,
    ]);

    let csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      rows.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'acoes.csv');
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (situacao) => {
    switch (situacao) {
      case 'Pendente':
        return (
          <Badge pill color="warning">
            Pendente
          </Badge>
        );
      case 'Aprovada':
        return (
          <Badge pill color="success">
            Aprovada
          </Badge>
        );
      case 'Reprovada':
        return (
          <Badge pill color="danger">
            Reprovada
          </Badge>
        );
      default:
        return (
          <Badge pill color="secondary">
            Desconhecida
          </Badge>
        );
    }
  };

  const handleActionSituation = (situation, action) => {
    const confirmacao = situation === SituacaoAcao.Confirmada;
    const reprovacao = situation === SituacaoAcao.Cancelada;

    if (confirmacao) {
      setModalInfo((prevState) => ({
        ...prevState,
        body: `Você confirma a aprovação da ação ${action.titulo_acao}?`,
        action: action.id,
        situation,
      }));
    }

    if (reprovacao) {
      setModalInfo((prevState) => ({
        ...prevState,
        body: `Você confirma a reprovação da ação ${action.titulo_acao}?`,
        action: action.id,
        situation,
      }));
    }

    toggleModal();
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <Modal isOpen={isModalOpen} className="modal-box">
        <ModalHeader className="text-uppercase">{modalInfo['header']}</ModalHeader>

        <ModalBody className="d-flex flex-column text-center">
          {modalInfo['body']}
          <p>Será enviado um email informando o usuário!</p>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleChangeActionStatus} color="danger">
            Sim
          </Button>

          <Button onClick={toggleModal} color="secondary">
            Não
          </Button>
        </ModalFooter>
      </Modal>

      <Container>
        <Card>
          <CardBody>
            <Row>
              <div className="col">
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <div className="d-flex justify-content-between">
                      <h3 className="mb-0">Lista de Ações</h3>
                      <Button color="primary" onClick={exportToCSV} className="mb-4">
                        Exportar para CSV
                      </Button>
                    </div>
                    <hr className="m-0" />
                    <div className="">
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
                              value={activityType}
                              onChange={(e) => setActivityType(e.target.value)}
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
                      <Button color="primary" onClick={() => fetchActions(currentPage)}>
                        {' '}
                        Filtrar
                      </Button>
                    </div>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">Título da ação</th>
                        <th scope="col">Situação da ação</th>
                        <th scope="col">Nome do organizador</th>
                        <th scope="col">WhatsApp do responsável</th>
                        <th scope="col">Descrição ação</th>
                        <th scope="col">Tipo da atividade</th>
                        <th scope="col">Data da ação</th>
                        <th scope="col">Forma de realização</th>
                        <th scope="col">Link de divulgação</th>
                        <th scope="col">Nome do local</th>
                        <th scope="col">Endereço do local</th>
                        <th scope="col">Informações ação</th>
                        <th scope="col">Link para inscrição</th>
                        <th scope="col">Público</th>
                        <th scope="col">Descrição divulgação</th>
                        <th scope="col">Usuário responsável</th>
                        <th scope="col">Usuário alteração</th>
                      </tr>
                    </thead>

                    <tbody>
                      {listActions.map((action) => (
                        <tr key={action.id}>
                          <td>
                            <Button
                              disabled={action.situacao_acao === 'Aprovada'}
                              color="transparent"
                              style={{
                                cursor: action.situacao_acao !== 'Aprovada' ? 'pointer' : 'default',
                              }}
                              onClick={() => handleActionSituation(SituacaoAcao.Confirmada, action)}
                            >
                              <FaCheck
                                size={20}
                                color={action.situacao_acao === 'Aprovada' ? 'grey' : 'green'}
                              />
                            </Button>

                            <Button
                              disabled={action.situacao_acao === 'Reprovada'}
                              color="transparent"
                              style={{ cursor: 'pointer', marginLeft: '10px' }}
                              onClick={() => handleActionSituation(SituacaoAcao.Cancelada, action)}
                            >
                              <FaTrash
                                size={20}
                                color={action.situacao_acao === 'Reprovada' ? 'grey' : 'orange'}
                              />
                            </Button>
                          </td>
                          <th scope="row">{action.titulo_acao}</th>
                          <td>{getStatusBadge(action.situacao_acao)}</td>
                          <td>{action.nome_organizador}</td>
                          <td>
                            {action.celular}
                            <a
                              href={`https://wa.me/${action.celular}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginLeft: '10px' }}
                            >
                              <FaWhatsapp size={20} color="#25D366" />
                            </a>
                          </td>
                          <td
                            title={action.descricao_acao}
                            style={{
                              maxWidth: '400px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {action.descricao_acao}
                          </td>
                          <td>{action.categoria.descricao}</td>
                          <td>
                            {new Date(action.data_acao).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}
                          </td>
                          <td>{action.forma_realizacao_acao}</td>
                          <td>{action.link_divulgacao_acesso_acao}</td>
                          <td>{action.nome_local_acao}</td>
                          <td>{action.endereco_local_acao}</td>
                          <td
                            title={action.informacoes_acao}
                            style={{
                              maxWidth: '400px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {action.informacoes_acao}
                          </td>
                          <td>{action.link_para_inscricao_acao}</td>
                          <td>{action.tipo_publico_acao}</td>
                          <td
                            title={action.orientacao_divulgacao_acao}
                            style={{
                              maxWidth: '400px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {action.orientacao_divulgacao_acao}
                          </td>
                          <td>
                            {action.usuario_responsavel.nome}
                            <br />
                            <a href={`mailto:${action.usuario_responsavel.email}`}>
                              {action.usuario_responsavel.email}
                            </a>
                          </td>
                          <td>{action?.usuario_alteracao?.nome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <CardFooter className="py-4 d-flex justify-content-center">
                    <nav aria-label="...">
                      <Pagination
                        className="pagination justify-content-end mb-0"
                        listClassName="justify-content-end mb-0"
                      >
                        <PaginationItem disabled={currentPage <= 1}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage - 1);
                            }}
                            tabIndex="-1"
                          >
                            <i className="fas fa-angle-left" />
                            <span className="sr-only">Anterior</span>
                          </PaginationLink>
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                          <PaginationItem key={index} active={index + 1 === currentPage}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(index + 1);
                              }}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem disabled={currentPage >= totalPages}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage + 1);
                            }}
                          >
                            <i className="fas fa-angle-right" />
                            <span className="sr-only">Próximo</span>
                          </PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </nav>
                  </CardFooter>
                </Card>
              </div>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export { EventsContainer };
