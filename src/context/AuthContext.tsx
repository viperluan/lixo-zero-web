import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { useCookies } from 'react-cookie';
import * as jose from 'jose';
import api from '~/api';

export type UserType = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
};

export type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    const loadUserData = () => {
      const token = cookies['token'];

      if (token) {
        loginWithCookie(token);
      }

      setLoading(false);
    };

    loadUserData();
  }, []);

  const loginWithCookie = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const userPayloadFromToken = decodeToken(token);
    setUser(userPayloadFromToken);
  };

  const login = (token: string) => {
    setCookie('token', token, { path: '/' });
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const userPayloadFromToken = decodeToken(token);
    setUser(userPayloadFromToken);
  };

  const logout = () => {
    removeCookie('token');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
  };

  const decodeToken = (token: string): UserType => {
    const { id, email, nome, tipo } = jose.decodeJwt<UserType>(token);

    return { id, email, nome, tipo };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
