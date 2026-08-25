import React from 'react';
import TipTapEditor from '../../../components/admin/TipTapEditor';

export const RichTextField = ({ field, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <TipTapEditor 
          value={value || ''} 
          onChange={(val) => onChange(field.key, val)} 
        />
      </div>
    </div>
  );
};