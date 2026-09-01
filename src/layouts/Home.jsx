import { HomeNavbar } from '~components/Navbars/HomeNavbar';
import { Footer } from '~components/Footers/Footer';
import { Route, Routes } from 'react-router-dom';
import Home from '~/views/home';
import PageNotFound from '~/views/page-not-found';
import { AboutContainer } from '~/views/about';

const HomeContainer = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HomeNavbar />

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutContainer />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default HomeContainer;
