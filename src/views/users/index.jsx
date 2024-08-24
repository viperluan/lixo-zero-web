import { Fragment, useEffect, useState } from "react";
import {
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
import { LoadingOverlay } from "components/Loading";

const UsersContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = (page) => {
    setIsLoading(true)
    api.get(`/usuarios?page=${page}&limit=10`).then((res) => {
      setListUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    }).finally(() => setIsLoading(false));
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

  return (
    <Fragment>
      <LoadingOverlay isLoading={isLoading} />
      <Card>
        <CardBody>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0 d-flex justify-content-between">
                  <h3 className="mb-0">Lista de Usuários</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nome</th>
                      <th scope="col">E-mail</th>
                      <th scope="col">CPF ou CNPJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.nome}</td>
                        <td>{user.email}</td>
                        <td>{user.cpf_cnpj}</td>
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
};

export { UsersContainer };
