import moment from 'moment';
import 'moment/locale/pt-br';

/**
 * Ponto unico de configuracao do moment.
 *
 * O locale precisa ser registrado num modulo so: quando cada tela fazia o
 * proprio `import 'moment/locale/pt-br'`, o pre-bundling do Vite resolvia o
 * arquivo de locale para uma copia separada do moment e o registro se perdia —
 * o calendario acabava renderizando os dias em ingles.
 */
moment.locale('pt-br');

export default moment;
export type { Moment } from 'moment';
