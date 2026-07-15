import React from 'react';
import { Send } from 'lucide-react';

const CtaCustomization = ({
  ctaData,
  onChange
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <Send className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">CTA (Call To Action) Section</h2>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={ctaData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Button Text</label>
            <input 
              type="text" 
              name="buttonText"
              value={ctaData.buttonText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">CTA Title (Use `[text]` to highlight)</label>
            <input 
              type="text" 
              name="title"
              value={ctaData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaCustomization;
