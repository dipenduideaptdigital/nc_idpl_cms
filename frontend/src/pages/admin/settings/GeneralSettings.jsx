import React from 'react';
import { SlidersHorizontal, Save } from 'lucide-react';

const GeneralSettings = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-zinc-900 font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-zinc-900" />
            General Settings
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage global website configurations.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 flex-shrink-0">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      {/* Website Identity Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900">Website Identity</h2>
          <span className="text-xs text-zinc-400 font-medium">Section 01</span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Website Name</label>
            <input
              type="text"
              defaultValue="Subhaakritee"
              className="block w-full px-4 py-2.5 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors sm:text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Support Email</label>
            <input
              type="email"
              defaultValue="support@subhaakritee.com"
              className="block w-full px-4 py-2.5 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors sm:text-sm font-medium"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default GeneralSettings;