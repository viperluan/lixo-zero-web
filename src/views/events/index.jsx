import api from '~api';
import { Fragment, useEffect, useState } from 'react';
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

  const editRow = (situacao, id) => {
    // Atualizar na API
    setIsLoading(true);
    api
      .put(`/acoes/${id}`, { situacao_acao: situacao, id_usuario_alteracao: user.id })
      .then((res) => {
        // Atualize a lista de ações localmente após a atualização bem-sucedida
        setlistActions((prevActions) =>
          prevActions.map((action) =>
            action.id === id ? { ...action, situacao_acao: situacao } : action
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const exportToCSV = () => {
    const headers = [
      'Título da Ação',
      'Descrição',
      'Nome do Organizador',
      'Data da Ação',
      'Local da Ação',
      'Número de Organizadores',
      'Categoria',
      'Celular',
      'Situação',
      'Responsável',
      'Email do Responsável',
    ];

    const rows = listActions.map((action) => [
      action.titulo_acao,
      action.descricao_acao,
      action.nome_organizador,
      new Date(action.data_acao).toLocaleDateString('pt-BR'),
      action.local_acao,
      action.numero_organizadores_acao,
      action.categoria.descricao,
      action.celular,
      getStatusBadge(action.situacao_acao).props.children,
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
      case SituacaoAcao.AguardandoConfirmacao:
        return (
          <Badge pill color="warning">
            Pendente
          </Badge>
        );
      case SituacaoAcao.Confirmada:
        return (
          <Badge pill color="success">
            Aprovada
          </Badge>
        );
      case SituacaoAcao.Cancelada:
        return (
          <Badge pill color="danger">
            Rejeitada
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

  return (
    <Fragment>
      <LoadingOverlay isLoading={isLoading} />
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
                      <th scope="col">Título da Ação</th>
                      <th scope="col">Situação</th>
                      <th scope="col">Descrição</th>
                      <th scope="col">Nome do Organizador</th>
                      <th scope="col">Celular</th>
                      <th scope="col">Data da Ação</th>
                      <th scope="col">Local da Ação</th>
                      <th scope="col">Número de Organizadores</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Responsável</th>
                      <th scope="col">Usuário Alteração</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listActions.map((action) => (
                      <tr key={action.id}>
                        <td>
                          {action.situacao_acao !== SituacaoAcao.Confirmada && (
                            <FaCheck
                              size={20}
                              color="green"
                              style={{ cursor: 'pointer' }}
                              onClick={() => editRow(SituacaoAcao.Confirmada, action.id)}
                            />
                          )}

                          {action.situacao_acao !== SituacaoAcao.Cancelada && (
                            <FaTrash
                              size={20}
                              color="orange"
                              style={{ cursor: 'pointer', marginLeft: '10px' }}
                              onClick={() => editRow(SituacaoAcao.Cancelada, action.id)}
                            />
                          )}
                        </td>
                        <th scope="row">{action.titulo_acao}</th>
                        <td>{getStatusBadge(action.situacao_acao)}</td>
                        <td>{action.descricao_acao}</td>
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
                        <td>{action.local_acao}</td>
                        <td>{action.numero_organizadores_acao}</td>
                        <td>{action.categoria.descricao}</td>
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
    </Fragment>
  );
};

export { EventsContainer };
