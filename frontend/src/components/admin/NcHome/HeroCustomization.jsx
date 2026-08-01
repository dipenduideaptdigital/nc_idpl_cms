import React from 'react';
import ImageField from '../ImageField';

const HeroCustomization = ({ data, onChange }) => {

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-100 pb-4 mb-4">
        <h2 className="text-xl font-bold text-zinc-800">Hero Section</h2>
        <p className="text-sm text-zinc-500 mt-1">Customize the top banner of the NatureCube homepage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Title Line 1</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
            value={data.titleLine1 || ''} 
            onChange={e => onChange('titleLine1', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Title Line 2</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
            value={data.titleLine2 || ''} 
            onChange={e => onChange('titleLine2', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Sub Headline</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
            value={data.subHeadline || ''} 
            onChange={e => onChange('subHeadline', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Italic Word</label>
          <input 
            type="text" 
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" 
            value={data.italicWord || ''} 
            onChange={e => onChange('italicWord', e.target.value)} 
          />
        </div>
      </div>

      <div className="pt-4">
        <label className="block text-sm font-semibold text-zinc-700 mb-2">Background Image</label>
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