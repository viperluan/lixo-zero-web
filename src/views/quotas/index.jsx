import api from "~api"
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
    Button,
} from "reactstrap";
import { QuotasRegister } from "./register";
import { LoadingOverlay } from "~components/Loading";

const QuotasContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [listQuotas, setListQuotas] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchQuotas = (page) => {
        setIsLoading(true)
        api.get(`/cota?page=${page}&limit=10`).then((res) => {
            setListQuotas(res.data.quotas || []);
            setTotalPages(res.data.totalPages || 1);
        }).finally(() => setIsLoading(false));

    }

    useEffect(() => {
        fetchQuotas(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    const [openModal, setOpenModal] = useState(false)

    const toogleModal = () => {
        setOpenModal(!openModal)
    }

    return (
        <Fragment>
            <LoadingOverlay isLoading={isLoading} />
            <QuotasRegister isOpen={openModal} toogleModal={toogleModal} callBack={() => { fetchQuotas(1) }} />
            <Card>
                <CardBody>
                    <Row>
                        <div className="col">
                            <Card className="shadow">
                                <CardHeader className="border-0 d-flex justify-content-between">
                                    <h3 className="mb-0">Lista de Cotas</h3>
                                    <Button onClick={() => setOpenModal(!openModal)} color="primary">Nova Cota</Button>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listQuotas.map((category) => (
                                            <tr key={category.id}>
                                                <th scope="row">
                                                    {category.descricao}
                                                </th>
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



export { QuotasContainer }
