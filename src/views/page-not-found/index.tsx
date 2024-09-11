import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
      fluid
    >
      <h1 className="d-flex text-uppercase">Página não encontrada!</h1>

      <Button className="my-4" onClick={() => navigate('/')} color="primary">
        Voltar para home
      </Button>
    </Container>
  );
};

export default PageNotFound;
