import React from 'react';

export const FormSelect = ({
  name,
  value,
  onChange,
  options = [],
  placeholder,
  className = ""
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};