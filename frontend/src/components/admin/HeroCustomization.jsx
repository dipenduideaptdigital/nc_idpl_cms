import React from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

const HeroCustomization = ({
  heroData,
  onChange,
  previewBack,
  previewFront,
  backImageRef,
  frontImageRef,
  onImageUpload
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <ImageIcon className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Hero Section</h2>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Content Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Text Content</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Title Line 1</label>
              <input 
                type="text" 
                name="titleLine1"
                value={heroData.titleLine1 || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Title Line 2</label>
              <input 
                type="text" 
                name="titleLine2"
                value={heroData.titleLine2 || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={heroData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Subtitle / Description</label>
            <textarea 
              name="subtitle"
              value={heroData.subtitle || ''}
              onChange={onChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none"
            />
          </div>
          
          <div className="pt-4 border-t border-zinc-100">
            <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Glass Card Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Number (e.g. 250+)</label>
                <input 
                  type="text" 
                  name="glassCardNumber"
                  value={heroData.glassCardNumber || ''}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Sub-text</label>
                <input 
                  type="text" 
                  name="glassCardText1"
                  value={heroData.glassCardText1 || ''}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Main Text</label>
              <input 
                type="text" 
                name="glassCardText2"
                value={heroData.glassCardText2 || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Image Settings */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Media Assets</h3>
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative group overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-zinc-800">Background Image</h4>
                  <p className="text-xs text-zinc-500">Main dark backdrop</p>
                </div>
                <button 
                  type="button"
                  onClick={() => backImageRef.current?.click()}
                  className="flex items-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
                <input 
                  type="file" 
                  ref={backImageRef} 
                  onChange={(e) => onImageUpload(e, 'background')}
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              {previewBack ? (
                <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                  <img src={previewBack} alt="Background Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                  <span className="text-zinc-400 text-sm">No image uploaded</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative group overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-zinc-800">Front Feature Image</h4>
                  <p className="text-xs text-zinc-500">The portrait card image</p>
                </div>
                <button 
                  type="button"
                  onClick={() => frontImageRef.current?.click()}
                  className="flex items-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
                <input 
                  type="file" 
                  ref={frontImageRef} 
                  onChange={(e) => onImageUpload(e, 'front')}
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              {previewFront ? (
                <div className="w-40 h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200 mx-auto">
                  <img src={previewFront} alt="Front Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-40 h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100 mx-auto">
                  <span className="text-zinc-400 text-sm">No image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCustomization;