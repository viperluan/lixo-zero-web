import { useEffect, useRef, useState } from 'react';
import type { FieldProps } from 'formik';
import { Clock } from 'lucide-react';
import moment, { type Moment } from '~/lib/moment';
import { HelpText, Input } from '~components/ui';
import { cn } from '~components/ui/cn';
import { diasDaSlz } from '~/lib/periodoSlz';
import { formatarDiaLongo, formatarHora } from '~/lib/acoes';

type DateTimePickerProps = FieldProps<Moment | null>;

const DIAS = diasDaSlz();

const chaveDoDia = (data: Moment) => data.format('YYYY-MM-DD');

const extrairDia = (value: Moment | null) =>
  value && moment.isMoment(value) && value.isValid() ? chaveDoDia(value) : '';

const extrairHora = (value: Moment | null) =>
  value && moment.isMoment(value) && value.isValid() ? value.format('HH:mm') : '';

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

const DateTimePicker = ({ field, form }: DateTimePickerProps) => {
  const { name, value } = field;
  const { setFieldValue, setFieldTouched, errors, touched } = form;
  const invalido = Boolean(touched[name] && errors[name]);

  const campoHora = useRef<HTMLInputElement>(null);
  const [dia, setDia] = useState(() => extrairDia(value));
  const [hora, setHora] = useState(() => extrairHora(value));

  const abrirSeletorHora = () => {
    const campo = campoHora.current;
    if (!campo) return;

    campo.focus();

    // No mesmo clique do foco o Chrome fecha o picker se abrir cedo demais.
    requestAnimationFrame(() => {
      try {
        if (typeof campo.showPicker === 'function') {
          campo.showPicker();
        }
      } catch {
        // showPicker lanca se o picker ja estiver aberto.
      }
    });
  };

  useEffect(() => {
    if (value && moment.isMoment(value) && value.isValid()) {
      const proximoDia = chaveDoDia(value);
      const proximaHora = value.format('HH:mm');

      if (proximoDia !== dia) setDia(proximoDia);
      if (proximaHora !== hora) setHora(proximaHora);
      return;
    }

    // Reset do formulario: os dois pedacos estavam preenchidos e o campo
    // voltou a null. Escolha incompleta (so dia ou so hora) tambem grava
    // null — nesse caso o estado local precisa permanecer.
    if (!value && dia && hora) {
      setDia('');
      setHora('');
    }
  }, [value, dia, hora]);

  const gravar = (proximoDia: string, proximaHora: string) => {
    setDia(proximoDia);
    setHora(proximaHora);

    if (proximoDia && proximaHora) {
      const combinado = moment(`${proximoDia} ${proximaHora}`, 'YYYY-MM-DD HH:mm', true);
      setFieldValue(name, combinado.isValid() ? combinado : null);
      return;
    }

    // Sem os dois pedacos o Formik fica null; nao validar ainda para o
    // erro de obrigatorio so aparecer no blur da hora ou no submit.
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
                  gravar(chave, hora);
                  setFieldTouched(name, true, Boolean(hora));
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

        <div className="relative max-w-[13rem]">
          <Clock
            className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-brand-forest"
            aria-hidden="true"
          />

          <Input
            ref={campoHora}
            id="dataDaAcao"
            name={name}
            type="time"
            value={hora}
            onChange={(evento) => gravar(dia, evento.target.value)}
            onBlur={() => setFieldTouched(name, true)}
            onClick={abrirSeletorHora}
            invalid={invalido}
            className={cn(
              'cursor-pointer pl-10',
              '[&::-webkit-calendar-picker-indicator]:pointer-events-none',
              '[&::-webkit-calendar-picker-indicator]:opacity-0'
            )}
          />
        </div>

        <HelpText className="mt-1.5 mb-0">Toque no campo para escolher o horário.</HelpText>
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
