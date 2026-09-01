import { useAuth } from '~context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from '~components/ui';

import userImage from '~assets/img/theme/lixo-zero.png';

const UserLoggedDropDown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const trigger = (
    <>
      <img
        src={userImage}
        alt="Imagem de usuário"
        className="h-9 w-9 rounded-full border-2 border-white/40 object-cover"
      />
      <span className="hidden max-w-36 truncate text-sm font-semibold lg:inline">{user?.nome}</span>
      <ChevronDown className="h-4 w-4" />
    </>
  );

  return (
    <Dropdown trigger={trigger}>
      <DropdownHeader>Bem vindo!</DropdownHeader>
      <DropdownDivider />
      <DropdownItem
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
        <LogOut className="h-4 w-4" />
        Sair
      </DropdownItem>
    </Dropdown>
  );
};

export { UserLoggedDropDown };
