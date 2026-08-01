import React from 'react';
import { Type, MousePointerClick } from 'lucide-react';
import TipTapEditor from '../TipTapEditor';

const CtaCustomization = ({ data, setData }) => {
  
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
          <Type className="w-5 h-5 text-zinc-700" />
          <h3 className="text-lg font-semibold text-zinc-800">Call to Action (CTA) Content</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Title Part 1 (Uppercase)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
              value={data.titlePart1 || ''} 
              onChange={e => handleChange('titlePart1', e.target.value)} 
              placeholder="e.g. LIVING"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Title Part 2 (Italic, Green)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
              value={data.titlePart2 || ''} 
              onChange={e => handleChange('titlePart2', e.target.value)} 
              placeholder="e.g. art"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Main Headline</label>
            <TipTapEditor 
              value={data.headline || ''} 
              onChange={html => handleChange('headline', html)} 
              placeholder="It is a long established fact that a reader will be distracted."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Subtext Paragraph</label>
            <TipTapEditor 
              value={data.subtext || ''} 
              onChange={html => handleChange('subtext', html)} 
              placeholder="Enter supporting description text here..."
            />
          </div>

          <div className="pt-4 border-t border-zinc-100 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-1.5">
                <MousePointerClick className="w-4 h-4 text-zinc-400" />
                Button Text
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
                value={data.buttonText || ''} 
                onChange={e => handleChange('buttonText', e.target.value)} 
                placeholder="LET'S GET STARTED"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Button Link URL</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
                value={data.buttonLink || ''} 
                onChange={e => handleChange('buttonLink', e.target.value)} 
                placeholder="e.g. #contact or /contact"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CtaCustomization;