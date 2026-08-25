import React from 'react';
import { templateRegistry } from '../../../templates/registry/templateRegistry';

export const TemplatePicker = ({ onSelect, onCancelLegacy }) => {
  // Extract all template configurations from the registry
  const templates = Object.values(templateRegistry).map(t => t.config);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Choose a Template</h2>
          <p className="text-sm text-zinc-500 mt-1">Select a predefined structure for your new page.</p>
        </div>
        {onCancelLegacy && (
          <button 
            type="button"
            onClick={onCancelLegacy} 
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Use Legacy Block Builder
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(config => (
          <div 
            key={config.key} 
            className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-zinc-900 group flex flex-col"
            onClick={() => onSelect(config)}
          >
            <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden shrink-0 border-b border-zinc-200 dark:border-zinc-800">
              {config.meta.thumbnail ? (
                <img 
                  src={config.meta.thumbnail} 
                  alt={config.meta.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-medium">No Preview</div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                {config.meta.category}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight">
                {config.meta.name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {config.meta.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
