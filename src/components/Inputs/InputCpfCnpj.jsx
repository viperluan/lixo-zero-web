import React from 'react';
import { Input } from 'reactstrap';

const InputCpfCnpj = ({ value, onChange, ...props }) => {
  const applyDisplayMask = (rawValue) => {
    const onlyNums = rawValue.slice(0, 13); // limita o máximo de dígitos
    if (onlyNums.length <= 11) {
      return onlyNums.replace(
        /(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/,
        (_, $1, $2, $3, $4) =>
          `${$1}${$2 ? '.' + $2 : ''}${$3 ? '.' + $3 : ''}${$4 ? '-' + $4 : ''}`
      );
    } else {
      return onlyNums.replace(
        /(\d{2})(\d{1,3})?(\d{1,3})?(\d{1,4})?(\d{1,2})?/,
        (_, $1, $2, $3, $4, $5) =>
          `${$1}${$2 ? '.' + $2 : ''}${$3 ? '.' + $3 : ''}${$4 ? '/' + $4 : ''}${$5 ? '-' + $5 : ''}`
      );
    }
  };

  const handleChange = (e) => {
    const nonMaskedValue = e.target.value.replace(/\D/g, '');
    onChange(nonMaskedValue); // Passa apenas números para o handler externo
  };

  return <Input {...props} type="text" value={applyDisplayMask(value)} onChange={handleChange} />;
};

export { InputCpfCnpj };
