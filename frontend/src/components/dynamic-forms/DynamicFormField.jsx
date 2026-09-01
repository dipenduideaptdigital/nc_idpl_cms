import React from 'react';
import { FieldRegistry } from './registry';
import { AlertCircle } from 'lucide-react';

export const DynamicFormField = ({ field, value, error, onChange, disabled }) => {
  const registryEntry = FieldRegistry[field.type];

  if (!registryEntry) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[DynamicForm] Unsupported field type: ${field.type}`);
      return (
        <div className="p-3 bg-amber-50 text-amber-800 text-xs border border-amber-200 rounded-md">
          ⚠️ Unsupported field type: <strong>{field.type}</strong>
        </div>
      );
    }
    return null; // Silent fail in production
  }

  const Component = registryEntry.component;

  return (
    <div className="flex flex-col gap-1.5 w-full nc-field-group">
      <Component 
        field={field} 
        value={value} 
        onChange={onChange} 
        disabled={disabled} 
        hasError={!!error}
      />
      {error && (
        <span className="text-red-500 text-[11px] font-medium flex items-center gap-1 mt-0.5 animate-in fade-in">
          <AlertCircle className="w-3 h-3" /> {error}
        </span>
      )}
    </div>
  );
};