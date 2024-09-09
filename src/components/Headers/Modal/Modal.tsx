import { Fragment, PropsWithChildren, useState } from 'react';
import {
  Modal,
  Form,
  FormGroup,
  Input,
  Button,
  CardBody,
  Card,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CardFooter,
  ModalHeader,
} from 'reactstrap';
import '../../../assets/scss/argon-dashboard/custom/modals/_modal.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../api';
import { useAuth } from '~context/AuthContext';
import { LoadingOverlay } from '~components/Loading';
import { AxiosResponse } from 'axios';

type UserAuthenticateResponseType = {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    tipo: string;
  };
  error?: string;
};

interface IModalLoginProps extends PropsWithChildren {
  isOpen: boolean;
  toggle: () => void;
}

const ModalLogin = ({ isOpen, toggle }: IModalLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/auth/register');
    toggle();
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = async () => {
    try {
      if (!emailRegex.test(email)) return toast.error('Informe um e-mail válido.');

      if (!password) return toast.error('Informe a senha!');

      setIsLoading(true);

      await api
        .post('/usuarios/autenticar', { email, senha: password })
        .then((response: AxiosResponse<UserAuthenticateResponseType>) => {
          if (response.data.token) {
            login(response.data.token);
            toast.success(`Usuario ${response.data.usuario?.nome} autenticado!`);
            navigate(location.pathname);
            toggle();
          }

          if (response.data.error) toast.error(response.data.error);
        })
        .finally(() => setIsLoading(false));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* empty */
    }
  };

  return (
    <Fragment>
      <LoadingOverlay isLoading={isLoading} />
      <Modal isOpen={isOpen} toggle={toggle} className="modal-box">
        <ModalHeader toggle={toggle}>Faça o login</ModalHeader>
        <Card className="bg-secondary shadow border-0">
          <CardBody>
            <Form className="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Senha"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter className="d-flex justify-content-center">
            <Button onClick={validate}>Entrar</Button>
            <Button onClick={handleClick} color="primary">
              Cadastrar
            </Button>
          </CardFooter>
        </Card>
      </Modal>
    </Fragment>
  );
};

export { ModalLogin };
