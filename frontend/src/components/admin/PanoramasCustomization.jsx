import React from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

const PanoramasCustomization = ({
  panoramasData,
  onChange,
  previewImage,
  imageRef,
  onImageUpload
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <ImageIcon className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">360-Degree Panoramas Section</h2>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Content Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Text Content</h3>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={panoramasData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title (Use `[text]` to highlight, `\n` for newline)</label>
            <input 
              type="text" 
              name="title"
              value={panoramasData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Panoramic Image settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Media Assets</h3>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-zinc-800">360 Panoramic View Image</h4>
                <p className="text-xs text-zinc-500">Wide panoramic room render image</p>
              </div>
              <button 
                type="button"
                onClick={() => imageRef.current?.click()}
                className="flex items-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <input 
                type="file" 
                ref={imageRef} 
                onChange={(e) => onImageUpload(e, 'panoramaView')}
                className="hidden" 
                accept="image/*"
              />
            </div>
            {previewImage ? (
              <div className="w-full h-48 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                <img src={previewImage} alt="Panoramic Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-48 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                <span className="text-zinc-400 text-sm">No image uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanoramasCustomization;
