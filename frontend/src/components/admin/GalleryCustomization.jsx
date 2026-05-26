import React from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

const GalleryCustomization = ({
  galleryData,
  onChange,
  onGalleryImageUpload,
  previewImages,
  imageRefs
}) => {
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
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 text-white text-xs font-bold">
                    {index + 1}
                  </span>
                  
                  <button 
                    type="button"
                    onClick={() => imageRefs.current[index]?.click()}
                    className="flex items-center gap-2 text-xs bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </button>
                  <input 
                    type="file" 
                    ref={el => imageRefs.current[index] = el}
                    onChange={(e) => onGalleryImageUpload(e, index)}
                    className="hidden" 
                    accept="image/*"
                  />
                </div>

                {previewImages[index] ? (
                  <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                    <img src={previewImages[index]} alt={`Gallery ${index + 1} Preview`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                    <span className="text-zinc-400 text-xs">No image uploaded</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GalleryCustomization;
