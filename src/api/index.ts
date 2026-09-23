import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import {
  encerrarSessao,
  guardarAvisoSessaoInvalida,
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
const MENSAGEM_MUITAS_REQUISICOES = 'Muitas requisições. Tente novamente mais tarde.';
const CODE_TOKEN_EXPIRED = 'TOKEN_EXPIRED';

let indoParaLogin = false;

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

/**
 * Recuperacao de senha e publica, no mesmo estilo do login: o JWT da sessao
 * nao vai no header. O token do e-mail viaja so no corpo do POST.
 */
function ehRecuperacaoSenha(config: InternalAxiosRequestConfig | undefined): boolean {
  const path = pathnameDaConfig(config);

  return path === '/usuarios/esqueci-senha' || path === '/usuarios/redefinir-senha';
}

export function mensagemLimite(status: number, data: unknown): string | null {
  if (status !== 429) return null;

  if (data && typeof data === 'object') {
    const message = (data as ErrorResponseType).message;

    if (typeof message === 'string' && message) return message;
  }

  return MENSAGEM_MUITAS_REQUISICOES;
}

/** Negócio/`500` usam `error`; auth e rate limit usam `message`. */
export function mensagemErroApi(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;

  const corpo = data as ErrorResponseType;

  if (typeof corpo.error === 'string' && corpo.error) return corpo.error;
  if (typeof corpo.message === 'string' && corpo.message) return corpo.message;

  return null;
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

function codeDoCorpo(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const code = (data as ErrorResponseType).code;

  return typeof code === 'string' && code ? code : undefined;
}

/**
 * `Sessão inválida.` sem `code` e o JWT rejeitado depois da troca de senha:
 * logout e ida ao login. `TOKEN_EXPIRED` continua sendo so a expiracao de 24h.
 */
function motivoEncerramentoPor401(response: AxiosResponse): 'expirada' | 'invalida' | null {
  if (response.status !== 401) return null;
  if (ehLogin(response.config) || ehRecuperacaoSenha(response.config)) return null;

  const code = codeDoCorpo(response.data);
  const autenticada = Boolean(lerSessao()?.token) || requestTinhaBearer(response.config);

  if (code === CODE_TOKEN_EXPIRED) {
    return autenticada ? 'expirada' : null;
  }

  if (sessaoInvalidaNoCorpo(response.data)) {
    if (!code && autenticada) return 'invalida';

    return 'expirada';
  }

  if (autenticacaoNecessariaNoCorpo(response.data) && autenticada) {
    return 'expirada';
  }

  return null;
}

function irParaLoginPorSessaoInvalida() {
  if (indoParaLogin || typeof window === 'undefined') return;

  indoParaLogin = true;
  guardarAvisoSessaoInvalida();
  window.location.replace('/?entrar=1');
}

function deveEncerrarPorHeaderAcoes(response: AxiosResponse): boolean {
  if (!ehGetListagemAcoes(response.config)) return false;
  if (!requestTinhaBearer(response.config)) return false;

  const header = response.headers?.['x-session-expired'];

  return String(header).toLowerCase() === 'true';
}

api.interceptors.request.use((config) => {
  if (ehRecuperacaoSenha(config)) {
    config.headers.delete('Authorization');
    return config;
  }

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
  if (deveEncerrarPorHeaderAcoes(response)) {
    encerrarSessao({ motivo: 'expirada' });
    return Promise.resolve(response);
  }

  const motivo = motivoEncerramentoPor401(response);

  if (motivo === 'invalida') {
    encerrarSessao({ motivo: 'invalida' });
    irParaLoginPorSessaoInvalida();
    return Promise.resolve(response);
  }

  if (motivo === 'expirada') {
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
