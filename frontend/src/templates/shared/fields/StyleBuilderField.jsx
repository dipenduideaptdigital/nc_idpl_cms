import React from 'react';
import { CustomCssControl } from './style-builder/CustomCssControl';
import { Palette } from 'lucide-react';

export const StyleBuilderField = ({ field, value, onChange }) => {
  const styles = value || {};

  const handleStyleChange = (styleCategory, newStyleValue) => {
    onChange(field.key, { ...styles, [styleCategory]: newStyleValue });
  };

  return (
    <div className="mb-6 p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <Palette className="w-4 h-4 text-blue-500" />
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          {field.label}
        </h4>
      </div>

      {/* Passed 'field' down to access the cheatsheet data */}
      <CustomCssControl 
        field={field} 
        value={styles.customCss} 
        onChange={(val) => handleStyleChange('customCss', val)} 
      />
    </div>
  );
};