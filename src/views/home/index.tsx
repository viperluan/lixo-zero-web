import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { ActionLink } from '~components/ui';
import { HeroBanner } from '~components/HeroBanner';
import imageEvento from '~assets/img/acoes-palestra.webp';
import imageAgenda from '~assets/img/agenda-calendario.webp';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <HeroBanner />

      {/* Chamada e atalhos principais */}
      <section className="bg-brand-forest px-4 py-7 text-brand-cream sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg sm:text-xl">
            Junte-se a nós na missão de transformar ideias em ações
          </p>

          <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <ActionLink
              label="Criar ação"
              icon={ArrowRight}
              onClick={() => navigate('auth/events/create')}
            />
            <ActionLink label="Agenda" icon={Clock} onClick={() => navigate('auth/schedule')} />
          </div>
        </div>
      </section>

      {/* Cards de destaque */}
      <section className="bg-brand-forest px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 md:gap-8">
          <article className="flex flex-col rounded-3xl bg-white p-4 shadow-lg sm:p-6">
            <img
              src={imageEvento}
              alt="Público em uma palestra da Semana Lixo Zero"
              className="h-56 w-full rounded-2xl object-cover sm:h-64"
            />
            <p className="mt-5 flex-1 text-center text-base leading-relaxed text-brand-dark sm:text-lg">
              Envie uma solicitação para transformar suas ideias em ações e contribuir para a
              mudança que você quer ver no mundo
            </p>
            <div className="mt-5 flex justify-center">
              <ActionLink
                label="Saiba mais"
                icon={ArrowRight}
                tone="bare"
                onClick={() => navigate('auth/events/create')}
              />
            </div>
          </article>

          <article className="flex flex-col rounded-3xl bg-white p-4 shadow-lg sm:p-6">
            <img
              src={imageAgenda}
              alt="Calendário com a programação da Semana Lixo Zero"
              className="h-56 w-full rounded-2xl object-cover sm:h-64"
            />
            <p className="mt-5 flex-1 text-center text-base leading-relaxed text-brand-dark sm:text-lg">
              Verifique toda a programação da Semana Lixo Zero. Confira os eventos já programados e
              salve em sua agenda
            </p>
            <div className="mt-5 flex justify-center">
              <ActionLink
                label="Ver Programação"
                icon={ArrowRight}
                tone="bare"
                onClick={() => navigate('auth/schedule')}
              />
            </div>
          </article>
        </div>

        {/* Focos de atuacao do coletivo */}
        <div className="mx-auto mt-10 max-w-6xl rounded-3xl bg-brand-cream p-8 text-center sm:p-12">
          <h2 className="text-3xl text-brand-forest sm:text-4xl">Educação Ambiental em Ação</h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-brand-dark">
            Somos um coletivo de voluntários dedicados a promover educação ambiental,
            conscientização sobre resíduos e mobilização social para tornar Caxias do Sul uma
            referência em sustentabilidade.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { valor: '50%', rotulo: 'Educação' },
              { valor: '25%', rotulo: 'Resíduos' },
              { valor: '25%', rotulo: 'Social' },
            ].map((foco) => (
              <div key={foco.rotulo} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-2xl font-black text-brand-forest">{foco.valor}</p>
                <p className="label-condensed text-sm text-brand-dark/70">{foco.rotulo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
