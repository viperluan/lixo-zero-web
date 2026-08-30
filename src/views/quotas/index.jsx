import api from '~api';
import { useEffect, useState } from 'react';
import { QuotasRegister } from './register';
import { LoadingOverlay } from '~components/Loading';
import {
  Button,
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
  Th,
  Thead,
  Tr,
} from '~components/ui';

const QuotasContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listQuotas, setListQuotas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchQuotas = (page) => {
    setIsLoading(true);
    api
      .get(`/cota?page=${page}&limit=10`)
      .then((res) => {
        setListQuotas(res.data.quotas || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchQuotas(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const [openModal, setOpenModal] = useState(false);

  const toogleModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <QuotasRegister
        isOpen={openModal}
        toogleModal={toogleModal}
        callBack={() => {
          fetchQuotas(1);
        }}
      />

      <Container>
        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>Lista de Cotas</CardTitle>

            <Button onClick={toogleModal}>Nova Cota</Button>
          </CardHeader>

          <Table>
            <Thead>
              <Tr>
                <Th>Descrição</Th>
              </Tr>
            </Thead>

            <Tbody>
              {listQuotas.length === 0 && <TableEmpty colSpan={1} />}

              {listQuotas.map((quota) => (
                <Tr key={quota.id}>
                  <Td className="font-semibold">{quota.descricao}</Td>
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

export { QuotasContainer };
