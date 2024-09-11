import { useEffect, useRef } from 'react';
import { Container } from 'reactstrap';
import { useLocation, Route, Routes, Navigate } from 'react-router-dom';
import routes from '~/routes';

import { HomeNavbar } from '~components/Navbars/HomeNavbar';
import { Footer } from '~components/Footers/Footer';
import { useAuth } from '~context/AuthContext';
import { TipoUsuario } from '~/Enumerados';
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
    <div className="main-content d-flex flex-column h-100" ref={mainContent}>
      {loading ? (
        <h1>Carregando</h1>
      ) : (
        <>
          <HomeNavbar />

          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<PageNotFound />} />
          </Routes>

          <Container fluid>
            <Footer />
          </Container>
        </>
      )}
    </div>
  );
};

export default Admin;
