import React, { useState } from 'react';
import { FieldRenderer } from '../fields/FieldRenderer';
import { LayoutTemplate, Palette } from 'lucide-react';

export const SectionFieldRenderer = ({ section, contentValue, designValue, onChange }) => {
  const [activeTab, setActiveTab] = useState('content');

  const handleContentChange = (fieldKey, newValue) => {
    onChange('content', section.key, { ...contentValue, [fieldKey]: newValue });
  };

  const handleDesignChange = (fieldKey, newValue) => {
    onChange('design', section.key, { ...designValue, [fieldKey]: newValue });
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm mb-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4 gap-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {section.label}
        </h3>
        
        {/* TABS */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
          <button 
            type="button"
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'content' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" /> Content
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'design' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <Palette className="w-3.5 h-3.5" /> Design
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'content' && Array.isArray(section.contentFields) && section.contentFields.map(field => (
          <FieldRenderer key={`content-${field.key}`} field={field} value={contentValue?.[field.key]} onChange={handleContentChange} />
        ))}

        {activeTab === 'design' && Array.isArray(section.designFields) && section.designFields.map(field => (
          <FieldRenderer key={`design-${field.key}`} field={field} value={designValue?.[field.key]} onChange={handleDesignChange} />
        ))}
        
        {activeTab === 'design' && (!section.designFields || section.designFields.length === 0) && (
          <p className="text-sm text-zinc-400 italic py-6 text-center">No visual customizations available for this section yet.</p>
        )}
      </div>
    </div>
  );
};