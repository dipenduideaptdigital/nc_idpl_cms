import React from 'react';
import { FieldRenderer } from './FieldRenderer';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const RepeaterField = ({ field, value, onChange }) => {
  const items = Array.isArray(value) ? value : [];

  const handleAddItem = () => {
    const newItem = {};
    field.itemSchema.forEach(f => {
      newItem[f.key] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    onChange(field.key, [...items, newItem]);
  };

  const handleRemoveItem = (indexToRemove) => {
    onChange(field.key, items.filter((_, index) => index !== indexToRemove));
  };

  const handleItemChange = (index, itemFieldKey, newValue) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [itemFieldKey]: newValue };
    onChange(field.key, updatedItems);
  };

  return (
    <div className="mb-6 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
          {field.label}
        </label>
        <button type="button" onClick={handleAddItem} className="flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="relative p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm">
            <button type="button" onClick={() => handleRemoveItem(index)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-md transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">Item {index + 1}</div>
            
            <div className="space-y-3">
              {field.itemSchema.map(schemaField => (
                <FieldRenderer
                  key={schemaField.key}
                  field={schemaField}
                  value={item[schemaField.key]}
                  onChange={(key, val) => handleItemChange(index, key, val)}
                />
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-zinc-500 italic text-center py-4">No items added yet. Click "Add Item" to start.</p>
        )}
      </div>
    </div>
  );
};