import React from 'react';

export const FormTextarea = ({
  name,
  value,
  onChange,
  placeholder,
  minLength,
  label,
  className = ""
}) => {
  return (
    <div className="col-span-2">
      <label className="block text-gray-700 mb-1">
        {label} <span className="text-sm text-gray-500">(min {minLength} characters)</span>
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
        minLength={minLength}
      />
      <p className="text-sm text-gray-500 mt-1">{value.length}/{minLength}</p>
    </div>
  );
};