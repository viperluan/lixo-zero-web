
import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components

import routes from "~/routes";
import { HomeNavbar } from "~components/Navbars/HomeNavbar";
import { Footer } from "~components/Footers/Footer";
import { useAuth } from "~context/AuthContext";
import { TipoUsuario } from "~/Enumerados";

const Admin = (props) => {
  const { loading, user } = useAuth();
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {

    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {

        if (!user || user?.tipo !== TipoUsuario.Admin) {
          return <Route path={prop.path} element={<Navigate to="/" replace />} key={key} />;
        }

        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };


  return (
    <div className="main-content" ref={mainContent}>
      {loading ? (<h1>Carregando</h1>) : (
        <div>
          <HomeNavbar />
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/admin/index" replace />} />
          </Routes>
          <Container fluid>
            <Footer />
          </Container>
        </div>
      )}
    </div>
  );
};

export default Admin;
