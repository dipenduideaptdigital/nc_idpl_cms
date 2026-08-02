import React from 'react';
import ImageField from '../ImageField';

const HeroCustomization = ({ data, onChange }) => {

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4 transition-colors duration-300">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Hero Section</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 transition-colors duration-300">Customize the top banner of the NatureCube homepage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Title Line 1</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm" 
            value={data.titleLine1 || ''} 
            onChange={e => onChange('titleLine1', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Title Line 2</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm" 
            value={data.titleLine2 || ''} 
            onChange={e => onChange('titleLine2', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Sub Headline</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm" 
            value={data.subHeadline || ''} 
            onChange={e => onChange('subHeadline', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Italic Word</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-sm" 
            value={data.italicWord || ''} 
            onChange={e => onChange('italicWord', e.target.value)} 
          />
        </div>
      </div>

      <div className="pt-4">
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 transition-colors duration-300">Background Image</label>
        <div className="max-w-md">
          <ImageField 
            value={data.backgroundImage || ''} 
            onChange={(url) => onChange('backgroundImage', url)} 
          />
        </div>
      </div>
    </div>
  );
};

export default HeroCustomization;