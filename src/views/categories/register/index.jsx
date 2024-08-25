import api from '~api';
import { LoadingOverlay } from '~components/Loading';
import { Fragment, useState } from 'react';
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

  const handleClick = () => {
    if (!description) return toast.error('Informe uma descrição para a categoria');
    setIsLoading(true);
    api
      .post(`/categorias`, {
        descricao: description,
      })
      .then((res) => {
        if (res.data.id) {
          setDescription();
          toast.success('Categoria cadastrada com sucesso');
          toogleModal();
          callBack();
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Fragment>
      <LoadingOverlay isLoading={isLoading} />
      <Modal isOpen={isOpen} toggle={toogleModal} className="modal-box">
        <ModalHeader toggle={toogleModal}>Cadastro de Categoria</ModalHeader>
        <Card className="bg-secondary shadow border-0">
          <CardBody>
            <Form className="form">
              <FormGroup className="mb-3">
                <Input
                  id="text"
                  name="text"
                  type="text"
                  placeholder="Descrição"
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
    </Fragment>
  );
};

export { CategoriesRegister };
