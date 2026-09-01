import { useNavigate } from 'react-router-dom';
import { Button, Container } from '~components/ui';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-7xl text-brand-secondary-light">404</p>

      <h1 className="mt-4 font-display text-3xl uppercase text-brand-primary-dark">
        Página não encontrada!
      </h1>

      <Button className="mt-8" size="lg" onClick={() => navigate('/')}>
        Voltar para home
      </Button>
    </Container>
  );
};

export default PageNotFound;
