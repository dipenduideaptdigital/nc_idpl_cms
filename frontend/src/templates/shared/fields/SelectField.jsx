import React from 'react';

export const SelectField = ({ field, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value || field.defaultValue || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
        className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors sm:text-sm cursor-pointer"
      >
        <option value="" disabled>Select an option</option>
        {field.options?.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};