import React from 'react';
import { SlidersHorizontal, Save } from 'lucide-react';

const GeneralSettings = () => {
  return (
    <div className="text-[#2B2A28]">

      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-double border-[#2B2A28] pb-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#3F5C73] font-bold mb-1.5">Workspace Configuration</p>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-2.5 text-[#2B2A28]">
            <SlidersHorizontal className="w-6 h-6 text-[#3F5C73]" />
            General Settings
          </h1>
          <p className="text-sm text-[#8A8378] mt-1 font-serif italic">Manage global website configurations.</p>
        </div>

        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2B2A28] text-[#FAF7F0] font-mono text-sm uppercase tracking-wide hover:bg-[#3F5C73] transition-colors flex-shrink-0">
          <Save className="w-4 h-4" /> Save
        </button>
      </div>

      {/* Website Identity */}
      <div className="border border-[#DDD6C7]">
        <div className="px-6 py-4 border-b border-[#DDD6C7] bg-[#F3EFE4]/50 flex items-center justify-between">
          <h2 className="font-mono text-[12px] uppercase tracking-wider text-[#2B2A28] font-bold">Website Identity</h2>
          <span className="font-mono text-[10px] text-[#8A8378] tabular-nums">Section 01</span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-1.5">Website Name</label>
            <input
              type="text"
              defaultValue="Subhaakritee"
              className="w-full px-4 py-2.5 border border-[#DDD6C7] bg-transparent font-serif outline-none focus:border-[#3F5C73] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-1.5">Support Email</label>
            <input
              type="email"
              defaultValue="support@subhaakritee.com"
              className="w-full px-4 py-2.5 border border-[#DDD6C7] bg-transparent font-serif outline-none focus:border-[#3F5C73] transition-colors"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default GeneralSettings;