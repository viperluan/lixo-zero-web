import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { buscarEdicaoVigente, type Edicao } from '~/lib/edicoes';

export type EdicaoContextType = {
  edicao: Edicao | null;
  loading: boolean;
  semVigente: boolean;
  recarregar: () => Promise<void>;
};

const EdicaoContext = createContext<EdicaoContextType | undefined>(undefined);

/** Evita estourar o rate limit público (60/min) ao trocar de aba várias vezes. */
const INTERVALO_MINIMO_MS = 10_000;

export const EdicaoProvider = ({ children }: PropsWithChildren) => {
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const [loading, setLoading] = useState(true);
  const [semVigente, setSemVigente] = useState(false);
  const ultimoFetch = useRef(0);

  const carregar = useCallback(async (opcoes?: { forcar?: boolean }) => {
    const forcar = opcoes?.forcar ?? false;
    const agora = Date.now();

    if (!forcar && ultimoFetch.current && agora - ultimoFetch.current < INTERVALO_MINIMO_MS) {
      return;
    }

    try {
      const { status, data } = await buscarEdicaoVigente();
      ultimoFetch.current = Date.now();

      if (status === 200 && data && typeof data === 'object' && 'id' in data) {
        setEdicao(data);
        setSemVigente(false);
        return;
      }

      if (status === 404) {
        setEdicao(null);
        setSemVigente(true);
      }
    } catch {
      // Rede ou timeout: a home segue sem lista, sem quebrar.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();

    const aoFicarVisivel = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;

      carregar();
    };

    window.addEventListener('focus', aoFicarVisivel);
    document.addEventListener('visibilitychange', aoFicarVisivel);

    return () => {
      window.removeEventListener('focus', aoFicarVisivel);
      document.removeEventListener('visibilitychange', aoFicarVisivel);
    };
  }, [carregar]);

  const recarregar = useCallback(() => carregar({ forcar: true }), [carregar]);

  return (
    <EdicaoContext.Provider value={{ edicao, loading, semVigente, recarregar }}>
      {children}
    </EdicaoContext.Provider>
  );
};

export const useEdicao = () => {
  const context = useContext(EdicaoContext);

  if (context === undefined) {
    throw new Error('useEdicao must be used within an EdicaoProvider');
  }

  return context;
};
