import React from 'react';

export const TextField = ({ field, value, onChange, disabled, hasError }) => {
  return (
    <>
      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide nc-field-label">
        {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        name={field.key}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        required={field.required}
        placeholder={field.placeholder || ''}
        disabled={disabled}
        className={`w-full border rounded-lg px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-all disabled:opacity-50 nc-input ${
          hasError 
            ? 'border-red-400 focus:ring-2 focus:ring-red-400/50 bg-red-50' 
            : 'border-zinc-200 focus:ring-2 focus:ring-[#7BA641]/50 bg-zinc-50'
        }`}
      />
    </>
  );
};