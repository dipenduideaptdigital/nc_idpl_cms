import React from 'react';

export const SelectField = ({ field, value, onChange, disabled, hasError }) => {
  const optionsList = Array.isArray(field.options) 
    ? field.options 
    : (typeof field.options === 'string' ? field.options.split(',').map(o => o.trim()).filter(Boolean) : []);

  return (
    <>
      <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide nc-field-label">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={field.key}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        required={field.required}
        disabled={disabled}
        className={`w-full border rounded-md px-4 py-3 text-sm text-zinc-900 focus:outline-none transition-all disabled:opacity-50 cursor-pointer appearance-none nc-input ${
          hasError 
            ? 'border-red-400 focus:ring-2 focus:ring-red-400/50 bg-red-50/30' 
            : 'border-zinc-200 focus:ring-2 focus:ring-[#7BA641]/50 bg-zinc-50/50'
        }`}
      >
        <option value="" disabled hidden>{field.placeholder || 'Select an option'}</option>
        {optionsList.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
    </>
  );
};