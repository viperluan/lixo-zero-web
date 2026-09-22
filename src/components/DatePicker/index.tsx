import { useEffect, useState } from 'react';
import type { FieldProps } from 'formik';
import moment, { type Moment } from '~/lib/moment';
import { HelpText, Select } from '~components/ui';
import { cn } from '~components/ui/cn';
import { diasDaSlz } from '~/lib/periodoSlz';
import { formatarDiaLongo, formatarHora } from '~/lib/acoes';

type DateTimePickerProps = FieldProps<Moment | null>;

const DIAS = diasDaSlz();
const HORAS = Array.from({ length: 24 }, (_, indice) => String(indice).padStart(2, '0'));
const MINUTOS = Array.from({ length: 60 }, (_, indice) => String(indice).padStart(2, '0'));

const chaveDoDia = (data: Moment) => data.format('YYYY-MM-DD');

const extrairDia = (value: Moment | null) =>
  value && moment.isMoment(value) && value.isValid() ? chaveDoDia(value) : '';

const extrairHora = (value: Moment | null) =>
  value && moment.isMoment(value) && value.isValid() ? value.format('HH') : '';

const extrairMinuto = (value: Moment | null) =>
  value && moment.isMoment(value) && value.isValid() ? value.format('mm') : '';

const juntarHorario = (hora: string, minuto: string) =>
  hora && minuto ? `${hora}:${minuto}` : '';

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

const DateTimePicker = ({ field, form }: DateTimePickerProps) => {
  const { name, value } = field;
  const { setFieldValue, setFieldTouched, errors, touched } = form;
  const invalido = Boolean(touched[name] && errors[name]);

  const [dia, setDia] = useState(() => extrairDia(value));
  const [hora, setHora] = useState(() => extrairHora(value));
  const [minuto, setMinuto] = useState(() => extrairMinuto(value));

  const horario = juntarHorario(hora, minuto);

  useEffect(() => {
    if (value && moment.isMoment(value) && value.isValid()) {
      const proximoDia = chaveDoDia(value);
      const proximaHora = value.format('HH');
      const proximoMinuto = value.format('mm');

      if (proximoDia !== dia) setDia(proximoDia);
      if (proximaHora !== hora) setHora(proximaHora);
      if (proximoMinuto !== minuto) setMinuto(proximoMinuto);
      return;
    }

    // Reset do formulario: os tres pedacos estavam preenchidos e o campo
    // voltou a null. Escolha incompleta tambem grava null — nesse caso o
    // estado local precisa permanecer.
    if (!value && dia && hora && minuto) {
      setDia('');
      setHora('');
      setMinuto('');
    }
  }, [value, dia, hora, minuto]);

  const gravar = (proximoDia: string, proximaHora: string, proximoMinuto: string) => {
    setDia(proximoDia);
    setHora(proximaHora);
    setMinuto(proximoMinuto);

    const proximoHorario = juntarHorario(proximaHora, proximoMinuto);

    if (proximoDia && proximoHorario) {
      const combinado = moment(`${proximoDia} ${proximoHorario}`, 'YYYY-MM-DD HH:mm', true);
      setFieldValue(name, combinado.isValid() ? combinado : null);
      return;
    }

    setFieldValue(name, null, false);
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs text-gray-500">Dia da ação</p>

        <div
          role="radiogroup"
          aria-label="Dia da ação"
          className="grid grid-cols-3 gap-2 sm:grid-cols-9"
        >
          {DIAS.map((diaMoment) => {
            const chave = chaveDoDia(diaMoment);
            const selecionado = dia === chave;

            return (
              <button
                key={chave}
                type="button"
                role="radio"
                aria-checked={selecionado}
                onClick={() => {
                  gravar(chave, hora, minuto);
                  setFieldTouched(name, true, Boolean(horario));
                }}
                className={cn(
                  'flex flex-col items-center rounded-xl border px-2 py-2.5 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-brand-forest/30',
                  selecionado
                    ? 'border-brand-forest bg-brand-forest text-white'
                    : 'border-brand-leaf/40 bg-white text-brand-dark hover:bg-brand-sage/20'
                )}
              >
                <span className="label-condensed text-[0.625rem] uppercase leading-none">
                  {diaMoment.format('ddd')}
                </span>
                <span className="mt-1 text-lg font-black leading-none">
                  {diaMoment.format('DD')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs text-gray-500">Horário</p>

        <div className="flex max-w-sm items-center gap-2">
          <Select
            id="dataDaAcao"
            aria-label="Hora"
            value={hora}
            onChange={(evento) => gravar(dia, evento.target.value, minuto)}
            onBlur={() => setFieldTouched(name, true)}
            invalid={invalido}
          >
            <option value="">Hora</option>
            {HORAS.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </Select>

          <span className="text-lg font-semibold text-brand-forest" aria-hidden="true">
            :
          </span>

          <Select
            aria-label="Minuto"
            value={minuto}
            onChange={(evento) => gravar(dia, hora, evento.target.value)}
            onBlur={() => setFieldTouched(name, true)}
            invalid={invalido}
          >
            <option value="">Min</option>
            {MINUTOS.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </Select>
        </div>

        <HelpText className="mt-1.5 mb-0">Escolha a hora e o minuto.</HelpText>
      </div>

      {value && moment.isMoment(value) && value.isValid() && (
        <p className="text-sm font-medium text-brand-forest" aria-live="polite">
          {capitalizar(formatarDiaLongo(value.toDate()))}, às {formatarHora(value.toDate())}
        </p>
      )}
    </div>
  );
};

export { DateTimePicker };
