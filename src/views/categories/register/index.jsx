import api from '~api';
import { LoadingOverlay } from '~components/Loading';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  Form,
} from 'reactstrap';

const CategoriesRegister = ({ isOpen, toogleModal, callBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!description) return toast.error('Informe uma descrição para a categoria');

    setIsLoading(true);

    const { data, status } = await api.post(`/categorias`, {
      descricao: description,
    });

    if (status === 201) {
      setDescription('');
      toast.success('Categoria cadastrada com sucesso');
      toogleModal();
      callBack();
    }

    if (data.error) {
      toast.error(data.error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <Modal autoFocus={false} isOpen={isOpen} toggle={toogleModal} className="modal-box">
        <Form autoFocus className="form" onSubmit={handleSubmit}>
          <ModalHeader toggle={toogleModal}>Cadastro de Categoria</ModalHeader>

          <Card className="bg-secondary shadow border-0">
            <CardBody>
              <FormGroup className="mb-3">
                <Input
                  id="text"
                  name="text"
                  type="text"
                  placeholder="Descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  autoFocus
                />
              </FormGroup>
            </CardBody>

            <CardFooter className="d-flex justify-content-center">
              <Button type="submit" color="primary">
                Cadastrar
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </Modal>
    </>
  );
};

export { CategoriesRegister };
