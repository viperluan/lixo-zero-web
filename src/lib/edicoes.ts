import api, { mensagemErroApi } from '~/api';

/**
 * Edição anual da Semana Lixo Zero (`GET /edicoes/vigente`, `GET /edicoes`).
 *
 * Datas de cadastro e realização são civis `YYYY-MM-DD` no fuso da API
 * (`America/Sao_Paulo`). `cadastro_aberto` já vem calculado — não refaça a
 * conta no cliente com `new Date()`.
 */
export type Edicao = {
  id: string;
  ano: number;
  data_inicio_cadastro: string;
  data_fim_cadastro: string;
  data_inicio_realizacao: string;
  data_fim_realizacao: string;
  inscricoes_abertas: boolean;
  cadastro_aberto: boolean;
  vigente: boolean;
};

export type Prorrogacao = {
  id: string;
  data_fim_cadastro_anterior: string;
  data_fim_cadastro_nova: string;
  prorrogada_em: string;
  id_usuario: string;
  nome_usuario: string;
};

export type EdicaoDetalhe = Edicao & {
  prorrogacoes: Prorrogacao[];
};

export type RespostaListaEdicoes = {
  editions?: Edicao[];
};

export type CorpoCriarEdicao = {
  ano: number;
  data_inicio_cadastro: string;
  data_fim_cadastro: string;
  data_inicio_realizacao: string;
  data_fim_realizacao: string;
  inscricoes_abertas: boolean;
  vigente: boolean;
};

export type CorpoAjustarEdicao = {
  data_inicio_cadastro?: string;
  data_fim_cadastro?: string;
  data_inicio_realizacao?: string;
  data_fim_realizacao?: string;
};

export const ERRO_FIM_CADASTRO_SO_PRORROGACAO =
  'A data final do cadastro só pode ser alterada pela prorrogação.';

export const buscarEdicaoVigente = () =>
  api.get<Edicao>('/edicoes/vigente', { silenciarErro: true });

export const listarEdicoes = () => api.get<RespostaListaEdicoes>('/edicoes');

export const buscarEdicao = (id: string) => api.get<EdicaoDetalhe>(`/edicoes/${id}`);

export const criarEdicao = (corpo: CorpoCriarEdicao) => api.post<Edicao>('/edicoes', corpo);

export const prorrogarEdicao = (id: string, data_fim_cadastro: string) =>
  api.put<Edicao>(`/edicoes/${id}/prorrogar`, { data_fim_cadastro });

export const alterarInscricoes = (id: string, inscricoes_abertas: boolean) =>
  api.put<Edicao>(`/edicoes/${id}/inscricoes`, { inscricoes_abertas });

export const tornarEdicaoVigente = (id: string) => api.put<Edicao>(`/edicoes/${id}/vigente`);

export const ajustarEdicao = (id: string, corpo: CorpoAjustarEdicao) =>
  api.put<Edicao>(`/edicoes/${id}`, corpo);

/**
 * `200` vem vazio (`Content-Length: 0`). O axios não estoura: o parse de JSON
 * vazio falha em silêncio e `data` fica string vazia — não trate como objeto.
 */
export const excluirEdicao = (id: string) => api.delete(`/edicoes/${id}`);

export const erroEdicao = (data: unknown) => mensagemErroApi(data);
