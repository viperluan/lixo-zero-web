import { Fragment, useEffect, useState } from "react";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
    Table,
} from "reactstrap";
import api from "../../api/index";
import { FaWhatsapp } from "react-icons/fa";
import { SituacaoPatrocinio } from "Enumerados";

const PartnersContainer = () => {

    const [listPartners, setListPartners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = (page) => {
        api.get(`/patrocinio?page=${page}&limit=10`).then((res) => {
            setListPartners(res.data.partnes || []);
            setTotalPages(res.data.totalPages || 1);
        });
    };

    // USE EFECT
    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getStatusBadge = (situacao) => {
        switch (situacao) {
            case SituacaoPatrocinio.AguardandoConfirmacao:
                return <Badge pill color="warning">Pendente</Badge>;
            case SituacaoPatrocinio.Confirmado:
                return <Badge pill color="success">Confirmado</Badge>;
            case SituacaoPatrocinio.Cancelado:
                return <Badge pill color="danger">Cancelado</Badge>;
            default:
                return <Badge pill color="secondary">Desconhecida</Badge>;
        }
    };

    const exportToCSV = () => {
        const headers = [
            'Patrocionador',
            'Situacao',
            'Cota',
            'Descrição',
            'Cadastro',
            'Celular',
            'patrocinador',
            'Email do patrocinador'
        ];
        const rows = listPartners.map(partner => [
            partner.nome,
            getStatusBadge(partner.situacao_acao).props.children,
            partner.cota.descricao,
            partner.descricao,
            new Date(partner.data_cadastro).toLocaleDateString('pt-BR'),
            partner.celular,
            partner.usuario_patrocinio.nome,
            partner.usuario_patrocinio.email,
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "patrocinios.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
        document.body.removeChild(link);
    };


    return (
        <Fragment>
            <Card>
                <CardBody>
                    <Row>
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <div className="d-flex justify-content-between">
                                        <h3 className="mb-0">Lista de Patrocinadores</h3>
                                        <Button color="primary" onClick={exportToCSV} className="mb-4">Exportar para CSV</Button>
                                    </div>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Patrocionador</th>
                                            <th scope="col">Situação</th>
                                            <th scope="col">Cota</th>
                                            <th scope="col">Descrição</th>
                                            <th scope="col">Cadastro</th>
                                            <th scope="col">Celular</th>
                                            <th scope="col">Usuário</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listPartners.map((partner) => (
                                            <tr key={partner.id}>
                                                <th scope="row">{partner.nome}</th>
                                                <td>{getStatusBadge(partner.situacao)}</td>
                                                <td>{partner.cota.descricao}</td>
                                                <td>{partner.descricao}</td>
                                                <td>{new Date(partner.data_cadastro).toLocaleDateString('pt-BR')}</td>
                                                <td>
                                                    {partner.celular}
                                                    <a href={`https://wa.me/${partner.celular}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px' }}>
                                                        <FaWhatsapp size={20} color="#25D366" />
                                                    </a>
                                                </td>
                                                <td>
                                                    {partner.usuario_patrocinio.nome}
                                                    <br />
                                                    <a href={`mailto:${partner.usuario_patrocinio.email}`}>{partner.usuario_patrocinio.email}</a>
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
        </Fragment>
    )

}



export { PartnersContainer }