import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Calendar } from 'lucide-react';
import imageEvento from '~assets/img/imagem-lixo-zero.webp';
import imageAgenda from '~assets/img/eventos-semana-lixo-zero.webp';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="gradient-brand text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Caxias Lixo Zero
            </h1>
            <p className="text-lg sm:text-xl text-white text-opacity-90 max-w-3xl mx-auto mb-8">
              Junte-se a nós na missão de tornar Caxias do Sul mais sustentável. Participe de ações,
              eventos e workshops que fazem diferença.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('auth/events/create')}
                className="btn-secondary text-lg font-semibold inline-flex items-center justify-center gap-2 hover:shadow-lg"
              >
                Criar uma Ação
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('auth/schedule')}
                className="px-8 py-3 bg-white text-brand-primary-dark rounded-lg font-semibold hover:bg-opacity-95 transition-all inline-flex items-center justify-center gap-2"
              >
                Ver Agenda
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-brand-secondary-light opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-brand-secondary-dark opacity-10 rounded-full blur-3xl"></div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Card 1 - Criar Ação */}
          <div
            onClick={() => navigate('auth/events/create')}
            className="card-lixo cursor-pointer group hover:shadow-xl transform hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div className="relative h-64 overflow-hidden rounded-lg mb-4">
              <img
                src={imageEvento}
                alt="Criar uma ação"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-brand-secondary-light rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-brand-secondary-dark" />
                </div>
                <h2 className="text-2xl font-display font-bold text-brand-primary-dark">
                  Criar uma Ação
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Envie uma solicitação para ministrar workshops e atividades para contribuir a um
                mundo ecologicamente melhor.
              </p>
              <div className="pt-4 flex items-center gap-2 text-brand-primary-dark font-semibold group-hover:gap-3 transition-all">
                Saiba mais
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 2 - Agenda */}
          <div
            onClick={() => navigate('auth/schedule')}
            className="card-lixo cursor-pointer group hover:shadow-xl transform hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div className="relative h-64 overflow-hidden rounded-lg mb-4">
              <img
                src={imageAgenda}
                alt="Agenda de Ações"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-brand-primary-light rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-brand-primary-dark" />
                </div>
                <h2 className="text-2xl font-display font-bold text-brand-primary-dark">
                  Agenda de Ações
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Verifique toda a programação da Semana do Lixo Zero. Confira os eventos já
                programados e salve em sua agenda.
              </p>
              <div className="pt-4 flex items-center gap-2 text-brand-primary-dark font-semibold group-hover:gap-3 transition-all">
                Ver Programação
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <section className="bg-gradient-to-r from-brand-secondary-light/20 to-brand-secondary-dark/10 rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="text-3xl font-display font-bold text-brand-primary-dark mb-4">
            Educação Ambiental em Ação
          </h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            Somos um coletivo de voluntários dedicados a promover educação ambiental,
            conscientização sobre resíduos e mobilização social para tornar Caxias do Sul uma
            referência em sustentabilidade.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-brand-primary-dark font-bold text-2xl">50%</p>
              <p className="text-gray-600 text-sm">Educação</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-brand-primary-dark font-bold text-2xl">25%</p>
              <p className="text-gray-600 text-sm">Resíduos</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-brand-primary-dark font-bold text-2xl">25%</p>
              <p className="text-gray-600 text-sm">Social</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Home;
