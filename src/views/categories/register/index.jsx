import api from '~api';
import { LoadingOverlay } from '~components/Loading';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '~components/ui';

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

      <Modal isOpen={isOpen} toggle={toogleModal} size="sm">
        <form onSubmit={handleSubmit}>
          <ModalHeader toggle={toogleModal}>Cadastro de Categoria</ModalHeader>

          <ModalBody>
            <FormGroup className="mb-0">
              <Label htmlFor="descricao-categoria">Descrição</Label>
              <Input
                id="descricao-categoria"
                name="descricao"
                type="text"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button variant="neutral" onClick={toogleModal}>
              Cancelar
            </Button>

            <Button type="submit">Cadastrar</Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export { CategoriesRegister };
