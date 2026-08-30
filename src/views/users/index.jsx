import { useEffect, useState } from 'react';
import api from '~api';
import { LoadingOverlay } from '~components/Loading';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Pagination,
  Table,
  TableEmpty,
  Tbody,
  Td,
  Tdh,
  Th,
  Thead,
  Tr,
} from '~components/ui';

const UsersContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = (page) => {
    setIsLoading(true);
    api
      .get(`/usuarios?page=${page}&limit=10`)
      .then((res) => {
        setListUsers(res.data.users || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>

          <Table>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>E-mail</Th>
                <Th>CPF ou CNPJ</Th>
              </Tr>
            </Thead>

            <Tbody>
              {listUsers.length === 0 && <TableEmpty colSpan={3} />}

              {listUsers.map((user) => (
                <Tr key={user.id}>
                  <Tdh>{user.nome}</Tdh>
                  <Td>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-brand-primary-dark hover:underline"
                    >
                      {user.email}
                    </a>
                  </Td>
                  <Td>{user.cpf_cnpj}</Td>
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

export { UsersContainer };
