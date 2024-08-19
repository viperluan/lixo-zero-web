import api from "api"
import { Fragment, useEffect, useState } from "react"
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
} from "reactstrap";
import { FaWhatsapp } from 'react-icons/fa';
import { LoadingOverlay } from "components/Loading";
import { listarEnumerados, SituacaoAcao } from "Enumerados";
import { useParams } from "react-router-dom";

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
    const { id } = useParams()


    const fetchCategories = () => {
        api.get(`/categorias?page=1&limit=150`).then((res) => {
            setListCategories(res.data.categories || []);

        })
    };

    const fetchActions = (page) => {
        const filters = {}

        if (activityType) {
            filters.id_categoria = activityType
        }

        if (situacaoFiltro) {
            filters.situacao = situacaoFiltro
        }

        if (parseInt(id)) {
            filters.id_usuario = parseInt(id)
        }

        if (search) {
            filters.search = search.trim()
        }

        const queryString = new URLSearchParams(filters).toString();

        setIsLoading(true);

        api.get(`/acoes?page=${page}&limit=10&${queryString}`).then((res) => {
            setlistActions(res.data.actions || []);
            setTotalPages(res.data.totalPages || 1);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        fetchActions(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    }


    const getStatusBadge = (situacao) => {
        switch (situacao) {
            case SituacaoAcao.AguardandoConfirmacao:
                return <Badge pill color="warning">Pendente</Badge>;
            case SituacaoAcao.Confirmada:
                return <Badge pill color="success">Aprovada</Badge>;
            case SituacaoAcao.Cancelada:
                return <Badge pill color="danger">Rejeitada</Badge>;
            default:
                return <Badge pill color="secondary">Desconhecida</Badge>;
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
                                        <h3 className="mb-0">Minhas de Ações</h3>
                                    </div>
                                    <hr className="m-0" />
                                    <div className="">
                                        <h3 className="mb-0">Filtros</h3>
                                        <Row>
                                            <Col xl="3">
                                                <FormGroup>
                                                    <Label for="pesquisa">Pesquisa</Label>
                                                    <Input
                                                        id="pesquisa"
                                                        name="pesquisa"
                                                        type="text"
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    >

                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col xl="3">
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
                                            <Col xl="3">
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
                                        </Row>
                                        <Button color="primary" onClick={() => fetchActions(currentPage)} > Filtrar</Button>
                                    </div>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Título da Ação</th>
                                            <th scope="col">Situação</th>
                                            <th scope="col">Descrição</th>
                                            <th scope="col">Nome do Organizador</th>
                                            <th scope="col">Celular</th>
                                            <th scope="col">Data da Ação</th>
                                            <th scope="col">Local da Ação</th>
                                            <th scope="col">Número de Organizadores</th>
                                            <th scope="col">Categoria</th>
                                            <th scope="col">Aprovado/Recusado por</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listActions.map((action) => (
                                            <tr key={action.id}>
                                                <th scope="row">{action.titulo_acao}</th>
                                                <td>{getStatusBadge(action.situacao_acao)}</td>
                                                <td>{action.descricao_acao}</td>
                                                <td>{action.nome_organizador}</td>
                                                <td>
                                                    {action.celular}
                                                    <a href={`https://wa.me/${action.celular}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>
                                                        <FaWhatsapp size={20} color="#25D366" />
                                                    </a>
                                                </td>
                                                <td>{new Date(action.data_acao).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                })}</td>
                                                <td>{action.local_acao}</td>
                                                <td>{action.numero_organizadores_acao}</td>
                                                <td>{action.categoria.descricao}</td>
                                                <td>
                                                    {action?.usuario_alteracao?.nome}

                                                </td>
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
        </Fragment >
    )
}

export { MyEventsContainer }
