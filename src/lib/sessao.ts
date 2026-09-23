import { Cookies } from 'react-cookie';
import * as jose from 'jose';

const cookies = new Cookies();

const COOKIE_TOKEN = 'token';
const COOKIE_EXPIRES_AT = 'expires_at';
const COOKIE_USUARIO = 'usuario';
const OPCOES_COOKIE = { path: '/' } as const;

/** Margem para o relogio local: trata como vencida se falta menos que isto. */
const MARGEM_EXPIRACAO_MS = 5_000;

export type UsuarioSessao = {
  id: string;
  nome: string;
  email: string;
  tipo: string;
};

export type DadosSessao = {
  token: string;
  expires_at?: string;
  expires_in?: number;
  usuario: UsuarioSessao;
};

export type MotivoEncerramento = 'expirada' | 'logout' | 'invalida';

const CHAVE_AVISO_SESSAO_INVALIDA = 'aviso-sessao-invalida';
const TEXTO_AVISO_SESSAO_INVALIDA = 'Sessão inválida, entre novamente.';

/** Sobrevive ao reload que manda a pessoa para o login depois do 401 sem `code`. */
export function guardarAvisoSessaoInvalida() {
  sessionStorage.setItem(CHAVE_AVISO_SESSAO_INVALIDA, TEXTO_AVISO_SESSAO_INVALIDA);
}

export function consumirAvisoSessaoInvalida() {
  const aviso = sessionStorage.getItem(CHAVE_AVISO_SESSAO_INVALIDA);

  if (!aviso) return null;

  sessionStorage.removeItem(CHAVE_AVISO_SESSAO_INVALIDA);
  return aviso;
}

type EncerramentoCallback = (motivo: MotivoEncerramento) => void;
type AplicarAuthorization = (token: string | null) => void;

let onEncerramento: EncerramentoCallback | null = null;
let aplicarAuthorization: AplicarAuthorization | null = null;
let avisoExpiracaoPendente = false;
let sessaoAssumida = false;
let timeoutExpiracao: ReturnType<typeof setTimeout> | null = null;

function definirAuthorization(token: string | null) {
  aplicarAuthorization?.(token);
}

