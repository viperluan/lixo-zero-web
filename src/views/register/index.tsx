// reactstrap components
import api from '../../api/index';
import { Fragment, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from 'reactstrap';
import { toast } from 'react-toastify';
import { TipoUsuario } from '~/Enumerados';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~context/AuthContext';
import { InputCpfCnpj } from '~components/Inputs/InputCpfCnpj';
import { AxiosResponse } from 'axios';

type UserAuthenticateResponseType = {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    tipo: string;
  };
};

const RegisterContainer = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();

  const handleCpfCnpjChange = (value: string) => {
    setCpfCnpj(value);
  };

  const handleRegister = async () => {
    if (!name) return toast.error('Informe o nome!');

    if (!cpfCnpj) return toast.error('Informe o documento!');

    if (!email) return toast.error('Informe o email!');

    if (!password) return toast.error('Informe a senha!');

    if (!confirmPassword) return toast.error('Informe a confirmação da senha!');

    if (confirmPassword !== password) return toast.error('As senhas não coincidem!');

    const registerUser = await api.post('/usuarios', {
      nome: name,
      email: email,
      senha: password,
      tipo: TipoUsuario.Usuario,
      cpf_cnpj: cpfCnpj,
    });

    if (registerUser.status !== 201) return;

    toast.success('Usuário criado com sucesso, realizando o login.');

    await handleAuthenticate();
  };

  const handleAuthenticate = async () => {
    const authenticateUser: AxiosResponse<UserAuthenticateResponseType> = await api.post(
      '/usuarios/autenticar',
      { email, senha: password }
    );

    if (authenticateUser.data.token) {
      login(authenticateUser.data.token);
      toast.success(`Usuario ${authenticateUser.data.usuario.nome} autenticado!`);
      navigate('/');
    }
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-center align-items-center">
        <Col lg="6" md="8">
          <CardHeader className="d-flex justify-content-center">Crie sua conta!</CardHeader>
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Nome"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputCpfCnpj
                      placeholder="CPF/CNPJ"
                      value={cpfCnpj}
                      onChange={handleCpfCnpjChange}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
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
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Confirme a Senha"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="button" onClick={handleRegister}>
                    Criar Conta
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </div>
    </Fragment>
  );
};

export { RegisterContainer };
