import React, { useState } from 'react';
import { Settings, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import TipTapEditor from './TipTapEditor';

const CollapsibleTiptap = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 50 ? text.substring(0, 50) + '...' : text || 'No content added...';
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-zinc-500 mb-1">{label}</label>}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors outline-none"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Edit2 className="w-4 h-4 text-zinc-500 shrink-0" />
            <span className="text-sm font-medium text-zinc-700 truncate">
              {isOpen ? 'Close Rich Text Editor' : getPreviewText(value)}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
          )}
        </button>
        
        {isOpen && (
          <div className="p-4 border-t border-zinc-200 bg-white">
            <TipTapEditor value={value || ''} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Main Component
const HowWeWorkCustomization = ({
  howWeWorkData,
  onChange,
  onStepItemChange
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <Settings className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">How We Work Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={howWeWorkData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title (Use `[text]` to highlight in primary color)</label>
            <input 
              type="text" 
              name="title"
              value={howWeWorkData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
            <CollapsibleTiptap 
              value={howWeWorkData.description || ''}
              onChange={(htmlValue) => onChange({ target: { name: 'description', value: htmlValue } })}
            />
          </div>
        </div>

        {/* Staggered Process Steps (4 Items) */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Process Steps (4 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(howWeWorkData.steps || []).map((step, index) => (
              <div key={index} className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold">
                  {step.id || `0${index + 1}`}
                </span>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Step Title</label>
                  <input 
                    type="text" 
                    value={step.title || ''}
                    onChange={(e) => onStepItemChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                  />
                </div>
                <div>
                  <CollapsibleTiptap 
                    label="Step Description"
                    value={step.description || ''}
                    onChange={(htmlValue) => onStepItemChange(index, 'description', htmlValue)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Call to Action Settings */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Footer Call to Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-zinc-700 mb-2">Bottom Text</label>
              <input 
                type="text" 
                name="bottomText"
                value={howWeWorkData.bottomText || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">CTA Link Text</label>
              <input 
                type="text" 
                name="bottomLinkText"
                value={howWeWorkData.bottomLinkText || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">CTA Link URL</label>
              <input 
                type="text" 
                name="bottomLinkUrl"
                value={howWeWorkData.bottomLinkUrl || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowWeWorkCustomization;