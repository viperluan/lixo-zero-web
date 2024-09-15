import { PropsWithChildren } from 'react';
import {
  Modal,
  FormGroup,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from 'reactstrap';
import '../../../assets/scss/argon-dashboard/custom/modals/_modal.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../api';
import { useAuth } from '~context/AuthContext';

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
    <>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
          <Modal isOpen={isOpen} toggle={toggle} className="modal-box">
            <Form className="form">
              <ModalHeader toggle={toggle}>Faça o login</ModalHeader>

              <ModalBody>
                <FormGroup className="mb-3">
                  <InputGroup className="">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Digite seu email"
                      autoComplete="email"
                      style={{ paddingLeft: '12px' }}
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.email && !!errors.email}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>

                    <Input
                      id="password"
                      name="password"
                      placeholder="Digite sua senha"
                      type="password"
                      autoComplete="password"
                      style={{ paddingLeft: '12px' }}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.password && !!errors.password}
                    />
                  </InputGroup>
                </FormGroup>
              </ModalBody>

              <ModalFooter className="d-flex justify-content-center">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>

                <Button onClick={handleClick} color="primary">
                  Cadastrar
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export { ModalLogin };
