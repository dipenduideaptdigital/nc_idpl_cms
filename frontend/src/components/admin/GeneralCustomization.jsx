import React from 'react';
import { Layout } from 'lucide-react';

const GeneralCustomization = ({ generalData, onChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">General Settings</h2>
            <p className="text-sm text-zinc-500">Configure global settings for your landing page.</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-700">Active Homepage Layout</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Homepage Option */}
            <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all hover:bg-zinc-50 ${generalData.landingPage === 'default' ? 'border-zinc-900 bg-zinc-50/50 shadow-sm ring-1 ring-zinc-900' : 'border-zinc-200'}`}>
              <input
                type="radio"
                name="landingPage"
                value="default"
                className="sr-only"
                checked={generalData.landingPage === 'default'}
                onChange={onChange}
              />
              <span className="flex flex-col pr-8">
                <span className="block text-sm font-semibold text-zinc-900">Main Homepage</span>
                <span className="mt-1 block text-sm text-zinc-500 leading-relaxed">The standard layout featuring customizable sections.</span>
              </span>
              <span className={`absolute right-4 top-4 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${generalData.landingPage === 'default' ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300'}`}>
                {generalData.landingPage === 'default' && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
            </label>

            {/* Reference Homepage Option */}
            <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all hover:bg-zinc-50 ${generalData.landingPage === 'reference' ? 'border-zinc-900 bg-zinc-50/50 shadow-sm ring-1 ring-zinc-900' : 'border-zinc-200'}`}>
              <input
                type="radio"
                name="landingPage"
                value="reference"
                className="sr-only"
                checked={generalData.landingPage === 'reference'}
                onChange={onChange}
              />
              <span className="flex flex-col pr-8">
                <span className="block text-sm font-semibold text-zinc-900">Alternative Homepage</span>
                <span className="mt-1 block text-sm text-zinc-500 leading-relaxed">The alternative landing reference layout.</span>
              </span>
              <span className={`absolute right-4 top-4 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${generalData.landingPage === 'reference' ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300'}`}>
                {generalData.landingPage === 'reference' && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralCustomization;