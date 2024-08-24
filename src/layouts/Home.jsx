import { HomeNavbar } from "components/Navbars/HomeNavbar";
import { Fragment } from "react";
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Container, Jumbotron, Row } from "reactstrap";
import imageEvento from '../assets/img/imagem-lixo-zero.webp'
import imageAgenda from '../assets/img/eventos-semana-lixo-zero.png'
import imagemPatrocinador from '../assets/img/patrocinador-lixo-zero.png'
import { useNavigate } from "react-router-dom";
import { Footer } from "components/Footers/Footer";

const HomeContainer = () => {
    const navigate = useNavigate()
    return (
        <Fragment>
            <HomeNavbar />

            <Jumbotron  >
                <Container>
                    <Row>
                        <Col md="6">
                            <Card className="cursor-pointer" onClick={() => navigate('auth/events/create')}>
                                <CardBody>
                                    <CardTitle tag="h2">Criar uma Ação</CardTitle>
                                    <CardText>Envie uma solicitação para ministrar workshops e atividades para contribuir para um mundo ecologicamente melhor.</CardText>
                                </CardBody>
                                <CardImg bottom width="100%" height="400px" src={imageEvento} alt="Instituto Lixo Zero" />
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card className="cursor-pointer" onClick={() => navigate('auth/schedule')}>
                                <CardBody>
                                    <CardTitle tag="h2">Agenda de Ações</CardTitle>

                                    <CardText>Veifique toda a progamação da Semana do Lixo Zero. Confira os eventos já programadas e salve em sua agenda.</CardText>
                                </CardBody>
                                <CardImg bottom width="100%" height="400px" src={imageAgenda} alt="Instituto Lixo Zero" />
                            </Card>
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-center mt-4 cursor-pointer">
                        <Col md="6">
                            <Card onClick={() => navigate('auth/partner/create')} >
                                <CardBody>
                                    <CardTitle tag="h2">Seja um patrocinador</CardTitle>
                                    <CardText>Apoie o nosso evento, contribuindo para um mundo com menos lixo.</CardText>
                                    <CardImg bottom width="100%" src={imagemPatrocinador} alt="Instituto Lixo Zero" />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
            <Container fluid>
                <Footer />
            </Container>
        </Fragment>
    )
}


export default HomeContainer;