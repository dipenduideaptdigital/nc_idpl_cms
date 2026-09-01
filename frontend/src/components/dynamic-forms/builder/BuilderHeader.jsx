import React from 'react';
import { Save, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BuilderHeader = ({ formState, updateFormState, handleSave, isSaving }) => {
  return (
    <div className="h-[72px] px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <Link to="/admin/forms" className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col justify-center">
          <input 
            type="text" 
            value={formState.title}
            onChange={(e) => updateFormState('title', e.target.value)}
            className="text-lg font-bold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 w-64 text-zinc-900 dark:text-white"
            placeholder="Form Title"
          />
          <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 px-2 mt-0.5">
            <span className="font-mono">slug: /</span>
            <input 
              type="text" 
              value={formState.slug} 
              onChange={(e) => updateFormState('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              className="bg-transparent border-b border-dashed border-zinc-300 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none w-48 font-mono ml-0.5 pb-0.5 transition-colors"
              placeholder="auto-generated"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => handleSave('DRAFT')}
          disabled={isSaving}
          className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Save Draft
        </button>
        <button 
          onClick={() => handleSave('PUBLISHED')}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Publish
        </button>
      </div>
    </div>
  );
};

export default BuilderHeader;