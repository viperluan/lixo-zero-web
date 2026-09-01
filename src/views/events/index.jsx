import api from '~api';
import { useEffect, useState } from 'react';
import { FaCheck, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { LoadingOverlay } from '~components/Loading';
import { ActionStatusBadge } from '~components/ActionStatusBadge';
import { useAuth } from '~context/AuthContext';
import { listarEnumerados, SituacaoAcao, FormaRealizacaoAcao } from '~/Enumerados';
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  Table,
  TableEmpty,
  Tbody,
  Td,
  Tdh,
  Th,
  Thead,
  Tr,
} from '~components/ui';

const EventsContainer = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [listActions, setlistActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listCategories, setListCategories] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [userFilter, setUserFilter] = useState('');
  const [activityType, setActivityType] = useState('');
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

      <Modal isOpen={isModalOpen} size="sm">
        <ModalHeader>{modalInfo['header']}</ModalHeader>

        <ModalBody className="text-center">
          <p className="text-brand-dark">{modalInfo['body']}</p>
          <p className="mt-2 text-sm text-gray-500">Será enviado um email informando o usuário!</p>
        </ModalBody>

        <ModalFooter className="justify-center">
          <Button variant="danger" onClick={handleChangeActionStatus}>
            Sim
          </Button>

          <Button variant="neutral" onClick={toggleModal}>
            Não
          </Button>
        </ModalFooter>
      </Modal>

      <Container>
        <Card>
          <CardHeader className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>Lista de Ações</CardTitle>

              <Button onClick={exportToCSV}>Exportar para CSV</Button>
            </div>

            <div>
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
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {listCategories.map((categorie) => (
                      <option key={categorie.id} value={categorie.id}>
                        {categorie.descricao}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

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

              <Button onClick={() => fetchActions(currentPage)}>Filtrar</Button>
            </div>
          </CardHeader>

          <Table>
            <Thead>
              <Tr>
                <Th>Ações</Th>
                <Th>Título da ação</Th>
                <Th>Situação da ação</Th>
                <Th>Nome do organizador</Th>
                <Th>WhatsApp do responsável</Th>
                <Th>Descrição ação</Th>
                <Th>Tipo da atividade</Th>
                <Th>Data da ação</Th>
                <Th>Forma de realização</Th>
                <Th>Link de divulgação</Th>
                <Th>Nome do local</Th>
                <Th>Endereço do local</Th>
                <Th>Informações ação</Th>
                <Th>Link para inscrição</Th>
                <Th>Público</Th>
                <Th>Descrição divulgação</Th>
                <Th>Usuário responsável</Th>
                <Th>Usuário alteração</Th>
              </Tr>
            </Thead>

            <Tbody>
              {listActions.length === 0 && <TableEmpty colSpan={18} />}

              {listActions.map((action) => (
                <Tr key={action.id}>
                  <Td>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="icon"
                        aria-label="Aprovar ação"
                        title="Aprovar ação"
                        disabled={action.situacao_acao === 'Aprovada'}
                        onClick={() => handleActionSituation(SituacaoAcao.Confirmada, action)}
                      >
                        <FaCheck
                          size={18}
                          className={
                            action.situacao_acao === 'Aprovada'
                              ? 'text-gray-400'
                              : 'text-brand-accent'
                          }
                        />
                      </Button>

                      <Button
                        variant="icon"
                        aria-label="Reprovar ação"
                        title="Reprovar ação"
                        disabled={action.situacao_acao === 'Reprovada'}
                        onClick={() => handleActionSituation(SituacaoAcao.Cancelada, action)}
                      >
                        <FaTrash
                          size={18}
                          className={
                            action.situacao_acao === 'Reprovada'
                              ? 'text-gray-400'
                              : 'text-brand-warning'
                          }
                        />
                      </Button>
                    </div>
                  </Td>
                  <Tdh>{action.titulo_acao}</Tdh>
                  <Td>
                    <ActionStatusBadge situacao={action.situacao_acao} />
                  </Td>
                  <Td>{action.nome_organizador}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      {action.celular}
                      <a
                        href={`https://wa.me/${action.celular}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Abrir conversa no WhatsApp"
                      >
                        <FaWhatsapp size={18} className="text-[#25D366]" />
                      </a>
                    </span>
                  </Td>
                  <Td className="max-w-96 truncate" title={action.descricao_acao}>
                    {action.descricao_acao}
                  </Td>
                  <Td>{action.categoria.descricao}</Td>
                  <Td>
                    {new Date(action.data_acao).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </Td>
                  <Td>{action.forma_realizacao_acao}</Td>
                  <Td>{action.link_divulgacao_acesso_acao}</Td>
                  <Td>{action.nome_local_acao}</Td>
                  <Td>{action.endereco_local_acao}</Td>
                  <Td className="max-w-96 truncate" title={action.informacoes_acao}>
                    {action.informacoes_acao}
                  </Td>
                  <Td>{action.link_para_inscricao_acao}</Td>
                  <Td>{action.tipo_publico_acao}</Td>
                  <Td className="max-w-96 truncate" title={action.orientacao_divulgacao_acao}>
                    {action.orientacao_divulgacao_acao}
                  </Td>
                  <Td>
                    {action.usuario_responsavel.nome}
                    <br />
                    <a
                      href={`mailto:${action.usuario_responsavel.email}`}
                      className="text-brand-primary-dark hover:underline"
                    >
                      {action.usuario_responsavel.email}
                    </a>
                  </Td>
                  <Td>{action?.usuario_alteracao?.nome}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <CardFooter>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardFooter>
        </Card>
      </Container>
    </>
  );
};

export { EventsContainer };
