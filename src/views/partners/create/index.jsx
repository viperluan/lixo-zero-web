import api from '~api';
import { useAuth } from '~context/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import { SituacaoPatrocinio } from '~/Enumerados';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '~components/Loading';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  FormGroup,
  HelpText,
  Input,
  Label,
  Select,
  Textarea,
} from '~components/ui';

const PartnersCreateContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [nomePatrocionador, setNomePatrocionador] = useState('');
  const [descricaoPatrocinador, setDescricaoPatrocionador] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cotaPatrocinio, setCotaPatrocinio] = useState('');
  const [listaCotas, setListaCotas] = useState([]);

  const fetchQuotas = () => {
    api.get(`/cota?page=1&limit=150`).then((res) => {
      setListaCotas(res.data.quotas || []);
    });
  };

  useEffect(() => {
    fetchQuotas();
  }, []);

  const handleSubmit = async () => {
    if (!user.id) return toast.warn('Faça login antes de continuar!');

    if (!nomePatrocionador) return toast.warn('Informe o nome do patrocionador!');

    if (!whatsapp) return toast.warn('Informe o número de contato!');

    if (!descricaoPatrocinador) return toast.warn('Informe a descrição do patrocionador!');

    if (!cotaPatrocinio) return toast.warn('Selecione a cota de patrocínio!');

    // Adicionar lógica para enviar dados ao servidor
    const payload = {
      id_usuario_responsavel: user.id,
      celular: whatsapp.replace(/\D/g, ''),
      nome: nomePatrocionador,
      descricao: descricaoPatrocinador,
      id_cota: cotaPatrocinio,
      situacao: SituacaoPatrocinio.AguardandoConfirmacao,
    };

    setIsLoading(true);
    await api
      .post(`/patrocinio`, payload)
      .then((res) => {
        if (res.status === 201) {
          toast.success(
            'Seu formulário foi enviado com sucesso. Em breve a nossa equipe entrará em contato.',
            {
              autoClose: 10000,
            }
          );
          navigate('/');
        }

        if (res.data.error) {
          toast.error(res.data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container className="max-w-3xl">
      <LoadingOverlay isLoading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle>Quero apoiar o Instituto Lixo Zero Caxias Do Sul</CardTitle>
        </CardHeader>

        <CardBody>
          <form>
            <FormGroup>
              <Label htmlFor="nomePatrocionador">Nome do Patrocionador</Label>

              <HelpText>
                {`Empresa/Instituição/Grupo que irá fornecer o patrocínio. Se for 'pessoa física'
                insira seu nome`}
              </HelpText>

              <Input
                id="nomePatrocionador"
                name="nomePatrocionador"
                type="text"
                placeholder="Nome do responsável pelo patrocínio"
                value={nomePatrocionador}
                onChange={(e) => setNomePatrocionador(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="whatsapp">Contato do responsável pelo patrocínio</Label>

              <InputMask
                mask="(99) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              >
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    id="whatsapp"
                    name="whatsapp"
                    type="text"
                    placeholder="(99) 99999-9999"
                  />
                )}
              </InputMask>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="cota_patrocinio">Cota de Patrocínio</Label>

              <Select
                id="cota_patrocinio"
                name="cota_patrocinio"
                value={cotaPatrocinio}
                onChange={(e) => setCotaPatrocinio(e.target.value)}
              >
                <option value="" disabled>
                  Selecione
                </option>
                {listaCotas.map((cota) => (
                  <option key={cota.id} value={cota.id}>
                    {cota.descricao}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup className="mb-0">
              <Label htmlFor="activityDescription">
                Descrição de como irei realizar o patrocínio
              </Label>

              <Textarea
                id="activityDescription"
                name="activityDescription"
                placeholder="Descrição do patrocinio"
                rows={3}
                value={descricaoPatrocinador}
                onChange={(e) => setDescricaoPatrocionador(e.target.value)}
              />
            </FormGroup>
          </form>
        </CardBody>

        <CardFooter className="justify-center">
          <Button size="lg" onClick={handleSubmit}>
            Enviar Formulário
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
};

export { PartnersCreateContainer };
