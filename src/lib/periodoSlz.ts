import moment, { type Moment } from '~/lib/moment';

/** Ano da edicao vigente da Semana Lixo Zero. */
export const ANO_SLZ = 2026;

export const INICIO_SLZ = moment(`${ANO_SLZ}-11-07`);
export const FIM_SLZ = moment(`${ANO_SLZ}-11-15`);

export const rotuloPeriodoSlz = `Entre 7 e 15 de novembro de ${ANO_SLZ}.`;

export const mensagemDataForaDoPeriodo = `A data deve estar entre 7 e 15 de novembro de ${ANO_SLZ}.`;

/** Os 9 dias da programacao, um Moment por dia. */
export const diasDaSlz = (): Moment[] => {
  const dias: Moment[] = [];
  const cursor = INICIO_SLZ.clone();
  const fim = FIM_SLZ.clone();

  while (cursor.isSameOrBefore(fim, 'day')) {
    dias.push(cursor.clone());
    cursor.add(1, 'day');
  }

  return dias;
};

/** Mesma regra do Yup: inclusivo, comparado so pelo dia. */
export const estaNoPeriodoSlz = (value?: Date | Moment | string | null) => {
  if (!value) return false;

  return moment(value).isBetween(INICIO_SLZ, FIM_SLZ, 'day', '[]');
};
