import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  Jumbotron,
  Row,
} from 'reactstrap';
import imageEvento from '~assets/img/imagem-lixo-zero.webp';
import imageAgenda from '~assets/img/eventos-semana-lixo-zero.png';

import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Jumbotron>
      <Container>
        <Row>
          <Col md="6">
            <Card className="cursor-pointer" onClick={() => navigate('auth/events/create')}>
              <CardBody>
                <CardTitle tag="h2">Criar uma Ação</CardTitle>
                <CardText>
                  Envie uma solicitação para ministrar workshops e atividades para contribuir para
                  um mundo ecologicamente melhor.
                </CardText>
              </CardBody>
              <CardImg
                bottom
                width="100%"
                height="400px"
                src={imageEvento}
                alt="Instituto Lixo Zero"
              />
            </Card>
          </Col>
          <Col md="6">
            <Card className="cursor-pointer" onClick={() => navigate('auth/schedule')}>
              <CardBody>
                <CardTitle tag="h2">Agenda de Ações</CardTitle>

                <CardText>
                  Veifique toda a progamação da Semana do Lixo Zero. Confira os eventos já
                  programadas e salve em sua agenda.
                </CardText>
              </CardBody>
              <CardImg
                bottom
                width="100%"
                height="400px"
                src={imageAgenda}
                alt="Instituto Lixo Zero"
              />
            </Card>
          </Col>
        </Row>
      </Container>
    </Jumbotron>
  );
};

export default Home;
