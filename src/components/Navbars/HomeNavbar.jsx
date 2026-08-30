import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ModalLogin } from '~components/Headers/Modal/Modal';
import { useAuth } from '~context/AuthContext';
import { UserLoggedDropDown } from '~components/UserComponent';
import { TipoUsuario } from '~/Enumerados';

const HomeNavbar = () => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleNavbar = () => setIsOpen(!isOpen);

  const renderAdminButtons = () => (
    <div className="flex flex-wrap gap-2 py-3 border-t border-brand-secondary-light">
      <Link to="/admin/events" className="btn-secondary text-sm">
        Ações
      </Link>
      <Link to="/admin/users" className="btn-secondary text-sm">
        Usuários
      </Link>
      <Link to="/admin/categories" className="btn-secondary text-sm">
        Tipo de Atividades
      </Link>
    </div>
  );

  const renderUserButtons = () => (
    <div className="flex flex-wrap gap-2 py-3 border-t border-brand-secondary-light">
      <Link to={`/auth/events/my-events/${user.id}`} className="btn-secondary text-sm">
        Minhas Ações
      </Link>
    </div>
  );

  return (
    <>
      <header className="bg-gradient-to-r from-brand-primary-dark to-brand-primary-light text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="flex items-center space-x-2 font-display text-2xl font-bold hover:opacity-90 transition-opacity"
            >
              <div className="w-10 h-10 bg-brand-secondary-light rounded-full flex items-center justify-center text-brand-primary-dark font-bold">
                L
              </div>
              <span className="hidden sm:inline">Lixo Zero</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/auth/events/create"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-20 transition-all"
              >
                Criar ação
              </Link>
              <Link
                to="/auth/schedule"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-20 transition-all"
              >
                Agenda
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-20 transition-all"
              >
                Sobre
              </Link>
            </nav>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <button onClick={toggleModal} className="btn-secondary text-sm font-medium">
                  Entrar
                </button>
              ) : (
                <UserLoggedDropDown />
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleNavbar}
              className="md:hidden p-2 rounded-md hover:bg-white hover:bg-opacity-20 transition-all"
              aria-expanded="false"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-white border-opacity-20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/auth/events/create"
                onClick={toggleNavbar}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-20"
              >
                Criar ação
              </Link>
              <Link
                to="/auth/schedule"
                onClick={toggleNavbar}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-20"
              >
                Agenda
              </Link>
              <Link
                to="/about"
                onClick={toggleNavbar}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-20"
              >
                Sobre
              </Link>
              {!user && (
                <button
                  onClick={() => {
                    toggleModal();
                    toggleNavbar();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-20"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Admin/User Action Buttons */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user?.tipo === TipoUsuario.Admin && renderAdminButtons()}
          {user?.tipo === TipoUsuario.Usuario && renderUserButtons()}
        </div>
      )}

      <ModalLogin isOpen={modalVisible} toggle={toggleModal} />
    </>
  );
};

export { HomeNavbar };
