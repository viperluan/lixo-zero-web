import { Form, Formik, FormikHelpers } from 'formik';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import api, { mensagemLimite } from '~api';
import { Button, Card, CardBody, FieldError, FormGroup, Input, Label } from '~components/ui';

type Valores = {
  email: string;
};

type Resposta = {
  message?: string;
  error?: string;
};

const MENSAGEM_PADRAO =
  'Se existir uma conta com esse e-mail, enviaremos instruções para redefinir a senha.';

const schema = yup.object({
  email: yup
    .string()
    .email('Formato de email inválido.')
    .required('É necessário informar um email.'),
});

const EsqueciSenha = () => {
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [limite, setLimite] = useState<string | null>(null);

  const handleSubmit = async (values: Valores, actions: FormikHelpers<Valores>) => {
    setLimite(null);

    try {
      const { data, status } = await api.post<Resposta>('/usuarios/esqueci-senha', {
        email: values.email,
      });

      const textoLimite = mensagemLimite(status, data);

      if (textoLimite) {
        setLimite(textoLimite);
        return;
      }

      if (status === 200) {
        setSucesso(data.message || MENSAGEM_PADRAO);
        return;
      }

      if (data.error) {
        setLimite(data.error);
      }
    } catch {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <Card>
        <CardBody className="p-8">
          <h1 className="mb-2 text-center text-2xl text-brand-forest">Esqueci minha senha</h1>

          {sucesso ? (
            <div role="status">
              <p className="mt-6 text-sm leading-relaxed text-brand-dark">{sucesso}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Aguarde alguns minutos e confira a caixa de spam. O envio pode atrasar.
              </p>
              <Link
                to="/"
                className="mt-8 inline-block text-sm font-semibold text-brand-forest underline-offset-2 hover:underline"
              >
                Voltar ao início
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 text-center text-sm text-gray-500">
                Informe o e-mail da conta para receber o link de redefinição.
              </p>

              <Formik
                initialValues={{ email: '' }}
                validationSchema={schema}
                onSubmit={handleSubmit}
              >
                {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
                  <Form>
                    {limite && (
                      <p className="mb-4 text-sm font-medium text-brand-danger" role="alert">
                        {limite}
                      </p>
                    )}

                    <FormGroup className="mb-0">
                      <Label htmlFor="esqueci-email">E-mail</Label>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="esqueci-email"
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

                    <Button className="mt-6 w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Enviar link'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export { EsqueciSenha };
