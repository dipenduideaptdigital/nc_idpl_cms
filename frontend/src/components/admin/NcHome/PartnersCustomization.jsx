import React from 'react';
import { Type, Users, Link as LinkIcon } from 'lucide-react';
import TipTapEditor from '../TipTapEditor';
import ImageField from '../ImageField';

const PartnersCustomization = ({ data, setData }) => {
  
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (index, url) => {
    setData(prev => {
      const newLogos = [...(prev.partnerLogos || [])];
      newLogos[index] = url;
      return { ...prev, partnerLogos: newLogos };
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Typography Fields */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <Type className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Main Content</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Main Title (Bold)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.mainTitle1 || ''} 
              onChange={e => handleChange('mainTitle1', e.target.value)} 
              placeholder="e.g. Our Trusted"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Italic Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.italicTitle || ''} 
              onChange={e => handleChange('italicTitle', e.target.value)} 
              placeholder="e.g. Partners"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Headline</label>
            <TipTapEditor 
              value={data.headline || ''} 
              onChange={html => handleChange('headline', html)} 
              placeholder="Enter headline here (e.g., We partner with the best...)"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Paragraph</label>
            <TipTapEditor 
              value={data.paragraph || ''} 
              onChange={html => handleChange('paragraph', html)} 
              placeholder="Enter detailed description here..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Button Text</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.buttonText || ''} 
              onChange={e => handleChange('buttonText', e.target.value)} 
              placeholder="e.g. READ MORE"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Button Link</label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input 
                type="text" 
                className="w-full pl-11 pr-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
                value={data.buttonLink || ''} 
                onChange={e => handleChange('buttonLink', e.target.value)} 
                placeholder="e.g. /about"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Partner Logos Grid */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <Users className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Partner Logos (Max 6)</h3>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 transition-colors duration-300">
            Upload up to 6 partner logos. First 3 will appear in the left column, next 3 in the right column (staggered).
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map(idx => (
              <div key={idx} className="border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl bg-zinc-50/30 dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3 text-center transition-colors duration-300">
                  Logo {idx + 1}
                </label>
                
                <ImageField 
                  value={data.partnerLogos?.[idx] || ''} 
                  onChange={(url) => handleLogoChange(idx, url)} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default PartnersCustomization;