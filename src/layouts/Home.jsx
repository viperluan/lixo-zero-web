import { HomeNavbar } from '~components/Navbars/HomeNavbar';
import { Footer } from '~components/Footers/Footer';
import { Route, Routes } from 'react-router-dom';
import Home from '~/views/home';
import PageNotFound from '~/views/page-not-found';
import { AboutContainer } from '~/views/about';
import { EsqueciSenha } from '~/views/esqueci-senha';
import { RedefinirSenha } from '~/views/redefinir-senha';

const HomeContainer = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <HomeNavbar />

      <main className="flex w-full flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutContainer />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default HomeContainer;
