import { HomeNavbar } from '~components/Navbars/HomeNavbar';

import { Footer } from '~components/Footers/Footer';
import { Container } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';
import Home from '~/views/home';
import PageNotFound from '~/views/page-not-found';

const HomeContainer = () => {
  return (
    <div className="main-content d-flex flex-column h-100">
      <HomeNavbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Container fluid>
        <Footer />
      </Container>
    </div>
  );
};

export default HomeContainer;
