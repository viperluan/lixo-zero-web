import { useEffect, useRef, useState } from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';

import routes from '~/routes';
import { HomeNavbar } from '~components/Navbars/HomeNavbar';
import { Footer } from '~components/Footers/Footer';
import { useAuth } from '~context/AuthContext';
import { ModalLogin } from '~components/Headers/Modal/Modal';
import { Spinner } from '~components/ui';
import PageNotFound from '~/views/page-not-found';

const Auth = () => {
  const { loading, user } = useAuth();
  const mainContent = useRef(null);
  const location = useLocation();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = location.pathname;
      if (currentPath !== '/auth/register' && currentPath !== '/auth/schedule') {
        setLoginModalOpen(true);
      }
    }
  }, [loading, user, location]);

  const toggleLoginModal = () => setLoginModalOpen(!isLoginModalOpen);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/auth') {
        if (!user && prop.path !== '/register' && prop.path !== '/schedule') {
          return null;
        }
        return <Route path={prop.path} element={prop.component} key={key} exact />;
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <ModalLogin isOpen={isLoginModalOpen} toggle={toggleLoginModal} />

      <div className="flex min-h-screen flex-col bg-gray-50" ref={mainContent}>
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner size="lg" className="text-brand-primary-dark" />
          </div>
        ) : (
          <>
            <HomeNavbar />

            <main className="w-full flex-1 py-8">
              <Routes>
                {getRoutes(routes)}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </main>

            <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default Auth;
