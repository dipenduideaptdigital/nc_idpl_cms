import React from 'react';
import { List, Upload } from 'lucide-react';

const OurServicesCustomization = ({
  ourServicesData,
  onChange,
  onServiceItemChange,
  onStatItemChange,
  previewMain,
  previewBottom,
  mainImageRef,
  bottomImageRef,
  onImageUpload
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <List className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Our Services Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={ourServicesData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title (Use `[text]` to highlight in primary color)</label>
            <input 
              type="text" 
              name="title"
              value={ourServicesData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
            <textarea 
              name="description"
              value={ourServicesData.description || ''}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Media Assets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-zinc-800">Main Section Image</h4>
                <p className="text-xs text-zinc-500">Service preview backdrop image</p>
              </div>
              <button 
                type="button"
                onClick={() => mainImageRef.current?.click()}
                className="flex items-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <input 
                type="file" 
                ref={mainImageRef} 
                onChange={(e) => onImageUpload(e, 'serviceMain')}
                className="hidden" 
                accept="image/*"
              />
            </div>
            {previewMain ? (
              <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                <img src={previewMain} alt="Service Main Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                <span className="text-zinc-400 text-sm">No image uploaded</span>
              </div>
            )}
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-zinc-800">Bottom Blueprint Image</h4>
                <p className="text-xs text-zinc-500">Architectural 3D floor plan image</p>
              </div>
              <button 
                type="button"
                onClick={() => bottomImageRef.current?.click()}
                className="flex items-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <input 
                type="file" 
                ref={bottomImageRef} 
                onChange={(e) => onImageUpload(e, 'serviceBottom')}
                className="hidden" 
                accept="image/*"
              />
            </div>
            {previewBottom ? (
              <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                <img src={previewBottom} alt="Service Bottom Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                <span className="text-zinc-400 text-sm">No image uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Services Titles (6 Items) */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Service Offerings List (6 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(ourServicesData.services || []).map((service, index) => (
              <div key={index} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 text-white text-xs font-bold shrink-0">
                  {service.id || `0${index + 1}`}
                </span>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={service.title || ''}
                    onChange={(e) => onServiceItemChange(index, 'title', e.target.value)}
                    placeholder="Service title"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section (4 Items) */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Performance Statistics (4 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(ourServicesData.stats || []).map((stat, index) => (
              <div key={index} className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  Stat {index + 1}
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Value (e.g. 26+)</label>
                    <input 
                      type="text" 
                      value={stat.value || ''}
                      onChange={(e) => onStatItemChange(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Title (e.g. LOCATION)</label>
                    <input 
                      type="text" 
                      value={stat.title || ''}
                      onChange={(e) => onStatItemChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Description</label>
                  <textarea 
                    value={stat.description || ''}
                    onChange={(e) => onStatItemChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurServicesCustomization;
