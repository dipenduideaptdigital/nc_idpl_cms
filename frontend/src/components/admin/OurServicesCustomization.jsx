import React from 'react';
import { List, Plus, Trash2 } from 'lucide-react';
import TipTapEditor from './TipTapEditor';
import ImageField from './ImageField';

const OurServicesCustomization = ({
  ourServicesData,
  onChange,
  onServiceItemChange,
  onStatItemChange,
  onAddService,
  onDeleteService
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
            <TipTapEditor 
              value={ourServicesData.description || ''} 
              onChange={(html) => onChange({ target: { name: 'description', value: html } })} 
              placeholder="Enter section description here..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100">
          
          {/* Main Section Image */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="mb-4">
              <h4 className="font-semibold text-zinc-800">Main Section Image</h4>
              <p className="text-xs text-zinc-500">Service preview backdrop image</p>
            </div>
            
            <ImageField 
              value={ourServicesData.image || ''} 
              onChange={(url) => onChange({ target: { name: 'image', value: url } })} 
            />
          </div>

          {/* Bottom Blueprint Image */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="mb-4">
              <h4 className="font-semibold text-zinc-800">Bottom Blueprint Image</h4>
              <p className="text-xs text-zinc-500">Architectural 3D floor plan image</p>
            </div>

            <ImageField 
              value={ourServicesData.bottomImage || ''} 
              onChange={(url) => onChange({ target: { name: 'bottomImage', value: url } })} 
            />
          </div>

        </div>

        {/* Services Titles */}
        <div className="pt-6 border-t border-zinc-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase">
              Service Offerings List ({(ourServicesData.services || []).length} Items)
            </h3>
            <button
              type="button"
              onClick={onAddService}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Service
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(ourServicesData.services || []).map((service, index) => (
              <div key={index} className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 text-white text-xs font-bold shrink-0">
                      {service.id || `0${index + 1}`}
                    </span>
                    <span className="text-sm font-bold text-zinc-800">Service Offering {service.id || `0${index + 1}`}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteService(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
                <div className="space-y-3 pl-11">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Service Title</label>
                    <input 
                      type="text" 
                      value={service.title || ''}
                      onChange={(e) => onServiceItemChange(index, 'title', e.target.value)}
                      placeholder="Service title"
                      className="w-full px-3 py-2.5 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Service Link / URL path</label>
                    <input 
                      type="text" 
                      value={service.link || ''}
                      onChange={(e) => onServiceItemChange(index, 'link', e.target.value)}
                      placeholder="e.g., /services/residential-interior-design"
                      className="w-full px-3 py-2.5 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
            {(ourServicesData.services || []).length === 0 && (
              <p className="col-span-2 text-zinc-400 text-sm italic text-center py-8 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
                No services added yet. Click "Add Service" to create one.
              </p>
            )}
          </div>
        </div>

        {/* Stats Section (4 Items) */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Performance Statistics (4 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(ourServicesData.stats || []).map((stat, index) => (
              <div key={index} className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
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