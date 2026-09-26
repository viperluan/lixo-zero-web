import api, { mensagemErroApi } from '~api';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { FaCheck, FaWhatsapp } from 'react-icons/fa';
import { LoadingOverlay } from '~components/Loading';
import { ActionFormatBadge } from '~components/ActionFormatBadge';
import { ActionStatusBadge } from '~components/ActionStatusBadge';
import { useAuth } from '~context/AuthContext';
import { listarEnumerados, SituacaoAcao, FormaRealizacaoAcao } from '~/Enumerados';
import { listarEdicoes } from '~/lib/edicoes';
import { obterLocalAcao } from '~/lib/acoes';
import {
  Badge,
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

const SITUACOES_FILTRO = [
  { value: SituacaoAcao.AguardandoConfirmacao, label: 'Pendente' },
  { value: SituacaoAcao.Confirmada, label: 'Aprovada' },
  { value: SituacaoAcao.Cancelada, label: 'Reprovada' },
];

const COLUNAS_TABELA = 8;

const classeAcoesCabecalho =
  'sticky left-0 z-10 w-[8.5rem] min-w-[8.5rem] max-w-[8.5rem] border-r border-gray-100 bg-brand-cream';
const classeTituloCabecalho = 'sticky left-[8.5rem] z-10 border-r border-gray-100 bg-brand-cream';
const classeAcoesCelula =
  'sticky left-0 z-10 w-[8.5rem] min-w-[8.5rem] max-w-[8.5rem] border-r border-gray-100 bg-white group-hover:bg-brand-cream';
const classeTituloCelula =
  'sticky left-[8.5rem] z-10 border-r border-gray-100 bg-white group-hover:bg-brand-cream';

const formatarDataAcao = (data) =>
  new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const ehLinkHttp = (valor) => typeof valor === 'string' && valor.startsWith('http');

const TextoOuLink = ({ valor }) => {
  if (!valor) return null;

  if (ehLinkHttp(valor)) {
    return (
      <a
        href={valor}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-brand-forest hover:underline"
      >
        {valor}
      </a>
    );
  }

  return <span className="break-words">{valor}</span>;
};

const LinhaDetalhe = ({ rotulo, children }) => {
  if (children == null || children === '' || children === false) return null;

  return (
    <div>
      <dt className="label-condensed text-xs text-brand-forest">{rotulo}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-brand-dark">{children}</dd>
    </div>
  );
};

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
  const [situacaoFiltro, setSituacaoFiltro] = useState('');
  const [search, setSearch] = useState('');
  const [searchAplicada, setSearchAplicada] = useState('');
  const [filterType, setFilterType] = useState('');
  const [edicoes, setEdicoes] = useState([]);
  const [edicaoFiltro, setEdicaoFiltro] = useState('');
  const [pendentesAnoAnterior, setPendentesAnoAnterior] = useState(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [acaoDetalhe, setAcaoDetalhe] = useState(null);

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

  useEffect(() => {
    fetchCategories();
    fetchUsers();

    listarEdicoes().then(({ data, status }) => {
      if (status !== 200) return;

      const lista = data.editions || [];
      setEdicoes(lista);

      const vigente = lista.find((item) => item.vigente);
      const anterior = lista.find((item) => !item.vigente && vigente && item.ano < vigente.ano);

      if (!anterior) return;

      api
        .get(`/acoes?ano=${anterior.ano}&situacao=0&page=1&limit=1`, { silenciarErro: true })
        .then((res) => {
          if ((res.data.actions || []).length > 0) {
            setPendentesAnoAnterior({ ano: anterior.ano, id: anterior.id });
          }
        });
    });
  }, []);

  useEffect(() => {
    let cancelado = false;
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

    if (searchAplicada) {
      filters.search = searchAplicada;
    }

    if (filterType) {
      filters.forma_realizacao_acao = filterType;
    }

    if (edicaoFiltro === 'todos') {
      filters.ano = 'todos';
    } else if (edicaoFiltro) {
      filters.id_edicao = edicaoFiltro;
    }

    const queryString = new URLSearchParams(filters).toString();

    setIsLoading(true);

    api
      .get(`/acoes?page=${currentPage}&limit=10&${queryString}`)
      .then((res) => {
        if (cancelado) return;

        if (res.status !== 200) {
          const erro = mensagemErroApi(res.data);
          if (erro) toast.error(erro);
          setlistActions([]);
          setTotalPages(1);
          return;
        }

        setlistActions(res.data.actions || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .finally(() => {
        if (!cancelado) setIsLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [
    currentPage,
    activityType,
    situacaoFiltro,
    userFilter,
    filterType,
    edicaoFiltro,
    searchAplicada,
  ]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const aplicarSelect = (definir) => (evento) => {
    definir(evento.target.value);
    setCurrentPage(1);
  };

  const aplicarPesquisa = () => {
    setSearchAplicada(search.trim());
    setCurrentPage(1);
  };

  const limparFiltros = () => {
    setActivityType('');
    setSituacaoFiltro('');
    setUserFilter('');
    setFilterType('');
    setSearch('');
    setSearchAplicada('');
    setCurrentPage(1);
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

  const fecharDetalhe = () => setAcaoDetalhe(null);

  const filtrosPreenchidos = Boolean(
    activityType || situacaoFiltro || userFilter || filterType || search || searchAplicada
  );
  const filtrosAtivos = [
    activityType,
    situacaoFiltro,
    userFilter,
    filterType,
    searchAplicada,
  ].filter(Boolean).length;

  const rotuloEdicao = () => {
    if (edicaoFiltro === 'todos') return 'Todas as edições';

    const edicao = edicoes.find((item) => String(item.id) === String(edicaoFiltro));
    return edicao ? `Edição ${edicao.ano}` : 'Edição';
  };

  const chips = [
    searchAplicada && {
      id: 'search',
      rotulo: `Pesquisa: ${searchAplicada}`,
      limpar: () => {
        setSearch('');
        setSearchAplicada('');
        setCurrentPage(1);
      },
    },
    activityType && {
      id: 'categoria',
      rotulo:
        listCategories.find((item) => String(item.id) === String(activityType))?.descricao ||
        'Categoria',
      limpar: () => {
        setActivityType('');
        setCurrentPage(1);
      },
    },
    situacaoFiltro && {
      id: 'situacao',
      rotulo: SITUACOES_FILTRO.find((item) => item.value === situacaoFiltro)?.label || 'Situação',
      limpar: () => {
        setSituacaoFiltro('');
        setCurrentPage(1);
      },
    },
    userFilter && {
      id: 'usuario',
      rotulo: listUsers.find((item) => String(item.id) === String(userFilter))?.nome || 'Usuário',
      limpar: () => {
        setUserFilter('');
        setCurrentPage(1);
      },
    },
    filterType && {
      id: 'forma',
      rotulo:
        listaFormaAcao.find((item) => item.value === filterType)?.label || 'Forma de realização',
      limpar: () => {
        setFilterType('');
        setCurrentPage(1);
      },
    },
    edicaoFiltro && {
      id: 'edicao',
      rotulo: rotuloEdicao(),
      limpar: () => {
        setEdicaoFiltro('');
        setCurrentPage(1);
      },
    },
  ].filter(Boolean);

  const localDetalhe = acaoDetalhe ? obterLocalAcao(acaoDetalhe) : '';

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <Modal isOpen={isModalOpen} size="sm">
        <ModalHeader>{modalInfo.header}</ModalHeader>

        <ModalBody className="text-center">
          <p className="text-brand-dark">{modalInfo.body}</p>
          <p className="mt-2 text-sm text-gray-500">Será enviado um email informando o usuário!</p>
        </ModalBody>

        <ModalFooter className="justify-center">
          <Button
            variant={modalInfo.situation === SituacaoAcao.Confirmada ? 'success' : 'danger'}
            onClick={handleChangeActionStatus}
          >
            Sim
          </Button>

          <Button variant="neutral" onClick={toggleModal}>
            Não
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={acaoDetalhe != null} toggle={fecharDetalhe} size="lg">
        {acaoDetalhe && (
          <>
            <ModalHeader toggle={fecharDetalhe}>{acaoDetalhe.titulo_acao}</ModalHeader>

            <ModalBody>
              <dl className="space-y-4">
                <LinhaDetalhe rotulo="Descrição">{acaoDetalhe.descricao_acao}</LinhaDetalhe>
                <LinhaDetalhe rotulo="Informações">{acaoDetalhe.informacoes_acao}</LinhaDetalhe>
                <LinhaDetalhe rotulo="Orientação de divulgação">
                  {acaoDetalhe.orientacao_divulgacao_acao}
                </LinhaDetalhe>
                <LinhaDetalhe rotulo="Local">{localDetalhe}</LinhaDetalhe>
                <LinhaDetalhe rotulo="Endereço">{acaoDetalhe.endereco_local_acao}</LinhaDetalhe>
                {acaoDetalhe.link_divulgacao_acesso_acao && (
                  <LinhaDetalhe rotulo="Link de divulgação">
                    <TextoOuLink valor={acaoDetalhe.link_divulgacao_acesso_acao} />
                  </LinhaDetalhe>
                )}
                {acaoDetalhe.link_para_inscricao_acao && (
                  <LinhaDetalhe rotulo="Link para inscrição">
                    <TextoOuLink valor={acaoDetalhe.link_para_inscricao_acao} />
                  </LinhaDetalhe>
                )}
                <LinhaDetalhe rotulo="Público">{acaoDetalhe.tipo_publico_acao}</LinhaDetalhe>
                <LinhaDetalhe rotulo="Número de organizadores">
                  {acaoDetalhe.numero_organizadores_acao}
                </LinhaDetalhe>
                <LinhaDetalhe rotulo="Usuário de alteração">
                  {acaoDetalhe.usuario_alteracao?.nome}
                </LinhaDetalhe>
              </dl>
            </ModalBody>

            <ModalFooter>
              <Button variant="neutral" onClick={fecharDetalhe}>
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      <Container>
        <Card>
          <CardHeader className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Lista de Ações</CardTitle>

              <Select
                id="edicao-fila"
                aria-label="Edição"
                value={edicaoFiltro}
                onChange={aplicarSelect(setEdicaoFiltro)}
                className="w-full sm:w-auto sm:min-w-44"
              >
                <option value="">Edição vigente</option>
                {edicoes.map((item) => (
                  <option key={item.id} value={item.id}>
                    Edição {item.ano}
                    {item.vigente ? ' · vigente' : ''}
                  </option>
                ))}
                <option value="todos">Todas</option>
              </Select>
            </div>

            {pendentesAnoAnterior && !edicaoFiltro && (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-warning/40 bg-brand-warning/15 px-4 py-3 text-sm text-brand-dark">
                <Badge variant="warning">Pendentes de {pendentesAnoAnterior.ano}</Badge>
                <span>Há ações aguardando moderação em {pendentesAnoAnterior.ano}.</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEdicaoFiltro(pendentesAnoAnterior.id);
                    setSituacaoFiltro(SituacaoAcao.AguardandoConfirmacao);
                    setCurrentPage(1);
                  }}
                >
                  Ver fila de {pendentesAnoAnterior.ano}
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="label-condensed text-sm text-brand-forest">Filtros</h3>

                <Button
                  size="sm"
                  variant="outline"
                  className="lg:hidden"
                  aria-expanded={filtrosAbertos}
                  aria-controls="filtros-acoes"
                  onClick={() => setFiltrosAbertos((aberto) => !aberto)}
                >
                  {filtrosAbertos ? 'Ocultar' : 'Filtros'}
                  {filtrosAtivos > 0 ? ` (${filtrosAtivos})` : ''}
                </Button>
              </div>

              <div id="filtros-acoes" className={filtrosAbertos ? 'lg:block' : 'hidden lg:block'}>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <FormGroup className="!mb-0 w-full sm:flex-1">
                      <Label htmlFor="pesquisa">Pesquisa</Label>
                      <Input
                        id="pesquisa"
                        name="pesquisa"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            aplicarPesquisa();
                          }
                        }}
                      />
                    </FormGroup>

                    <Button
                      onClick={aplicarPesquisa}
                      className="w-full border border-transparent !rounded-lg sm:w-auto"
                    >
                      Buscar
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <FormGroup className="mb-0">
                      <Label htmlFor="tipo_atividade">Categoria</Label>
                      <Select
                        id="tipo_atividade"
                        name="activityType"
                        value={activityType}
                        onChange={aplicarSelect(setActivityType)}
                      >
                        <option value="">Todos</option>
                        {listCategories.map((categorie) => (
                          <option key={categorie.id} value={categorie.id}>
                            {categorie.descricao}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup className="mb-0">
                      <Label htmlFor="situacao">Situação</Label>
                      <Select
                        id="situacao"
                        value={situacaoFiltro}
                        onChange={aplicarSelect(setSituacaoFiltro)}
                      >
                        <option value="">Todos</option>
                        {SITUACOES_FILTRO.map((forma) => (
                          <option key={forma.value} value={forma.value}>
                            {forma.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup className="mb-0">
                      <Label htmlFor="id_usuario">Usuário</Label>
                      <Select
                        id="id_usuario"
                        name="id_usuario"
                        value={userFilter}
                        onChange={aplicarSelect(setUserFilter)}
                      >
                        <option value="">Todos</option>
                        {listUsers.map((usuario) => (
                          <option key={usuario.id} value={usuario.id}>
                            {usuario.nome}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup className="mb-0">
                      <Label htmlFor="filterType">Forma de realização</Label>
                      <Select
                        id="filterType"
                        value={filterType}
                        onChange={aplicarSelect(setFilterType)}
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
                </div>
              </div>

              {chips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <Badge
                      key={chip.id}
                      variant="neutral"
                      className="gap-1 normal-case tracking-normal"
                    >
                      {chip.rotulo}
                      <button
                        type="button"
                        aria-label={`Remover filtro ${chip.rotulo}`}
                        onClick={chip.limpar}
                        className="rounded-full p-0.5 hover:bg-black/10"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  variant="neutral"
                  onClick={limparFiltros}
                  disabled={!filtrosPreenchidos}
                  className="w-full sm:w-auto"
                >
                  Limpar filtros
                </Button>

                <Button variant="outline" onClick={exportToCSV} className="w-full sm:w-auto">
                  Exportar página
                </Button>
              </div>
            </div>
          </CardHeader>

          <Table>
            <Thead>
              <Tr>
                <Th className={classeAcoesCabecalho}>Ações</Th>
                <Th className={classeTituloCabecalho}>Título</Th>
                <Th>Situação</Th>
                <Th>Data e hora</Th>
                <Th>Categoria</Th>
                <Th>Forma</Th>
                <Th>Organizador</Th>
                <Th>Responsável</Th>
              </Tr>
            </Thead>

            <Tbody>
              {listActions.length === 0 && <TableEmpty colSpan={COLUNAS_TABELA} />}

              {listActions.map((action) => (
                <Tr key={action.id} className="group">
                  <Td className={classeAcoesCelula}>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="icon"
                        aria-label="Aprovar ação"
                        title="Aprovar ação"
                        disabled={action.situacao_acao === 'Aprovada'}
                        onClick={() => handleActionSituation(SituacaoAcao.Confirmada, action)}
                        className="min-h-11 min-w-11"
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
                        className="min-h-11 min-w-11"
                      >
                        <X
                          size={18}
                          aria-hidden="true"
                          className={
                            action.situacao_acao === 'Reprovada'
                              ? 'text-gray-400'
                              : 'text-brand-warning'
                          }
                        />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-auto min-h-11 w-full whitespace-normal px-1 py-1 text-xs"
                      onClick={() => setAcaoDetalhe(action)}
                    >
                      Ver detalhes
                    </Button>
                  </Td>
                  <Tdh className={classeTituloCelula}>
                    <div className="w-[9rem] truncate sm:w-48" title={action.titulo_acao}>
                      {action.titulo_acao}
                    </div>
                  </Tdh>
                  <Td>
                    <ActionStatusBadge situacao={action.situacao_acao} />
                  </Td>
                  <Td className="whitespace-nowrap">{formatarDataAcao(action.data_acao)}</Td>
                  <Td>{action.categoria.descricao}</Td>
                  <Td>
                    <ActionFormatBadge forma={action.forma_realizacao_acao} />
                  </Td>
                  <Td>
                    <div className="flex max-w-[14rem] flex-col gap-1">
                      <span className="truncate" title={action.nome_organizador}>
                        {action.nome_organizador}
                      </span>
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
                    </div>
                  </Td>
                  <Td>
                    <div className="max-w-[14rem]">
                      <span className="block truncate" title={action.usuario_responsavel.nome}>
                        {action.usuario_responsavel.nome}
                      </span>
                      <a
                        href={`mailto:${action.usuario_responsavel.email}`}
                        className="block truncate text-brand-forest hover:underline"
                        title={action.usuario_responsavel.email}
                      >
                        {action.usuario_responsavel.email}
                      </a>
                    </div>
                  </Td>
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
