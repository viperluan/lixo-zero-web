import { PropsWithChildren } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '~api';
import { useAuth } from '~context/AuthContext';
import {
  Button,
  FieldError,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '~components/ui';

import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';

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

type UserType = {
  email: string;
  password: string;
};

interface IModalLoginProps extends PropsWithChildren {
  isOpen: boolean;
  toggle: () => void;
}

const ModalLogin = ({ isOpen, toggle }: IModalLoginProps) => {
  const location = useLocation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Formato de email inválido.')
      .required('É necessário informar um email.'),
    password: yup.string().required('É necessário informar uma senha.'),
  });

  const handleClick = () => {
    navigate('/auth/register');
    toggle();
  };

  const handleSubmit = async (values: UserType, actions: FormikHelpers<UserType>) => {
    const { email, password } = values;

    try {
      const { data } = await api.post<UserAuthenticateResponseType>('/usuarios/autenticar', {
        email,
        senha: password,
      });

      if (data.token) {
        login(data.token);
        toast.success(`Usuario ${data.usuario?.nome} autenticado!`);
        actions.resetForm();
        navigate(location.pathname);
        toggle();
      }

      if (data.error) toast.error(data.error);

      actions.setSubmitting(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(
        'Ocorreu algum erro ao tentarmos fazer sua autenticação, tente novamente mais tarde.'
      );
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="sm">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
          <Form>
            <ModalHeader toggle={toggle}>Faça o login</ModalHeader>

            <ModalBody>
              <FormGroup>
                <Label htmlFor="email">E-mail</Label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-10"
                    placeholder="Digite seu email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.email && !!errors.email}
                  />
                </div>

                <FieldError>{touched.email && errors.email}</FieldError>
              </FormGroup>

              <FormGroup className="mb-0">
                <Label htmlFor="password">Senha</Label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="pl-10"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.password && !!errors.password}
                  />
                </div>

                <FieldError>{touched.password && errors.password}</FieldError>
              </FormGroup>
            </ModalBody>

            <ModalFooter className="justify-center">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>

              <Button variant="outline" onClick={handleClick}>
                Cadastrar
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export { ModalLogin };
