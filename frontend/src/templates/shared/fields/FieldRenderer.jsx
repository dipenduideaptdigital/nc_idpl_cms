import React from 'react';
import { fieldRegistry } from './registry';

export const FieldRenderer = ({ field, value, onChange }) => {
  const Component = fieldRegistry[field.type];
  
  if (!Component) {
    return (
      <div className="p-3 bg-red-50 text-red-500 text-sm border border-red-200 rounded-lg mb-4">
        Unknown field type: <strong>{field.type}</strong>
      </div>
    );
  }

  return <Component field={field} value={value} onChange={onChange} />;
};