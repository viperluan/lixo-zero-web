import api from '~api';
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

const QuotasRegister = ({ isOpen, toogleModal, callBack }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!description) return toast.error('Informe uma descrição para a cota');

    api
      .post(`/cota`, {
        descricao: description,
      })
      .then((res) => {
        if (res.data.id) {
          setDescription('');
          toast.success('Cota cadastrada com sucesso');
          toogleModal();
          callBack();
        }

        if (res.data.error) toast.error(res.data.error);
      });
  };

  return (
    <Modal isOpen={isOpen} toggle={toogleModal} size="sm">
      <form onSubmit={handleSubmit}>
        <ModalHeader toggle={toogleModal}>Cadastro de Cota</ModalHeader>

        <ModalBody>
          <FormGroup className="mb-0">
            <Label htmlFor="descricao-cota">Descrição</Label>
            <Input
              id="descricao-cota"
              name="descricao"
              type="text"
              placeholder="Descrição da Cota"
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
  );
};

export { QuotasRegister };
