import {
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Button,
  Collapse,
  NavbarToggler,
} from 'reactstrap';
import { ModalLogin } from '~components/Headers/Modal/Modal';
import { useState } from 'react';
import '../../assets/scss/argon-dashboard/custom/navs/_nav.scss';
import { useAuth } from '~context/AuthContext';
import { UserLoggedDropDown } from '~components/UserComponent';
import { TipoUsuario } from '~/Enumerados';
import { Link } from 'react-router-dom';

const HomeNavbar = () => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const renderAdminButtons = () => {
    return (
      <div className="admin-buttons">
        <Link to="/admin/events">
          <Button size="sm">Ações</Button>
        </Link>
        {/* <Link to="/admin/partners">
          <Button size="sm">Patrocinadores</Button>
        </Link> */}
        <Link to="/admin/users">
          <Button size="sm">Usuários</Button>
        </Link>
        <Link to="/admin/categories">
          <Button size="sm">Tipo de Atividades</Button>
        </Link>
        {/* <Link to="/admin/quotas">
          <Button size="sm">Cotas de Patrocínio</Button>
        </Link> */}
      </div>
    );
  };

  const renderUserButtons = () => {
    return (
      <div className="admin-buttons">
        <Link to={`/auth/events/my-events/${user.id}`}>
          <Button size="sm">Minhas Ações</Button>
        </Link>
      </div>
    );
  };

  const renderUnauthenticatedButtons = () => {
    return (
      <NavItem>
        <Button onClick={toggleModal} className="login-button">
          Login
        </Button>
      </NavItem>
    );
  };

  return (
    <div>
      <Navbar className="navbar-horizontal navbar-dark bg-default" expand="md">
        <NavbarBrand tag={Link} to="/">
          Instituto Lixo Zero
        </NavbarBrand>

        <NavbarToggler onClick={toggleNavbar} />

        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto d-flex align-items-center" navbar>
            <NavItem>
              <NavLink tag={Link} to="/auth/events/create">
                Criar ação
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="/auth/schedule">
                Agenda
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={Link} to="/about">
                Sobre
              </NavLink>
            </NavItem>

            {/* <NavItem>
              <NavLink tag={Link} to="/auth/partner/create">Apoie o projeto</NavLink>
            </NavItem> */}

            {!user ? renderUnauthenticatedButtons() : <UserLoggedDropDown />}
          </Nav>
        </Collapse>

        <ModalLogin isOpen={modalVisible} toggle={toggleModal} />
      </Navbar>

      {user?.tipo === TipoUsuario.Admin && renderAdminButtons()}

      {user?.tipo === TipoUsuario.Usuario && renderUserButtons()}
    </div>
  );
};

export { HomeNavbar };
