import { Card, CardBody, Container } from 'reactstrap';

const AboutContainer = () => {
  return (
    <Card>
      <div style={{ backgroundColor: 'rgb(23 114 146)' }} className="p-5">
        <Container>
          <h1
            style={{ fontSize: '50px', fontWeight: 'bold', fontFamily: 'Barlow, sans-serif' }}
            className="text-default"
          >
            O Caxias Lixo Zero
          </h1>
          <h3 style={{ fontSize: '32px', fontStyle: 'italic', color: '#fff' }}>
            Coletivo de Voluntários que representa o ILZB em Caxias do Sul desde 2020
          </h3>
          <h3 style={{ fontSize: '40px', color: '#fff' }}>Missão</h3>
          <ul style={{ fontSize: '18px', color: '#fff' }}>
            <li>Educação ambiental do cidadão Caxiense</li>
            <li>Engajamento e mobilização socioambiental</li>
            <li>
              Garantir a destinação ambientalmente adequada aos resíduos e apoiar a cadeia da
              reciclagem
            </li>
          </ul>
        </Container>
      </div>
      <div className="my-4 text-center">
        <Container>
          <Card className="border-0">
            <CardBody>
              <h3 style={{ fontSize: '57px', textAlign: 'center', color: '#17a2b8' }}>
                Conceito <span style={{ color: '#343a40' }}>Lixo Zero</span>
              </h3>
              <p
                style={{ fontSize: '20px', textAlign: 'center', fontFamily: 'Barlow, sans-serif' }}
                className="text-default"
              >
                Lixo zero é uma meta ética, econômica, eficiente e visionária que incentiva os
                ciclos naturais sustentáveis, na qual todos os materiais são projetados para
                permitir sua recuperação e uso pós-consumo
              </p>
            </CardBody>
          </Card>
        </Container>
      </div>
      <div className="bg-default p-4">
        <Container>
          <ul style={{ color: '#fff', fontSize: '18px' }}>
            <li>
              <b>Máximo aproveitamento e correto encaminhamento</b> dos resíduos;
            </li>
            <li>
              Autorresponsabilização <b>pelo consumo e pelos resíduos</b> resultantes deste;
            </li>
            <li>
              Todos os materiais descartados devem tornar-se <b>recursos</b>.
            </li>
          </ul>
        </Container>
      </div>
    </Card>
  );
};

export { AboutContainer };
