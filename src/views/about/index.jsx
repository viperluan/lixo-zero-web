import { Container } from '~components/ui';
import { HeroBanner } from '~components/HeroBanner';

/**
 * A pagina "Sobre" da campanha e uma coluna centralizada sobre o verde escuro,
 * com os textos de apoio em italico — o mesmo ritmo da arte oficial.
 */
const AboutContainer = () => {
  return (
    <>
      <HeroBanner />

      <section className="flex-1 bg-brand-forest py-14 text-brand-cream sm:py-20">
        <Container className="max-w-4xl text-center">
          <h1 className="text-4xl text-white sm:text-5xl">O Caxias Lixo Zero é...</h1>

          <p className="mt-5 text-lg italic text-brand-cream/90">
            Um coletivo de Voluntários que representa o ILZB em Caxias do Sul desde 2020
          </p>

          <h2 className="mt-14 text-4xl text-white sm:text-5xl">Missão</h2>

          <div className="mt-5 space-y-1 text-lg text-brand-cream/90">
            <p>Educação ambiental do cidadão Caxiense</p>
            <p>Engajamento e mobilização socioambiental</p>
            <p>
              Garantir a destinação ambientalmente adequada aos resíduos e apoiar a cadeia da
              reciclagem
            </p>
          </div>

          <h2 className="mt-14 text-4xl text-white sm:text-5xl">Conceito Lixo Zero</h2>

          <p className="mt-5 text-lg italic leading-relaxed text-brand-cream/90">
            Lixo zero é uma meta ética, econômica, eficiente e visionária que incentiva os ciclos
            naturais sustentáveis, na qual todos os materiais são projetados para permitir sua
            recuperação e uso pós-consumo
          </p>

          <ul className="mx-auto mt-8 inline-block list-disc space-y-2 pl-5 text-left text-lg italic text-brand-cream/90 marker:text-brand-sage">
            <li>Máximo aproveitamento e correto encaminhamento dos resíduos;</li>
            <li>Autorresponsabilização pelo consumo e pelos resíduos resultantes deste;</li>
            <li>Todos os materiais descartados devem tornar-se recursos.</li>
          </ul>
        </Container>
      </section>
    </>
  );
};

export { AboutContainer };
