import api from '~api';
import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { LoadingOverlay } from '~components/Loading';
import { ActionStatusBadge } from '~components/ActionStatusBadge';
import { listarEnumerados, SituacaoAcao } from '~/Enumerados';
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

const MyEventsContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listActions, setlistActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listCategories, setListCategories] = useState([]);
  const [activityType, setActivityType] = useState('');
  const listaSituacaoAcao = listarEnumerados(SituacaoAcao);
  const [situacaoFiltro, setSituacaoFiltro] = useState('');
  const [search, setSearch] = useState('');
  const { id } = useParams();

  const fetchCategories = () => {
    api.get(`/categorias?page=1&limit=150`).then((res) => {
      setListCategories(res.data.categories || []);
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

    if (id) {
      filters.id_usuario = id;
    }

    if (search) {
      filters.search = search.trim();
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
  }, []);

  useEffect(() => {
    fetchActions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Container>
      <LoadingOverlay isLoading={isLoading} />

      <Card>
        <CardHeader className="space-y-5">
          <CardTitle>Minhas Ações</CardTitle>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
              Filtros
            </h3>

            <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>

            <Button onClick={() => fetchActions(currentPage)}>Filtrar</Button>
          </div>
        </CardHeader>

        <Table>
          <Thead>
            <Tr>
              <Th>Título da Ação</Th>
              <Th>Situação</Th>
              <Th>Descrição</Th>
              <Th>Nome do Organizador</Th>
              <Th>Celular</Th>
              <Th>Data da Ação</Th>
              <Th>Local da Ação</Th>
              <Th>Nº de Organizadores</Th>
              <Th>Categoria</Th>
              <Th>Aprovado/Recusado por</Th>
            </Tr>
          </Thead>

          <Tbody>
            {listActions.length === 0 && (
              <TableEmpty colSpan={10}>Você ainda não cadastrou nenhuma ação.</TableEmpty>
            )}

            {listActions.map((action) => (
              <Tr key={action.id}>
                <Tdh>{action.titulo_acao}</Tdh>
                <Td>
                  <ActionStatusBadge situacao={action.situacao_acao} />
                </Td>
                <Td className="max-w-96 truncate" title={action.descricao_acao}>
                  {action.descricao_acao}
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
                <Td>{action.local_acao}</Td>
                <Td>{action.numero_organizadores_acao}</Td>
                <Td>{action.categoria.descricao}</Td>
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
  );
};

export { MyEventsContainer };
