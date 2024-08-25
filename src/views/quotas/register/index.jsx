import api from '~api';
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

const QuotasRegister = ({ isOpen, toogleModal, callBack }) => {
  const [description, setDescription] = useState('');

  const handleClick = () => {
    if (!description) return toast.error('Informe uma descrição para a cota');

    api
      .post(`/cota`, {
        descricao: description,
      })
      .then((res) => {
        if (res.data.id) {
          setDescription();
          toast.success('Cota cadastrada com sucesso');
          toogleModal();
          callBack();
        }
      });
  };

  return (
    <Modal isOpen={isOpen} toggle={toogleModal} className="modal-box">
      <ModalHeader toggle={toogleModal}>Cadastro de Cota</ModalHeader>
      <Card className="bg-secondary shadow border-0">
        <CardBody>
          <Form className="form">
            <FormGroup className="mb-3">
              <Input
                id="text"
                name="text"
                type="text"
                placeholder="Descrição da Cota"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
          </Form>
        </CardBody>
        <CardFooter className="d-flex justify-content-center">
          <Button onClick={handleClick} color="primary">
            Cadastrar
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export { QuotasRegister };
