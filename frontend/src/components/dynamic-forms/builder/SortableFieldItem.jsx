import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Copy } from 'lucide-react';

const SortableFieldItem = ({ field, isActive, onSelect, onRemove, onDuplicate }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative'
  };

  return (
    <div 
      ref={setNodeRef} style={style} onClick={onSelect}
      className={`bg-white dark:bg-zinc-900 border rounded-xl p-4 cursor-pointer transition-colors ${
        isActive ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
      }`}
    >
      <div className={`absolute top-2 right-2 flex items-center gap-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover/canvas:hover:opacity-100'}`}>
        
        {/* DUPLICATE BUTTON */}
        <button 
          onClick={(e) => { e.stopPropagation(); onDuplicate(field.id); }} 
          className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
          title="Duplicate Field"
        >
          <Copy className="w-4 h-4" />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(field.id); }} 
          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
          title="Remove Field"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        
        <div {...attributes} {...listeners} className="p-1.5 text-zinc-400 cursor-grab active:cursor-grabbing hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 pointer-events-none">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <input type="text" placeholder={field.placeholder || ""} readOnly className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 text-sm pointer-events-none" />
    </div>
  );
};

export default SortableFieldItem;