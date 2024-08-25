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

  return (
    <div>
      <Navbar className="navbar-horizontal navbar-dark bg-default" expand="md">
        <NavbarBrand href="/">Instituto Lixo Zero</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/auth/events/create">Criar ação</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/auth/schedule">Agenda</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/auth/about">Sobre</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/auth/partner/create">Apoie o projeto</NavLink>
            </NavItem>
            {!user ? (
              <NavItem>
                <Button onClick={toggleModal} className="login-button">
                  Login
                </Button>
              </NavItem>
            ) : (
              <UserLoggedDropDown />
            )}
          </Nav>
        </Collapse>
        <ModalLogin isOpen={modalVisible} toggle={toggleModal} />
      </Navbar>
      {user?.tipo === TipoUsuario.Admin && (
        <div className="admin-buttons">
          <Link to="/admin/events">
            <Button size="sm">Ações</Button>
          </Link>
          <Link to="/admin/partners">
            <Button size="sm">Patrocinadores</Button>
          </Link>
          <Link to="/admin/users">
            <Button size="sm">Usuários</Button>
          </Link>
          <Link to="/admin/categories">
            <Button size="sm">Tipo de Atividades</Button>
          </Link>
          <Link to="/admin/quotas">
            <Button size="sm">Cotas de Patrocínio</Button>
          </Link>
        </div>
      )}
      {user?.tipo === TipoUsuario.Usuario && (
        <div className="admin-buttons">
          <Link to={`/auth/events/my-events/${user.id}`}>
            <Button size="sm">Minhas Ações</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export { HomeNavbar };
