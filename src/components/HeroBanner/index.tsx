import heroFolhas from '~assets/img/brand/hero-folhas.webp';
import heroLogo from '~assets/img/brand/hero-logo.webp';
import heroSelo from '~assets/img/brand/hero-selo.webp';

/**
 * Faixa de abertura da campanha, presente na home e no "sobre".
 *
 * A arte oficial vem em tres camadas — folhas ao fundo, logo e selo por cima —
 * para que o logo continue legivel no celular, onde a faixa de folhas seria
 * reduzida a nada.
 */
const HeroBanner = () => (
  <section
    className="bg-brand-cream bg-top bg-no-repeat"
    style={{ backgroundImage: `url(${heroFolhas})`, backgroundSize: '100% auto' }}
  >
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 px-4 py-7 sm:px-6 md:flex-row md:gap-[3%] md:py-4 lg:px-8">
      <img
        src={heroLogo}
        alt="7ª Semana Lixo Zero — Caxias do Sul"
        className="w-44 shrink-0 sm:w-52 md:w-[20%]"
        width="1000"
        height="638"
      />
      <img
        src={heroSelo}
        alt="Transformando ideias em ações!"
        className="w-64 sm:w-80 md:w-[36%]"
        width="1200"
        height="327"
      />
    </div>
  </section>
);

export { HeroBanner };
