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

      {/* ---------------- Features Bar Section ---------------- */}
      <div className="pt-8 mt-8 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">Bottom Features Bar</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Customize the 4 highlight blocks that appear at the bottom of the hero section.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data.features || []).map((feature, index) => (
            <div key={index} className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/50 space-y-4">
              <h4 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-700 pb-2">Feature Block {index + 1}</h4>
              
              {/* 🛡️ Replaced raw input with ImageField */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Feature Icon</label>
                <ImageField 
                  value={feature.icon || ''} 
                  onChange={(url) => {
                    const newFeatures = [...data.features];
                    newFeatures[index].icon = url;
                    onChange('features', newFeatures);
                  }} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Top Line</label>
                  <input 
                    type="text" 
                    value={feature.title || ''} 
                    onChange={e => {
                      const newFeatures = [...data.features];
                      newFeatures[index].title = e.target.value;
                      onChange('features', newFeatures);
                    }} 
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Bottom Line</label>
                  <input 
                    type="text" 
                    value={feature.subtitle || ''} 
                    onChange={e => {
                      const newFeatures = [...data.features];
                      newFeatures[index].subtitle = e.target.value;
                      onChange('features', newFeatures);
                    }} 
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-2 pt-2">
                <input 
                  type="checkbox" 
                  checked={feature.titleBold || false} 
                  onChange={e => {
                    const newFeatures = [...data.features];
                    newFeatures[index].titleBold = e.target.checked;
                    onChange('features', newFeatures);
                  }} 
                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600" 
                />
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Make Top Line Bold (Instead of Bottom Line)</span>
              </label>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HeroCustomization;