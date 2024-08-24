import React, { Fragment } from "react";
import { Col, Container, Row } from "reactstrap";

const Footer = () => {
    const iconStyle = { color: '#c9d75b' };

    return (
        <Fragment>
            <Container>
                <Row  >
                    <Col>
                        <h2>Nosso Objetivo</h2>
                        <p>Reduzir, reutilizar e reciclar são as principais metas da Semana do Lixo Zero. Vamos juntos fazer a diferença em nossa comunidade e no mundo!</p>
                    </Col>
                    <Col>
                        <h2>Participe</h2>
                        <p>Junte-se a nós em eventos, workshops e atividades para aprender como você pode contribuir para um mundo sem lixo.</p>
                    </Col>
                </Row>
                <Row className="text-center mt-4">
                    <Col>
                        <a href="https://www.facebook.com/caxiaslixozero/" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                            <i className="fab fa-facebook fa-2x mx-2"></i>
                        </a>
                        <a href="https://chat.whatsapp.com/ESseckd56xx7WG5iM8PJRK" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                            <i className="fab fa-whatsapp fa-2x mx-2"></i>
                        </a>
                        <a href="https://www.youtube.com/@caxiaslixozero5980" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                            <i className="fab fa-youtube fa-2x mx-2"></i>
                        </a>
                        <a href="https://www.instagram.com/caxiaslixozero/" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                            <i className="fab fa-instagram fa-2x mx-2"></i>
                        </a>
                    </Col>
                </Row>
            </Container>
            <footer className="text-center mt-4 mb-4">
                <p>© 2024 Instituto Lixo Zero. Todos os direitos reservados.</p>
            </footer>
        </Fragment>
    );
};

export { Footer };
