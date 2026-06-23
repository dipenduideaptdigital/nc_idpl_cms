import React from 'react';
import { SlidersHorizontal, Save } from 'lucide-react';

const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-blue-600" /> General Settings
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Manage global website configurations.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Save
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-6">
        <h2 className="text-lg font-bold text-zinc-800 border-b border-zinc-100 pb-3">Website Identity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">Website Name</label>
            <input type="text" defaultValue="Subhaakritee" className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">Support Email</label>
            <input type="email" defaultValue="support@subhaakritee.com" className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;