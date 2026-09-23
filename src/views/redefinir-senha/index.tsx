import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import api, { mensagemLimite } from '~api';
import {
  Button,
  Card,
  CardBody,
  FieldError,
  FormGroup,
  Label,
  PasswordInput,
} from '~components/ui';
import { useAuth } from '~context/AuthContext';

type Valores = {
  senha: string;
  confirmarSenha: string;
};

type Resposta = {
  message?: string;
  error?: string;
};

const MENSAGEM_LINK = 'Link inválido ou expirado.';
const MENSAGEM_SUCESSO = 'Senha redefinida. Entre novamente com a nova senha.';

// O tamanho fica com a API: link invalido ou expirado tem prioridade sobre a
// senha curta, e a confirmacao so existe no front.
const schema = yup.object({
  senha: yup.string(),
  confirmarSenha: yup.string().oneOf([yup.ref('senha')], 'As senhas não coincidem!'),
});

const PedirOutroLink = () => {
  const navigate = useNavigate();

  return (
    <Button className="mt-6 w-full" variant="outline" onClick={() => navigate('/esqueci-senha')}>
      Pedir outro link
    </Button>
  );
};

const RedefinirSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [linkInvalido, setLinkInvalido] = useState<string | null>(null);
  const [limite, setLimite] = useState<string | null>(null);
  const [erroSenha, setErroSenha] = useState<string | null>(null);

  // `useSearchParams` entrega o token ja decodificado. Abrir a pagina nao
  // chama a API: um GET automatico gastaria o link se um scanner de e-mail
  // abrisse a URL. O POST so acontece no envio do formulario.
  const token = searchParams.get('token');

  const handleSubmit = async (values: Valores, actions: FormikHelpers<Valores>) => {
    if (!token) return;

    setLimite(null);
    setErroSenha(null);

    try {
      const { data, status } = await api.post<Resposta>('/usuarios/redefinir-senha', {
        token,
        senha: values.senha,
      });

      const textoLimite = mensagemLimite(status, data);

      if (textoLimite) {
        setLimite(textoLimite);
        return;
      }

      if (status === 200) {
        logout();
        toast.success(data.message || MENSAGEM_SUCESSO);
        navigate('/', { replace: true, state: { abrirLogin: true } });
        return;
      }

      if (data.error === MENSAGEM_LINK) {
        setLinkInvalido(data.error);
        return;
      }

      if (data.error) {
        setErroSenha(data.error);
      }
    } catch {
      actions.setSubmitting(false);
    }
  };

  const tokenAusente = !token;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <Card>
        <CardBody className="p-8">
          <h1 className="mb-6 text-center text-2xl text-brand-forest">Redefinir senha</h1>

          {tokenAusente || linkInvalido ? (
            <div role="alert">
              <p className="text-sm leading-relaxed text-brand-danger">
                {linkInvalido || MENSAGEM_LINK}
              </p>
              <PedirOutroLink />
            </div>
          ) : (
            <Formik
              initialValues={{ senha: '', confirmarSenha: '' }}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                isSubmitting,
                submitCount,
              }) => (
                <Form>
                  {limite && (
                    <p className="mb-4 text-sm font-medium text-brand-danger" role="alert">
                      {limite}
                    </p>
                  )}

                  <FormGroup>
                    <Label htmlFor="senha-nova">Nova senha</Label>

                    <PasswordInput
                      id="senha-nova"
                      name="senha"
                      placeholder="Digite a nova senha"
                      autoComplete="new-password"
                      value={values.senha}
                      onChange={(event) => {
                        setErroSenha(null);
                        handleChange(event);
                      }}
                      onBlur={handleBlur}
                      invalid={
                        !!erroSenha || ((touched.senha || submitCount > 0) && !!errors.senha)
                      }
                    />

                    <FieldError>
                      {erroSenha || ((touched.senha || submitCount > 0) && errors.senha)}
                    </FieldError>
                  </FormGroup>

                  <FormGroup className="mb-0">
                    <Label htmlFor="confirmar-senha-nova">Confirme a nova senha</Label>

                    <PasswordInput
                      id="confirmar-senha-nova"
                      name="confirmarSenha"
                      placeholder="Digite a nova senha de novo"
                      autoComplete="new-password"
                      value={values.confirmarSenha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={
                        (touched.confirmarSenha || submitCount > 0) && !!errors.confirmarSenha
                      }
                    />

                    <FieldError>
                      {(touched.confirmarSenha || submitCount > 0) && errors.confirmarSenha}
                    </FieldError>
                  </FormGroup>

                  <p className="mt-3 text-xs text-gray-500">Use entre 10 e 128 caracteres.</p>

                  <Button className="mt-6 w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export { RedefinirSenha };
