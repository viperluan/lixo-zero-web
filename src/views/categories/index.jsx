import api from '~api';
import { useEffect, useState } from 'react';
import { CategoriesRegister } from './register';
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

const CategoriesContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listCategories, setListCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = (page) => {
    setIsLoading(true);
    api
      .get(`/categorias?page=${page}&limit=10`)
      .then((res) => {
        setListCategories(res.data.categories || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCategories(currentPage);
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

      <CategoriesRegister
        isOpen={openModal}
        toogleModal={toogleModal}
        callBack={() => {
          fetchCategories(1);
        }}
      />

      <Container>
        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>Lista de Categorias</CardTitle>

            <Button onClick={toogleModal}>Nova Categoria</Button>
          </CardHeader>

          <Table>
            <Thead>
              <Tr>
                <Th>Descrição</Th>
              </Tr>
            </Thead>

            <Tbody>
              {listCategories.length === 0 && <TableEmpty colSpan={1} />}

              {listCategories.map((category) => (
                <Tr key={category.id}>
                  <Td className="font-semibold">{category.descricao}</Td>
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

export { CategoriesContainer };
