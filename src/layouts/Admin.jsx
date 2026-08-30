import { useEffect, useRef } from 'react';
import { useLocation, Route, Routes, Navigate } from 'react-router-dom';
import routes from '~/routes';

import { HomeNavbar } from '~components/Navbars/HomeNavbar';
import { Footer } from '~components/Footers/Footer';
import { useAuth } from '~context/AuthContext';
import { TipoUsuario } from '~/Enumerados';
import { Spinner } from '~components/ui';
import PageNotFound from '~/views/page-not-found';

const Admin = () => {
  const { loading, user } = useAuth();
  const mainContent = useRef(null);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/admin') {
        if (!user || user?.tipo !== TipoUsuario.Admin) {
          return <Route path={prop.path} element={<Navigate to="/" replace />} key={key} />;
        }

        return <Route path={prop.path} element={prop.component} key={key} exact />;
      } else {
        return null;
      }
    });
  };

  return (
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
  );
};

export default Admin;
