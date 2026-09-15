import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ModalLogin } from '~components/Headers/Modal/Modal';
import { useAuth } from '~context/AuthContext';
import { UserLoggedDropDown } from '~components/UserComponent';
import { TipoUsuario } from '~/Enumerados';
import iconeLixoZero from '~assets/img/brand/icone-lixo-zero.png';

const LINKS = [
  { to: '/auth/events/create', label: 'Criar ação' },
  { to: '/auth/schedule', label: 'Agenda' },
  { to: '/about', label: 'Sobre' },
];

const HomeNavbar = () => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleNavbar = () => setIsOpen(!isOpen);

  const renderAdminButtons = () => (
    <div className="flex flex-wrap gap-2 border-t border-brand-sage/40 py-3">
      <Link to="/admin/events" className="btn-primary text-sm">
        Ações
      </Link>
      <Link to="/admin/users" className="btn-primary text-sm">
        Usuários
      </Link>
      <Link to="/admin/categories" className="btn-primary text-sm">
        Tipo de Atividades
      </Link>
    </div>
  );

  const renderUserButtons = () => (
    <div className="flex flex-wrap gap-2 border-t border-brand-sage/40 py-3">
      <Link to={`/auth/events/my-events/${user.id}`} className="btn-primary text-sm">
        Minhas Ações
      </Link>
    </div>
  );

  return (
    <>
      <header className="bg-brand-forest text-brand-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
              <img
                src={iconeLixoZero}
                alt="Caxias Lixo Zero"
                className="h-9 w-auto sm:h-10"
                width="369"
                height="320"
              />
            </Link>

            {/* Navegacao central, como na arte da campanha */}
            <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-base text-brand-cream/90 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden shrink-0 items-center gap-3 md:flex">
              {!user ? (
                <button
                  onClick={toggleModal}
                  className="rounded-xl bg-brand-sage px-6 py-2.5 font-semibold text-brand-forest-deep transition-all hover:bg-brand-sage/80"
                >
                  Entrar
                </button>
              ) : (
                <UserLoggedDropDown />
              )}
            </div>

            <button
              onClick={toggleNavbar}
              className="rounded-md p-2 transition-all hover:bg-white/10 md:hidden"
              aria-expanded={isOpen}
              aria-label="Abrir menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-white/20 md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={toggleNavbar}
                  className="block rounded-md px-3 py-2 text-base hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    toggleModal();
                    toggleNavbar();
                  }}
                  className="mt-2 w-full rounded-xl bg-brand-sage px-3 py-2.5 font-semibold text-brand-forest-deep"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {user && (
        <div className="bg-brand-forest text-brand-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {user?.tipo === TipoUsuario.Admin && renderAdminButtons()}
            {user?.tipo === TipoUsuario.Usuario && renderUserButtons()}
          </div>
        </div>
      )}

      <ModalLogin isOpen={modalVisible} toggle={toggleModal} />
    </>
  );
};

export { HomeNavbar };
