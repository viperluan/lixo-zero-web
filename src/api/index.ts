import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import {
  encerrarSessao,
  lerSessao,
  ligarAuthorization,
  sessaoAssumidaPelaUI,
  sessaoExpirada,
} from '~/lib/sessao';

type ErrorResponseType = {
  message?: string;
  error?: string;
  code?: string;
};

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * Suprime o toast do interceptor de erro. Para requisicoes decorativas que
     * podem falhar sem consequencia — a faixa de proximas acoes da home, que
     * simplesmente nao renderiza quando a API esta fora do ar.
     */
    silenciarErro?: boolean;
  }
}

const isDevelopment = import.meta.env.MODE === 'development';
const baseURL = isDevelopment ? `http://localhost:3000` : import.meta.env.VITE_API_URL;

const MENSAGEM_SESSAO_INVALIDA = 'Sessão inválida.';
const MENSAGEM_AUTH_NECESSARIA = 'Autenticação necessária para acessar o recurso.';

const api = axios.create({
  baseURL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500,
});

ligarAuthorization((token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
});

function pathnameDaConfig(config: InternalAxiosRequestConfig | undefined): string {
  const raw = config?.url ?? '';
  const pathPart = raw.split('?')[0];

  if (/^https?:\/\//i.test(pathPart)) {
    try {
      return new URL(pathPart).pathname.replace(/\/+$/, '') || '/';
    } catch {
      return pathPart;
    }
  }

  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;

  return path.replace(/\/+$/, '') || '/';
}

function ehGetListagemAcoes(config: InternalAxiosRequestConfig | undefined): boolean {
  const method = (config?.method ?? 'get').toLowerCase();

  return method === 'get' && pathnameDaConfig(config) === '/acoes';
}

function ehLogin(config: InternalAxiosRequestConfig | undefined): boolean {
  return pathnameDaConfig(config) === '/usuarios/autenticar';
}

function valorAuthorization(config: InternalAxiosRequestConfig | undefined): string | undefined {
  if (!config?.headers) return undefined;

  const valor = config.headers.get('Authorization');

  return typeof valor === 'string' ? valor : undefined;
}

function requestTinhaBearer(config: InternalAxiosRequestConfig | undefined): boolean {
  const valor = valorAuthorization(config);

  return typeof valor === 'string' && /^Bearer\s+\S+/i.test(valor);
}

function sessaoInvalidaNoCorpo(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;

  return (data as ErrorResponseType).message === MENSAGEM_SESSAO_INVALIDA;
}

function autenticacaoNecessariaNoCorpo(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;

  return (data as ErrorResponseType).message === MENSAGEM_AUTH_NECESSARIA;
}

function deveEncerrarSessaoPor401(response: AxiosResponse): boolean {
  if (response.status !== 401) return false;
  if (ehLogin(response.config)) return false;

  if (sessaoInvalidaNoCorpo(response.data)) return true;

  if (autenticacaoNecessariaNoCorpo(response.data)) {
    return Boolean(lerSessao()?.token) || requestTinhaBearer(response.config);
  }

  return false;
}

function deveEncerrarPorHeaderAcoes(response: AxiosResponse): boolean {
  if (!ehGetListagemAcoes(response.config)) return false;
  if (!requestTinhaBearer(response.config)) return false;

  const header = response.headers?.['x-session-expired'];

  return String(header).toLowerCase() === 'true';
}

api.interceptors.request.use((config) => {
  if (!ehLogin(config) && sessaoAssumidaPelaUI() && (!lerSessao() || sessaoExpirada())) {
    encerrarSessao({ motivo: 'expirada' });
    config.headers.delete('Authorization');
    return config;
  }

  const sessao = lerSessao();

  if (sessao?.token) {
    config.headers.set('Authorization', `Bearer ${sessao.token}`);
  } else {
    config.headers.delete('Authorization');
  }

  return config;
});

const responseSuccessInterceptor = (response: AxiosResponse) => {
  if (deveEncerrarPorHeaderAcoes(response) || deveEncerrarSessaoPor401(response)) {
    encerrarSessao({ motivo: 'expirada' });
  }

  return Promise.resolve(response);
};

const responseErrorInterceptor = (error: AxiosError<ErrorResponseType>) => {
  if (error.config?.silenciarErro) return Promise.reject(error);

  if (error.response) {
    const serverErrorMessage = error.response.data?.message || error.response.data?.error;
    toast.error(serverErrorMessage || 'Ocorreu um erro no servidor');

    return Promise.reject(error);
  }

  toast.error('Erro de conexão ou timeout');
  return Promise.reject('Erro de conexão ou timeout');
};

api.interceptors.response.use(responseSuccessInterceptor, responseErrorInterceptor);

export default api;
