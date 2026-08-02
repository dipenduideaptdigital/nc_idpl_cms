import React from 'react';
import { Plus, Trash2, Type, LayoutGrid, Quote } from 'lucide-react';
import TipTapEditor from '../TipTapEditor';
import ImageField from '../ImageField';

const LivingArtCustomization = ({ data, setData }) => {
  
  // Generic handler for top-level string fields
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Handlers for nested Tabs array
  const handleTabChange = (index, field, value) => {
    setData(prev => {
      const newTabs = [...(prev.tabs || [])];
      newTabs[index][field] = value;
      return { ...prev, tabs: newTabs };
    });
  };

  const handleAddTab = () => {
    setData(prev => {
      const currentTabs = prev.tabs || [];
      const newId = `0${currentTabs.length + 1}`;
      return {
        ...prev,
        tabs: [...currentTabs, { id: newId, title: '', desc1: '', desc2: '', image: '' }]
      };
    });
  };

  const handleRemoveTab = (index) => {
    setData(prev => {
      const newTabs = (prev.tabs || []).filter((_, i) => i !== index);
      return { ...prev, tabs: newTabs };
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Top Level Fields */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <Type className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Living Art - Main Content</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Tagline</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.tagline || ''} 
              onChange={e => handleChange('tagline', e.target.value)} 
              placeholder="e.g. LIVING ART" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Main Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.mainTitle || ''} 
              onChange={e => handleChange('mainTitle', e.target.value)} 
              placeholder="e.g. AQUATIC" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Italic Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.italicTitle || ''} 
              onChange={e => handleChange('italicTitle', e.target.value)} 
              placeholder="e.g. wonders" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Video URL (YouTube/Vimeo Embed)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.videoUrl || ''} 
              onChange={e => handleChange('videoUrl', e.target.value)} 
              placeholder="https://..." 
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Sub Headline</label>
            <TipTapEditor 
              value={data.subHeadline || ''} 
              onChange={html => handleChange('subHeadline', html)} 
              placeholder="Enter sub headline..." 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Paragraph</label>
            <TipTapEditor 
              value={data.paragraph || ''} 
              onChange={html => handleChange('paragraph', html)} 
              placeholder="Enter main paragraph text..." 
            />
          </div>
        </div>
      </div>

      {/* Tabs Management */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Category Tabs</h3>
          </div>
          <button 
            onClick={handleAddTab}
            className="text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2 font-medium transition-colors text-zinc-700 dark:text-zinc-200 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Tab
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {(data.tabs || []).map((tab, idx) => (
            <div key={idx} className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/30 relative hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <button 
                onClick={() => handleRemoveTab(idx)} 
                className="absolute top-4 right-4 p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remove Tab"
              >
                <Trash2 className="w-5 h-5"/>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Tab ID (e.g. 01, 02)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
                    value={tab.id || ''} 
                    onChange={e => handleTabChange(idx, 'id', e.target.value)} 
                    placeholder="01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Title</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
                    value={tab.title || ''} 
                    onChange={e => handleTabChange(idx, 'title', e.target.value)} 
                    placeholder="Enter tab title"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Description 1</label>
                  <TipTapEditor 
                    value={tab.desc1 || ''} 
                    onChange={html => handleTabChange(idx, 'desc1', html)} 
                    placeholder="Enter first description..." 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Description 2</label>
                  <TipTapEditor 
                    value={tab.desc2 || ''} 
                    onChange={html => handleTabChange(idx, 'desc2', html)} 
                    placeholder="Enter second description..." 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Product Image</label>
                  <ImageField 
                    value={tab.image} 
                    onChange={(url) => handleTabChange(idx, 'image', url)} 
                  />
                </div>
              </div>
            </div>
          ))}
          
          {(data.tabs || []).length === 0 && (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 text-sm transition-colors duration-300">
              No tabs added yet. Click "Add Tab" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Footer Quote Management */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <Quote className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Footer Section</h3>
        </div>
        <div className="p-6 grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Footer Tagline</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.footerTagline || ''} 
              onChange={e => handleChange('footerTagline', e.target.value)} 
              placeholder="e.g. LIVING ART" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Footer Quote</label>
            <TipTapEditor 
              value={data.footerQuote || ''} 
              onChange={html => handleChange('footerQuote', html)} 
              placeholder="Enter footer quote..." 
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default LivingArtCustomization;