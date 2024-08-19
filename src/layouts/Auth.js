import React, { Fragment, useEffect, useState } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";

// core components
import routes from "routes.js";
import { HomeNavbar } from "components/Navbars/HomeNavbar";
import { Footer } from "components/Footers/Footer";
import { useAuth } from "context/AuthContext";
import { ModalLogin } from "components/Headers/Modal/Modal";

const Auth = (props) => {
  const { loading, user } = useAuth();
  const mainContent = React.useRef(null);
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
      if (currentPath !== "/auth/register" && currentPath !== "/auth/schedule") {
        setLoginModalOpen(true);
      }
    }
  }, [loading, user, location]);

  const toggleLoginModal = () => setLoginModalOpen(!isLoginModalOpen);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        if (!user && (prop.path !== "/register" && prop.path !== "/schedule")) {
          return null;
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
    <Fragment>
      <ModalLogin isOpen={isLoginModalOpen} toggle={toggleLoginModal} />
      <div className="main-content" ref={mainContent}>
        {loading ? (<h1>Carregando</h1>) : (
          <div>
            <HomeNavbar />
            <Routes>
              {getRoutes(routes)}
            </Routes>
            <Container fluid>
              <Footer />
            </Container>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Auth;
