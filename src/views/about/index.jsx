import { Container } from '~components/ui';

const AboutContainer = () => {
  return (
    <>
      <section className="bg-brand-primary-dark py-16 text-white">
        <Container>
          <h1 className="font-display text-4xl sm:text-5xl">O Caxias Lixo Zero</h1>

          <p className="mt-4 text-xl italic text-white/90">
            Coletivo de Voluntários que representa o ILZB em Caxias do Sul desde 2020
          </p>

          <h2 className="mt-10 font-display text-3xl text-brand-secondary-light">Missão</h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-lg text-white/90 marker:text-brand-secondary-light">
            <li>Educação ambiental do cidadão Caxiense</li>
            <li>Engajamento e mobilização socioambiental</li>
            <li>
              Garantir a destinação ambientalmente adequada aos resíduos e apoiar a cadeia da
              reciclagem
            </li>
          </ul>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-brand-primary-light">
            Conceito <span className="text-brand-dark">Lixo Zero</span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            Lixo zero é uma meta ética, econômica, eficiente e visionária que incentiva os ciclos
            naturais sustentáveis, na qual todos os materiais são projetados para permitir sua
            recuperação e uso pós-consumo
          </p>
        </Container>
      </section>

      <section className="bg-brand-dark py-12 text-white">
        <Container>
          <ul className="list-disc space-y-3 pl-5 text-lg text-white/90 marker:text-brand-secondary-light">
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
      </section>
    </>
  );
};

export { AboutContainer };
