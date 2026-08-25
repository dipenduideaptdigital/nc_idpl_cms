import React from 'react';
import AdminImageField from '../../../components/admin/ImageField';

export const ImageFieldWrapper = ({ field, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <AdminImageField 
        value={value || ''} 
        onChange={(val) => onChange(field.key, val)} 
      />
    </div>
  );
};