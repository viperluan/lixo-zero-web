import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import InputMask from 'react-input-mask';
import { Input } from 'reactstrap';
import 'moment/locale/pt-br';
import 'react-datetime/css/react-datetime.css';

// Definindo o locale para pt-br
moment.locale('pt-br');

const DateTimePicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const currentYear = moment().year();

  const isValidDate = (current) => {
    const start = moment(`${currentYear}-10-21`);
    const end = moment(`${currentYear}-10-30`);
    return current.isBetween(start, end, 'day', '[]');
  };

  useEffect(() => {
    if (selectedDate) {
      setInputValue(selectedDate.format('DD/MM/YYYY HH:mm'));
    } else {
      setInputValue('');
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (moment.isMoment(date) && isValidDate(date)) {
      setSelectedDate(date);
      if (onDateChange) {
        onDateChange(date);
      }
    } else {
      setSelectedDate(null);
      if (onDateChange) {
        onDateChange(null);
      }
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const formattedDate = moment(value, 'DD/MM/YYYY HH:mm', true);
    if (formattedDate.isValid() && isValidDate(formattedDate)) {
      handleDateChange(formattedDate);
    } else if (value === '') {
      handleDateChange(null);
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
      {(inputProps) => <Input {...inputProps} />}
    </InputMask>
  );

  return (
    <Datetime
      value={selectedDate}
      inputProps={{ id: 'dateTime' }}
      isValidDate={isValidDate}
      onChange={handleDateChange}
      locale="pt-br"
      dateFormat="DD/MM/YYYY"
      timeFormat="HH:mm"
      renderInput={renderInput}
      initialViewDate={moment(`${currentYear}-10-21`)}
      className="w-100"
    />
  );
};

export { DateTimePicker };
