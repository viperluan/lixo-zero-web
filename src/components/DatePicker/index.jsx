import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import InputMask from 'react-input-mask';
import { Input } from 'reactstrap';
import 'moment/locale/pt-br';

moment.locale('pt-br');

const DateTimePicker = ({ field, form }) => {
  const [inputValue, setInputValue] = useState('');
  const currentYear = moment().year();
  const { name, value } = field;
  const { setFieldValue, errors, touched } = form;

  // Função para verificar se a data está no intervalo permitido
  const isValidDate = (current) => {
    const start = moment(`${currentYear}-10-18`);
    const end = moment(`${currentYear}-10-26`);
    return current.isBetween(start, end, 'day', '[]');
  };

  useEffect(() => {
    if (value) {
      setInputValue(moment(value).format('DD/MM/YYYY HH:mm'));
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleDateChange = (date) => {
    if (moment.isMoment(date) && isValidDate(date)) {
      setFieldValue(name, date);
    } else {
      setFieldValue(name, null);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const formattedDate = moment(value, 'DD/MM/YYYY HH:mm', true);
    if (formattedDate.isValid() && isValidDate(formattedDate)) {
      setFieldValue(name, formattedDate);
    } else {
      setFieldValue(name, null);
    }
  };

  const renderInput = (props, openCalendar) => (
    <InputMask
      mask="99/99/9999 99:99"
      value={inputValue}
      onChange={handleInputChange}
      onFocus={openCalendar}
      placeholder="DD/MM/YYYY HH:mm"
    >
      {(inputProps) => <Input {...inputProps} invalid={touched[name] && !!errors[name]} />}
    </InputMask>
  );

  return (
    <Datetime
      closeOnClickOutside
      renderInput={renderInput}
      value={value}
      inputProps={{ id: 'dataDaAcao' }}
      isValidDate={isValidDate}
      initialViewDate={moment(`${currentYear}-10-18`)}
      onChange={handleDateChange}
      locale="pt-br"
      dateFormat="DD/MM/YYYY"
      timeFormat="HH:mm"
      className="w-100"
    />
  );
};

export { DateTimePicker };
