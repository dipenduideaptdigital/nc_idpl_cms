import React from 'react';
import { Settings, X } from 'lucide-react';

const FieldProperties = ({ activeFieldId, setActiveFieldId, fields, updateActiveField, settings, updateSettings }) => {
  
  if (!activeFieldId) {
    return (
      <div className="p-6 space-y-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-500" /> Form Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1.5">Submit Button Text</label>
            <input 
              type="text" 
              value={settings.submitButton?.text || ''} 
              onChange={(e) => updateSettings('submitButton', { ...settings.submitButton, text: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1.5">Success Message</label>
            <textarea 
              rows="3"
              value={settings.successAction?.message || ''} 
              onChange={(e) => updateSettings('successAction', { ...settings.successAction, message: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-sm resize-none focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
  }

  // Active Field Settings
  const activeField = fields.find(f => f.id === activeFieldId);
  if (!activeField) return null;

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
      
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          Field Options
          <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">{activeField.type}</span>
        </h3>
        
        <button 
          onClick={() => setActiveFieldId(null)}
          className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
          title="Back to Form Settings"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1.5">Label</label>
          <input 
            type="text" 
            value={activeField.label} 
            onChange={(e) => updateActiveField('label', e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1.5">Data Key (Unique)</label>
          <input 
            type="text" 
            value={activeField.key} 
            onChange={(e) => updateActiveField('key', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-blue-500 font-mono text-[11px]"
          />
          <p className="text-[10px] text-zinc-400 mt-1">Used for the API payload. No spaces allowed.</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1.5">Placeholder</label>
          <input 
            type="text" 
            value={activeField.placeholder || ''} 
            onChange={(e) => updateActiveField('placeholder', e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {activeField.type === 'select' && (
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1.5">Dropdown Options</label>
            <textarea 
              rows="3"
              value={Array.isArray(activeField.options) ? activeField.options.join(', ') : (activeField.options || '')} 
              onChange={(e) => {
                const optionsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                updateActiveField('options', optionsArray.length > 0 ? optionsArray : e.target.value);
              }}
              placeholder="e.g. Interior Design, Landscape, Consultation"
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-blue-500 resize-y"
            />
            <p className="text-[10px] text-zinc-400 mt-1">Separate options with commas.</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
            <input 
              type="checkbox" 
              checked={activeField.required} 
              onChange={(e) => updateActiveField('required', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Required Field</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FieldProperties;