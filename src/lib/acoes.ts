import moment from '~/lib/moment';

/**
 * Item de `GET /acoes` (chave `actions`).
 *
 * Atencao aos campos traduzidos: `situacao_acao`, `forma_realizacao_acao` e
 * `tipo_publico_acao` chegam como TEXTO em portugues ('Aprovada',
 * 'Presencial'), enquanto os filtros da query esperam os CODIGOS ('1').
 *
 * Para anonimo e usuario comum a API sanitiza a saida: `celular` some e
 * `usuario_responsavel` fica so com `nome` — por isso os campos opcionais.
 */
export type Acao = {
  id: string;
  titulo_acao: string;
  descricao_acao: string;
  data_acao: string;
  nome_organizador: string;
  celular?: string;
  forma_realizacao_acao: string;
  situacao_acao: string;
  nome_local_acao: string;
  endereco_local_acao: string;
  informacoes_acao: string;
  link_divulgacao_acesso_acao: string;
  link_para_inscricao_acao: string;
  numero_organizadores_acao: number;
  categoria?: { descricao?: string };
  usuario_responsavel?: { nome?: string; email?: string };
};

export type RespostaListaAcoes = {
  actions?: Acao[];
  totalPages?: number;
  currentPage?: number;
};

export type GrupoDeAcoes = {
  chave: string;
  data: Date;
  acoes: Acao[];
};

/** Qualquer listagem cronologica passa por aqui. */
export const ordenarPorData = (acoes: Acao[]): Acao[] =>
  [...acoes].sort((a, b) => new Date(a.data_acao).getTime() - new Date(b.data_acao).getTime());

/** Espera a lista ja ordenada — o Map preserva a ordem de insercao. */
export const agruparPorDia = (acoes: Acao[]): GrupoDeAcoes[] => {
  const grupos = new Map<string, GrupoDeAcoes>();

  acoes.forEach((acao) => {
    const chave = moment(acao.data_acao).format('YYYY-MM-DD');
    const grupo = grupos.get(chave);

    if (grupo) {
      grupo.acoes.push(acao);
      return;
    }

    grupos.set(chave, {
      chave,
      data: moment(acao.data_acao).startOf('day').toDate(),
      acoes: [acao],
    });
  });

  return [...grupos.values()];
};

export const formatarHora = (data: Date | string) => moment(data).format('HH:mm');

/** 'sábado, 17 de outubro' — o locale pt-br vem de `~/lib/moment`. */
export const formatarDiaLongo = (data: Date | string) => moment(data).format('dddd, D [de] MMMM');

/** Numero e mes curto do chip de data: { dia: '17', mes: 'out' }. */
export const formatarChipDeData = (data: Date | string) => ({
  dia: moment(data).format('DD'),
  mes: moment(data).format('MMM'),
});

export const ehFutura = (acao: Acao, referencia: Date = new Date()) =>
  new Date(acao.data_acao).getTime() >= referencia.getTime();

/**
 * A API devolve `nome_local_acao` vazio para acoes online; o rotulo substituto
 * evita um icone de localizacao apontando para nada.
 */
export const obterLocalAcao = (acao: Acao) =>
  acao.nome_local_acao?.trim() ||
  (acao.forma_realizacao_acao === 'Online' ? 'Transmissão online' : '');
