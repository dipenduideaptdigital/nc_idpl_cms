import React, { useState } from 'react';
import { FileText, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import ImageField from './ImageField';
import TipTapEditor from './TipTapEditor';

// Collapsible Tiptap Wrapper Component
const CollapsibleTiptap = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 60 ? text.substring(0, 60) + '...' : text || 'No content added...';
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-zinc-700 mb-2">{label}</label>}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50/50 hover:bg-zinc-100 transition-colors outline-none"
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

const OurProjectsCustomization = ({
  ourProjectsData,
  onChange,
  onProjectItemChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <FileText className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Our Projects Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={ourProjectsData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title (Use `[text]` to highlight in primary color)</label>
            <input 
              type="text" 
              name="title"
              value={ourProjectsData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <CollapsibleTiptap 
              label="Description"
              value={ourProjectsData.description || ''}
              // parent-এর onChange event format maintain করার জন্য
              onChange={(htmlValue) => onChange({ target: { name: 'description', value: htmlValue } })}
            />
          </div>
        </div>

        {/* Media Graphic Asset */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Bottom Illustration Graphic</h3>
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="mb-4">
              <h4 className="font-semibold text-zinc-800 mb-1">Interior Foreground Image</h4>
              <p className="text-xs text-zinc-500">Wide silhouette/illustrative image placed above background typography</p>
            </div>
            
            <ImageField 
              value={ourProjectsData.bottomImage || ''} 
              onChange={(url) => onChange({ target: { name: 'bottomImage', value: url } })} 
            />

          </div>
        </div>

        {/* Projects Cards (5 Items) */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Carousel Projects (5 Items)</h3>
          <div className="space-y-6">
            {(ourProjectsData.projects || []).map((project, index) => (
              <div key={index} className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
                
                <div className="space-y-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 text-white text-xs font-bold">
                    Project {index + 1}
                  </span>
                  
                  <ImageField 
                    value={project.image || ''} 
                    onChange={(url) => onProjectItemChange(index, 'image', url)} 
                  />
                  
                </div>

                {/* Project Content Column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Category (e.g. LANDSCAPE)</label>
                    <input 
                      type="text" 
                      value={project.category || ''}
                      onChange={(e) => onProjectItemChange(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Project Title</label>
                    <input 
                      type="text" 
                      value={project.title || ''}
                      onChange={(e) => onProjectItemChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <CollapsibleTiptap 
                      label="Project Description"
                      value={project.description || ''}
                      onChange={(htmlValue) => onProjectItemChange(index, 'description', htmlValue)}
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurProjectsCustomization;