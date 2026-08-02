import React from 'react';
import { Type, Image as ImageIcon } from 'lucide-react';
import TipTapEditor from '../TipTapEditor';
import ImageField from '../ImageField';

const MandalasCustomization = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      
      {/* Top Level Text Fields */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <Type className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Main Heading Content</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Tagline</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.tagline || ''} 
              onChange={e => onChange('tagline', e.target.value)} 
              placeholder="e.g. Bringing nature indoors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Main Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.mainTitle || ''} 
              onChange={e => onChange('mainTitle', e.target.value)} 
              placeholder="e.g. Living Mandalas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Heading Line 1</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.headingLine1 || ''} 
              onChange={e => onChange('headingLine1', e.target.value)} 
              placeholder="e.g. Experience the beauty"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Heading Line 2</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.headingLine2 || ''} 
              onChange={e => onChange('headingLine2', e.target.value)} 
              placeholder="e.g. of aquatic life"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Italic Word</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.italicWord || ''} 
              onChange={e => onChange('italicWord', e.target.value)} 
              placeholder="e.g. serenity"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Button Text</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.buttonText || ''} 
              onChange={e => onChange('buttonText', e.target.value)} 
              placeholder="e.g. Explore Now"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Desc Line 1</label>
            <TipTapEditor 
              value={data.descLine1 || ''} 
              onChange={html => onChange('descLine1', html)} 
              placeholder="First line of description..."
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Desc Line 2</label>
            <TipTapEditor 
              value={data.descLine2 || ''} 
              onChange={html => onChange('descLine2', html)} 
              placeholder="Second line of description..."
            />
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <ImageIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Mandala Image</h3>
        </div>
        
        <div className="p-6">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Upload or Select Image</label>
          <ImageField 
            value={data.mandalaImage} 
            onChange={(url) => onChange('mandalaImage', url)} 
          />
        </div>
      </div>

    </div>
  );
};

export default MandalasCustomization;