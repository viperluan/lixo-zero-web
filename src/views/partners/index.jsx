import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import api from '~api';
import { SituacaoPatrocinio } from '~/Enumerados';
import {
  Badge,
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
  Tdh,
  Th,
  Thead,
  Tr,
} from '~components/ui';

// Rótulo e cor da situação ficam na mesma tabela para que o CSV exporte o mesmo
// texto que a tela mostra.
const SITUACOES = {
  [SituacaoPatrocinio.AguardandoConfirmacao]: { label: 'Pendente', variant: 'warning' },
  [SituacaoPatrocinio.Confirmado]: { label: 'Confirmado', variant: 'success' },
  [SituacaoPatrocinio.Cancelado]: { label: 'Cancelado', variant: 'danger' },
};

const getSituacao = (situacao) =>
  SITUACOES[situacao] ?? { label: 'Desconhecida', variant: 'neutral' };

const PartnersContainer = () => {
  const [listPartners, setListPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPartners = (page) => {
    api.get(`/patrocinio?page=${page}&limit=10`).then((res) => {
      setListPartners(res.data.partnes || []);
      setTotalPages(res.data.totalPages || 1);
    });
  };

  useEffect(() => {
    fetchPartners(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
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
      'Email do patrocinador',
    ];
    const rows = listPartners.map((partner) => [
      partner.nome,
      getSituacao(partner.situacao).label,
      partner.cota.descricao,
      partner.descricao,
      new Date(partner.data_cadastro).toLocaleDateString('pt-BR'),
      partner.celular,
      partner.usuario_patrocinio.nome,
      partner.usuario_patrocinio.email,
    ]);

    let csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      rows.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'patrocinios.csv');
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle>Lista de Patrocinadores</CardTitle>

          <Button onClick={exportToCSV}>Exportar para CSV</Button>
        </CardHeader>

        <Table>
          <Thead>
            <Tr>
              <Th>Patrocionador</Th>
              <Th>Situação</Th>
              <Th>Cota</Th>
              <Th>Descrição</Th>
              <Th>Cadastro</Th>
              <Th>Celular</Th>
              <Th>Usuário</Th>
            </Tr>
          </Thead>

          <Tbody>
            {listPartners.length === 0 && <TableEmpty colSpan={7} />}

            {listPartners.map((partner) => {
              const situacao = getSituacao(partner.situacao);

              return (
                <Tr key={partner.id}>
                  <Tdh>{partner.nome}</Tdh>
                  <Td>
                    <Badge variant={situacao.variant}>{situacao.label}</Badge>
                  </Td>
                  <Td>{partner.cota.descricao}</Td>
                  <Td className="max-w-96 truncate" title={partner.descricao}>
                    {partner.descricao}
                  </Td>
                  <Td>{new Date(partner.data_cadastro).toLocaleDateString('pt-BR')}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      {partner.celular}
                      <a
                        href={`https://wa.me/${partner.celular}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Abrir conversa no WhatsApp"
                      >
                        <FaWhatsapp size={18} className="text-[#25D366]" />
                      </a>
                    </span>
                  </Td>
                  <Td>
                    {partner.usuario_patrocinio.nome}
                    <br />
                    <a
                      href={`mailto:${partner.usuario_patrocinio.email}`}
                      className="text-brand-primary-dark hover:underline"
                    >
                      {partner.usuario_patrocinio.email}
                    </a>
                  </Td>
                </Tr>
              );
            })}
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

export { PartnersContainer };
