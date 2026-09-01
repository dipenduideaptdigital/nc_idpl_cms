import React from 'react';
import { Type, Mail, AlignLeft, Phone, List } from 'lucide-react';

const FieldPalette = ({ onAddField }) => {
  const availableFields = [
    { type: 'text', label: 'Single Line Text', icon: Type },
    { type: 'email', label: 'Email Address', icon: Mail },
    { type: 'phone', label: 'Phone Number', icon: Phone },
    { type: 'textarea', label: 'Paragraph Text', icon: AlignLeft },
    { type: 'select', label: 'Dropdown Select', icon: List },
  ];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Standard Fields</h3>
        <div className="grid grid-cols-1 gap-2">
          {availableFields.map((field) => (
            <button
              key={field.type}
              onClick={() => onAddField(field.type)}
              className="flex items-center gap-3 px-3 py-2.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm transition-all text-sm font-medium text-zinc-700 dark:text-zinc-300 text-left"
            >
              <field.icon className="w-4 h-4 text-blue-500" />
              {field.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldPalette;