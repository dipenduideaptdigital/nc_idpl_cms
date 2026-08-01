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
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
          <Type className="w-5 h-5 text-zinc-700" />
          <h3 className="text-lg font-semibold text-zinc-800">Main Content</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Main Title (Bold)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
              value={data.mainTitle1 || ''} 
              onChange={e => handleChange('mainTitle1', e.target.value)} 
              placeholder="e.g. Our Trusted"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Italic Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
              value={data.italicTitle || ''} 
              onChange={e => handleChange('italicTitle', e.target.value)} 
              placeholder="e.g. Partners"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Headline</label>
            <TipTapEditor 
              value={data.headline || ''} 
              onChange={html => handleChange('headline', html)} 
              placeholder="Enter headline here (e.g., We partner with the best...)"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Paragraph</label>
            <TipTapEditor 
              value={data.paragraph || ''} 
              onChange={html => handleChange('paragraph', html)} 
              placeholder="Enter detailed description here..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Button Text</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
              value={data.buttonText || ''} 
              onChange={e => handleChange('buttonText', e.target.value)} 
              placeholder="e.g. READ MORE"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Button Link</label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                className="w-full pl-11 pr-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
                value={data.buttonLink || ''} 
                onChange={e => handleChange('buttonLink', e.target.value)} 
                placeholder="e.g. /about"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Partner Logos Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
          <Users className="w-5 h-5 text-zinc-700" />
          <h3 className="text-lg font-semibold text-zinc-800">Partner Logos (Max 6)</h3>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-zinc-500 mb-6">
            Upload up to 6 partner logos. First 3 will appear in the left column, next 3 in the right column (staggered).
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map(idx => (
              <div key={idx} className="border border-zinc-200 p-4 rounded-xl bg-zinc-50/30 hover:bg-zinc-50 transition-colors">
                <label className="block text-xs font-semibold text-zinc-700 mb-3 text-center">
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