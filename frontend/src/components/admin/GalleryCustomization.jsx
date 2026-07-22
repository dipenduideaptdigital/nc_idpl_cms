import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ImageField from './ImageField';

const GalleryCustomization = ({
  galleryData,
  onChange,
  onImageSelect
}) => {
  const images = Array.isArray(galleryData.images) ? galleryData.images : [];
  const paddedImages = [...images, ...Array(6)].slice(0, 6);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <ImageIcon className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Gallery Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">Huge Background Watermark Text</label>
          <input 
            type="text" 
            name="bgText"
            value={galleryData.bgText || ''}
            onChange={onChange}
            placeholder="e.g. gallery"
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-mono"
          />
        </div>

        {/* Gallery Images (6 Items) */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Gallery Images (6 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paddedImages.map((imageUrl, index) => (
              <div key={index} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 text-white text-xs font-bold">
                    {index + 1}
                  </span>
                </div>

                <ImageField 
                  value={imageUrl} 
                  onChange={(url) => onImageSelect(index, url)} 
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GalleryCustomization;