import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '~context/AuthContext';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Container } from '~components/ui';

const EMAIL_SUPORTE = 'caxiaslixozero@gmail.com';

type LocationState = {
  cadastroRealizado?: boolean;
};

const ActionCreateSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as LocationState | null;

  if (!state?.cadastroRealizado) {
    return <Navigate to="/auth/events/create" replace />;
  }

  const destinoAcoes =
    user?.tipo === '0' ? '/admin/events' : `/auth/events/my-events/${user?.id}`;

  return (
    <Container className="max-w-2xl">
      <Card>
        <CardHeader className="space-y-3 text-center">
          <Mail className="mx-auto h-10 w-10 text-brand-forest" aria-hidden="true" />
          <CardTitle>Pedido de cadastro recebido</CardTitle>
        </CardHeader>

        <CardBody className="space-y-5 text-sm leading-relaxed text-brand-dark">
          <p>
            Recebemos a solicitação de cadastro da sua ação. Em breve você receberá um e-mail
            {user?.email ? (
              <>
                {' '}
                em <strong>{user.email}</strong>
              </>
            ) : null}{' '}
            com a confirmação, templates e orientações para divulgação.
          </p>

          <div className="rounded-lg border border-brand-warning/50 bg-brand-warning/20 px-4 py-3">
            <p className="font-semibold text-brand-dark">Olhe também a caixa de spam</p>
            <p className="mt-2">
              Confira a entrada, o spam, o lixo eletrônico e a aba Promoções (Gmail). Se o e-mail
              estiver lá, marque como “não é spam” e adicione{' '}
              <strong>{EMAIL_SUPORTE}</strong> aos seus contatos para receber os próximos avisos.
            </p>
          </div>

          <p>
            Se a mensagem não chegar, fale conosco em{' '}
            <a
              href={`mailto:${EMAIL_SUPORTE}`}
              className="text-brand-forest underline hover:text-brand-forest/70"
            >
              {EMAIL_SUPORTE}
            </a>
            .
          </p>
        </CardBody>

        <CardFooter className="flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate(destinoAcoes)}>
            {user?.tipo === '0' ? 'Ver ações' : 'Ir para minhas ações'}
          </Button>

          <Button variant="outline" size="lg" onClick={() => navigate('/auth/events/create')}>
            Cadastrar outra ação
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
};

export { ActionCreateSuccess };
