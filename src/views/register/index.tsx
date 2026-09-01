import api from '~api';
import { useState } from 'react';
import { IdCard, Lock, Mail, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { TipoUsuario } from '~/Enumerados';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~context/AuthContext';
import { InputCpfCnpj } from '~components/Inputs/InputCpfCnpj';
import { Button, Card, CardBody, FormGroup, Input, Label } from '~components/ui';
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
    const onlyNumbers = value.replace(/\D/g, '');

    const limitedValue = onlyNumbers.slice(0, 14);

    setCpfCnpj(limitedValue);
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

    if (registerUser.status === 201) {
      toast.success('Usuário criado com sucesso, realizando o login.');
      await handleAuthenticate();
    }

    if (registerUser.data.error) {
      toast.error(registerUser.data.error);
    }
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

  // Ícone à esquerda dentro do campo: o padrão do InputGroup do Bootstrap virou
  // um wrapper relativo com o ícone posicionado sobre o input.
  const iconClass =
    'pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400';

  return (
    <div className="mx-auto w-full max-w-xl px-4">
      <h1 className="mb-8 text-center font-display text-3xl text-brand-primary-dark">
        Crie sua conta!
      </h1>

      <Card>
        <CardBody className="p-6 sm:p-8">
          <form>
            <FormGroup>
              <Label htmlFor="nome">Nome</Label>

              <div className="relative">
                <User className={iconClass} />
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  className="pl-10"
                  placeholder="Digite seu nome"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="cpf-cnpj">CPF ou CNPJ</Label>

              <div className="relative">
                <IdCard className={iconClass} />
                <InputCpfCnpj
                  id="cpf-cnpj"
                  className="pl-10"
                  placeholder="Digite seu CPF ou CNPJ"
                  value={cpfCnpj}
                  onChange={handleCpfCnpjChange}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">E-mail</Label>

              <div className="relative">
                <Mail className={iconClass} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="pl-10"
                  placeholder="Digite seu email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="senha">Senha</Label>

              <div className="relative">
                <Lock className={iconClass} />
                <Input
                  id="senha"
                  type="password"
                  className="pl-10"
                  placeholder="Digite sua senha"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </FormGroup>

            <FormGroup className="mb-0">
              <Label htmlFor="confirmar-senha">Confirme sua senha</Label>

              <div className="relative">
                <Lock className={iconClass} />
                <Input
                  id="confirmar-senha"
                  type="password"
                  className="pl-10"
                  placeholder="Confirme sua senha"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </FormGroup>

            <Button className="mt-8 w-full" size="lg" onClick={handleRegister}>
              Criar Conta
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export { RegisterContainer };
