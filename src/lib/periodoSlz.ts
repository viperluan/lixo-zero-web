import moment, { type Moment } from '~/lib/moment';

/**
 * Parseia `YYYY-MM-DD` como data civil local.
 *
 * `new Date("2026-11-07")` cai em UTC e vira dia 6 no Brasil — não use.
 */
export const parseDataCivil = (yyyyMmDd: string) => moment(yyyyMmDd, 'YYYY-MM-DD', true);

/** Dia civil local do usuário (Brasil), no formato que a API espera nos filtros. */
export const hojeCivil = () => moment().format('YYYY-MM-DD');

export const primeiroDiaDoAno = (ano: number) => `${ano}-01-01`;

export const ultimoDiaDoAno = (ano: number) => `${ano}-12-31`;

export const mensagemDatasDoAno = (ano: number) =>
  `As datas da edição precisam pertencer ao ano ${ano}.`;

/** Vazio não conta como fora do ano — o campo ainda não foi preenchido. */
export const pertenceAoAno = (yyyyMmDd: string, ano: number) => {
  if (!yyyyMmDd) return true;

  const data = parseDataCivil(yyyyMmDd);

  return data.isValid() && data.year() === ano;
};

export const recortarDataDoAno = (yyyyMmDd: string, ano: number) =>
  pertenceAoAno(yyyyMmDd, ano) ? yyyyMmDd : '';

export const formatarDataCivil = (yyyyMmDd: string, formato = 'DD/MM/YYYY') => {
  const data = parseDataCivil(yyyyMmDd);

  return data.isValid() ? data.format(formato) : yyyyMmDd;
};

/**
 * "7 a 15 de novembro de 2026" quando o mês coincide; amplia mês/ano se não.
 */
export const rotuloPeriodo = (inicio: string, fim: string) => {
  const a = parseDataCivil(inicio);
  const b = parseDataCivil(fim);

  if (!a.isValid() || !b.isValid()) return `${inicio} a ${fim}`;

  if (a.isSame(b, 'month')) {
    return `${a.format('D')} a ${b.format('D [de] MMMM [de] YYYY')}`;
  }

  if (a.isSame(b, 'year')) {
    return `${a.format('D [de] MMMM')} a ${b.format('D [de] MMMM [de] YYYY')}`;
  }

  return `${a.format('D [de] MMMM [de] YYYY')} a ${b.format('D [de] MMMM [de] YYYY')}`;
};

export const rotuloPeriodoSlz = (inicio: string, fim: string) =>
  `Entre ${rotuloPeriodo(inicio, fim)}.`;

export const mensagemDataForaDoPeriodo = (inicio: string, fim: string) =>
  `A data deve estar entre ${rotuloPeriodo(inicio, fim)}.`;

export const dataPorExtenso = (yyyyMmDd: string) =>
  formatarDataCivil(yyyyMmDd, 'D [de] MMMM [de] YYYY');

export const mensagemPrazoCadastro = (fim: string) =>
  `O cadastro desta edição vai até ${formatarDataCivil(fim)}.`;

export const mensagemPeriodoRealizacao = (inicio: string, fim: string) =>
  `A ação precisa ocorrer entre ${rotuloPeriodo(inicio, fim)}.`;

/** Tela de cadastro fechado: prazo no passado, sem repetir a regra do campo. */
export const mensagemPrazoInscricaoEncerrado = (inicio: string, fim: string) => {
  const a = parseDataCivil(inicio);
  const b = parseDataCivil(fim);

  if (a.isValid() && b.isValid() && a.isSame(b, 'day')) {
    return `O prazo terminou em ${dataPorExtenso(fim)}.`;
  }

  return `O prazo foi de ${rotuloPeriodo(inicio, fim)}.`;
};

export const mensagemPrazoInscricaoFuturo = (inicio: string, fim: string) =>
  `O prazo é de ${rotuloPeriodo(inicio, fim)}.`;

export const mensagemPrazoInscricaoPausado = (fim: string) =>
  `O prazo vai até ${dataPorExtenso(fim)}.`;

export const mensagemPeriodoAcoesEdicao = (inicio: string, fim: string) =>
  `As ações desta edição acontecem de ${rotuloPeriodo(inicio, fim)}.`;

export const diasDoPeriodo = (inicio: string, fim: string): Moment[] => {
  const dias: Moment[] = [];
  const cursor = parseDataCivil(inicio);
  const ultimo = parseDataCivil(fim);

  if (!cursor.isValid() || !ultimo.isValid()) return dias;

  while (cursor.isSameOrBefore(ultimo, 'day')) {
    dias.push(cursor.clone());
    cursor.add(1, 'day');
  }

  return dias;
};

/** Inclusivo, comparado só pelo dia — mesma regra do Yup do formulário. */
export const estaNoPeriodo = (
  value: Date | Moment | string | null | undefined,
  inicio: string,
  fim: string
) => {
  if (!value) return false;

  return moment(value).isBetween(parseDataCivil(inicio), parseDataCivil(fim), 'day', '[]');
};
