import { label } from 'framer-motion/client';
import React from 'react';

export const FormInput = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  className = "",
  min,
  maxLength,
  ...props
}) => {
  return (
    <>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
        min={min}
        maxLength={maxLength}
        {...props}
      />
    </>
  );
};