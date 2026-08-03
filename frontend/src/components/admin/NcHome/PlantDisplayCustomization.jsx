import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ImageField from '../ImageField';

const PlantDisplayCustomization = ({ data, setData }) => {
  
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <ImageIcon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Plant Display Banner</h2>
        </div>
        
        {/* Content Section */}
        <div className="p-6">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Full Width Banner Image</label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 transition-colors duration-300">
            Select a high-resolution wide image from the media library (recommended size: 1920x800px).
          </p>
          
          <ImageField 
            value={data?.plantImage || ''} 
            onChange={(url) => handleChange('plantImage', url)} 
          />
        </div>
        
      </div>
    </div>
  );
};

export default PlantDisplayCustomization;