import React from 'react';
import { templateRegistry } from '../../../templates/registry/templateRegistry';
import { SectionFieldRenderer } from '../../../templates/shared/sections/SectionFieldRenderer';

export const TemplateEditor = ({ templateKey, content, onChange }) => {
  const config = templateRegistry[templateKey]?.config;

  if (!config) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm font-medium">
        Error: Template configuration not found for key "{templateKey}".
      </div>
    );
  }
  const handleSectionDataChange = (type, sectionKey, newSectionValue) => {
    onChange({
      ...content,
      [type]: {
        ...(content?.[type] || {}),
        [sectionKey]: newSectionValue
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 px-5 py-4 rounded-2xl flex justify-between items-center transition-colors">
        <div>
          <h2 className="text-sm font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            Active Template: {config.meta.name}
          </h2>
        </div>
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800/50">
          v{config.version}
        </span>
      </div>

      <div className="space-y-6">
        {config.sections.map(section => (
          <SectionFieldRenderer
            key={section.key}
            section={section}
            contentValue={content?.content?.[section.key] || {}}
            designValue={content?.design?.[section.key] || {}}
            onChange={handleSectionDataChange}
          />
        ))}
      </div>
    </div>
  );
};