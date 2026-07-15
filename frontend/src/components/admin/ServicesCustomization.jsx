import React from 'react';
import { List } from 'lucide-react';
import TipTapEditor from './TipTapEditor';

const ServicesCustomization = ({
  servicesData,
  onChange,
  onServiceItemChange
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <List className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Services Section</h2>
      </div>

      <div className="p-8 space-y-8">
        {/* Header Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={servicesData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title (Use `[text]` to highlight in primary color)</label>
            <input 
              type="text" 
              name="title"
              value={servicesData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
            <TipTapEditor 
              value={servicesData.description || ''} 
              onChange={(html) => onChange({ target: { name: 'description', value: html } })} 
              placeholder="Enter main description here..."
            />
          </div>
        </div>

        {/* Services Cards */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Service Cards (4 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(servicesData.services || []).map((service, index) => (
              <div key={index} className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold">
                  {index + 1}
                </span>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Service Title (use `\n` for newline)</label>
                  <input 
                    type="text" 
                    value={service.title || ''}
                    onChange={(e) => onServiceItemChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Service Description</label>
                  <TipTapEditor 
                    value={service.description || ''} 
                    onChange={(html) => onServiceItemChange(index, 'description', html)} 
                    placeholder={`Enter description for service ${index + 1}...`}
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

export default ServicesCustomization;