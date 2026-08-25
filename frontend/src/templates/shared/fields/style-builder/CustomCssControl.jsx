import React from 'react';
import { Code, Info } from 'lucide-react';

export const CustomCssControl = ({ field, value, onChange }) => {
  const cheatSheet = field?.cssCheatSheet || '';

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5" /> {field?.label || 'Custom CSS'}
        </label>
      </div>

      {/* CSS Cheat Sheet Section */}
      {cheatSheet && (
        <details className="mb-3 group">
          <summary className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 cursor-pointer flex items-center gap-1 hover:underline select-none">
            <Info className="w-3.5 h-3.5" /> View Targetable Classes (Cheat Sheet)
          </summary>
          <pre className="mt-2 p-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] text-zinc-600 dark:text-zinc-400 font-mono overflow-x-auto whitespace-pre-wrap select-all">
            {cheatSheet}
          </pre>
        </details>
      )}

      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/* Write your CSS overrides here */"
        className="w-full h-96 px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm transition-colors resize-y"
        spellCheck="false"
      />
    </div>
  );
};