function parseUsuario(valor: unknown): UsuarioSessao | undefined {
  if (!valor) return undefined;

  if (typeof valor === 'object' && valor !== null && 'id' in valor && 'tipo' in valor) {
    const usuario = valor as UsuarioSessao;

    if (usuario.id && usuario.tipo) return usuario;
  }

  if (typeof valor === 'string') {
    try {
      return parseUsuario(JSON.parse(valor));
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function expIsoDoJwt(token: string): string | undefined {
  try {
    const payload = jose.decodeJwt(token);

    if (typeof payload.exp === 'number') {
      return new Date(payload.exp * 1000).toISOString();
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function usuarioDoJwt(token: string): UsuarioSessao | undefined {
  try {
    const { id, email, nome, tipo } = jose.decodeJwt<UsuarioSessao>(token);

    if (id && email && nome && tipo) {
      return { id, email, nome, tipo };
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function instanteExpiracaoMs(
  sessao: NonNullable<ReturnType<typeof lerSessao>>
): number | undefined {
  const expiresAt = sessao.expires_at || expIsoDoJwt(sessao.token);

  if (!expiresAt) return undefined;

  const instante = Date.parse(expiresAt);

  if (Number.isNaN(instante)) return undefined;

  return instante - MARGEM_EXPIRACAO_MS;
}

/**
 * O Axios registra o callback na criacao da instancia. O modulo de sessao nao
 * importa `api` para evitar ciclo com os interceptors.
 */
export function ligarAuthorization(fn: AplicarAuthorization) {
  aplicarAuthorization = fn;
}

export function inscreverEncerramento(cb: EncerramentoCallback) {
  onEncerramento = cb;

  return () => {
    if (onEncerramento === cb) onEncerramento = null;
  };
}

export function sessaoAssumidaPelaUI() {
  return sessaoAssumida;
}

export function cancelarExpiracaoLocal() {
  if (timeoutExpiracao === null) return;

  clearTimeout(timeoutExpiracao);
  timeoutExpiracao = null;
}

/** Agenda o encerramento no `expires_at` para nao depender de request nem de F5. */
export function agendarExpiracaoLocal() {
  cancelarExpiracaoLocal();

  const sessao = lerSessao();

  if (!sessao) return;

  const quando = instanteExpiracaoMs(sessao);

  if (quando === undefined) return;

  const delay = quando - Date.now();

  if (delay <= 0) {
    encerrarSessao({ motivo: 'expirada' });
    return;
  }

  timeoutExpiracao = setTimeout(() => {
    timeoutExpiracao = null;
    encerrarSessao({ motivo: 'expirada' });
  }, delay);
}

export function assumirSessaoPersistida() {
  const sessao = lerSessao();

  if (!sessao?.token) return false;

  if (sessaoExpirada()) {
    encerrarSessao({ motivo: 'expirada' });
    return false;
  }

  sessaoAssumida = true;
  aplicarBearerAtual();
  agendarExpiracaoLocal();
  return true;
}

export function encerrarSeSessaoMorta() {
  if (!sessaoAssumida) return false;

  if (!lerSessao() || sessaoExpirada()) {
    encerrarSessao({ motivo: 'expirada' });
    return true;
  }

  return false;
}

export function salvarSessao(dados: DadosSessao) {
  avisoExpiracaoPendente = false;
  sessaoAssumida = true;

  cookies.set(COOKIE_TOKEN, dados.token, OPCOES_COOKIE);

  if (dados.expires_at) {
    cookies.set(COOKIE_EXPIRES_AT, dados.expires_at, OPCOES_COOKIE);
  } else {
    cookies.remove(COOKIE_EXPIRES_AT, OPCOES_COOKIE);
  }

  cookies.set(COOKIE_USUARIO, dados.usuario, OPCOES_COOKIE);
  definirAuthorization(dados.token);
  agendarExpiracaoLocal();
}

export function lerSessao(): {
  token: string;
  expires_at?: string;
  usuario?: UsuarioSessao;
} | null {
  const token = cookies.get(COOKIE_TOKEN) as string | undefined;

  if (!token) return null;

  const expires_at = cookies.get(COOKIE_EXPIRES_AT) as string | undefined;
  const usuario = parseUsuario(cookies.get(COOKIE_USUARIO));

  return { token, expires_at, usuario };
}

export function limparSessao() {
  cancelarExpiracaoLocal();
  sessaoAssumida = false;
  cookies.remove(COOKIE_TOKEN, OPCOES_COOKIE);
  cookies.remove(COOKIE_EXPIRES_AT, OPCOES_COOKIE);
  cookies.remove(COOKIE_USUARIO, OPCOES_COOKIE);
  definirAuthorization(null);
}

/**
 * Sessao nova usa `expires_at` da API. Sessao antiga (so o cookie `token`)
 * cai no `exp` do JWT, se existir; sem os dois, nao expira no cliente.
 */
export function sessaoExpirada(now = Date.now()): boolean {
  const sessao = lerSessao();

  if (!sessao) return false;

  const quando = instanteExpiracaoMs(sessao);

  if (quando === undefined) return false;

  return quando <= now;
}

/** `usuario` persistido; JWT so como fallback de sessao antiga. */
export function usuarioDaSessao(
  sessao: NonNullable<ReturnType<typeof lerSessao>>
): UsuarioSessao | undefined {
  if (sessao.usuario?.id && sessao.usuario.tipo) return sessao.usuario;

  return usuarioDoJwt(sessao.token);
}

export function aplicarBearerAtual() {
  const sessao = lerSessao();

  if (sessao?.token && !sessaoExpirada()) {
    definirAuthorization(sessao.token);
    return;
  }

  definirAuthorization(null);
}

export function encerrarSessao({ motivo }: { motivo: MotivoEncerramento }) {
  limparSessao();

  if (motivo === 'expirada' && avisoExpiracaoPendente) return;

  if (motivo === 'expirada') avisoExpiracaoPendente = true;
  else avisoExpiracaoPendente = false;

  onEncerramento?.(motivo);
}
