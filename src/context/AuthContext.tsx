import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { toast } from 'react-toastify';
// Garante que o Axios registre o Bearer antes do boot da sessao.
import api from '~/api';
import {
  assumirSessaoPersistida,
  encerrarSeSessaoMorta,
  encerrarSessao,
  inscreverEncerramento,
  lerSessao,
  salvarSessao,
  usuarioDaSessao,
  type DadosSessao,
  type UsuarioSessao,
} from '~/lib/sessao';

export type UserType = UsuarioSessao;

export type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (dados: DadosSessao) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = inscreverEncerramento((motivo) => {
      setUser(null);

      if (motivo === 'expirada') {
        toast.error('Sessão expirada, entre novamente.');
      }
    });

    if (assumirSessaoPersistida()) {
      const sessaoAtual = lerSessao();

      if (sessaoAtual) {
        api.defaults.headers.common.Authorization = `Bearer ${sessaoAtual.token}`;
        const usuario = usuarioDaSessao(sessaoAtual);

        if (usuario) setUser(usuario);
      }
    }

    const checarSessaoVisivel = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;

      encerrarSeSessaoMorta();
    };

    window.addEventListener('focus', checarSessaoVisivel);
    document.addEventListener('visibilitychange', checarSessaoVisivel);

    setLoading(false);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', checarSessaoVisivel);
      document.removeEventListener('visibilitychange', checarSessaoVisivel);
    };
  }, []);

  const login = (dados: DadosSessao) => {
    salvarSessao(dados);
    api.defaults.headers.common.Authorization = `Bearer ${dados.token}`;
    setUser(dados.usuario);
  };

  const logout = () => {
    encerrarSessao({ motivo: 'logout' });
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
