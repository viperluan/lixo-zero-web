// O lucide-react v1 removeu os ícones de marca, entao as redes sociais vem do
// react-icons, que ja era dependencia do projeto.
import { FaFacebookF, FaWhatsapp, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/caxiaslixozero/',
      icon: FaFacebookF,
    },
    {
      name: 'WhatsApp',
      url: 'https://chat.whatsapp.com/ESseckd56xx7WG5iM8PJRK',
      icon: FaWhatsapp,
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@caxiaslixozero5980',
      icon: FaYoutube,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/caxiaslixozero/',
      icon: FaInstagram,
    },
  ];

  return (
    <footer className="bg-gradient-to-r from-brand-primary-dark via-brand-primary-light to-brand-secondary-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-display font-bold mb-3">Nosso Objetivo</h3>
            <p className="text-white text-opacity-90">
              Reduzir, reutilizar e reciclar são as principais metas da Semana do Lixo Zero. Vamos
              juntos fazer a diferença em nossa comunidade e no mundo!
            </p>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold mb-3">Participe</h3>
            <p className="text-white text-opacity-90">
              Junte-se a nós em eventos, workshops e atividades para aprender como você pode
              contribuir para um mundo sem lixo.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 py-6 border-t border-white border-opacity-20">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-secondary-light transition-colors duration-200 transform hover:scale-110"
                aria-label={link.name}
              >
                <Icon className="w-8 h-8" />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-white border-opacity-20">
          <p className="text-white text-opacity-75">
            © 2024 Instituto Lixo Zero. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
