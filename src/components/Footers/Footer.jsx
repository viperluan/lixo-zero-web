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
    <footer className="mt-auto bg-brand-forest text-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xl text-white">Nosso Objetivo</h3>
            <p className="text-brand-cream/90">
              Reduzir, reutilizar e reciclar são as principais metas da Semana do Lixo Zero. Vamos
              juntos fazer a diferença em nossa comunidade e no mundo!
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-xl text-white">Participe</h3>
            <p className="text-brand-cream/90">
              Junte-se a nós em eventos, workshops e atividades para aprender como você pode
              contribuir para um mundo sem lixo.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-6 border-t border-brand-cream/20 py-6">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transform text-brand-cream transition-colors duration-200 hover:scale-110 hover:text-brand-sage"
                aria-label={link.name}
              >
                <Icon className="h-8 w-8" />
              </a>
            );
          })}
        </div>

        <div className="border-t border-brand-cream/20 pt-6 text-center">
          {/* Shrikhand e a assinatura da marca no manual — fica reservada a este ponto. */}
          <p className="font-display text-2xl text-brand-sage">Caxias Lixo Zero</p>
          <p className="mt-2 text-brand-cream/75">
            © 2026 Instituto Lixo Zero. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
