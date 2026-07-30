import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const LivingArtCustomization = ({ data, setData, onImageUpload }) => {
  
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
    <div className="space-y-6">
      <h2 className="text-lg font-bold border-b pb-2">Living Art Section</h2>
      
      {/* Top Level Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Tagline</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.tagline || ''} onChange={e => handleChange('tagline', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Main Title</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.mainTitle || ''} onChange={e => handleChange('mainTitle', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Italic Title</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.italicTitle || ''} onChange={e => handleChange('italicTitle', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Video URL (YouTube/Vimeo Embed)</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.videoUrl || ''} onChange={e => handleChange('videoUrl', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Sub Headline</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.subHeadline || ''} onChange={e => handleChange('subHeadline', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Paragraph</label>
          <textarea className="w-full border rounded-lg p-2" rows="2" value={data.paragraph || ''} onChange={e => handleChange('paragraph', e.target.value)} />
        </div>
      </div>

      {/* Tabs Management */}
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold">Category Tabs (Max 4 recommended)</h3>
          <button 
            onClick={handleAddTab}
            className="text-sm bg-zinc-100 px-3 py-1 rounded-md hover:bg-zinc-200 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Tab
          </button>
        </div>
        
        <div className="space-y-4">
          {(data.tabs || []).map((tab, idx) => (
            <div key={idx} className="border border-zinc-200 p-4 rounded-xl bg-zinc-50 relative">
              <button 
                onClick={() => handleRemoveTab(idx)} 
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4"/>
              </button>
              
              <div className="grid grid-cols-2 gap-4 pr-6">
                <div>
                  <label className="block text-xs font-semibold mb-1">Tab ID (e.g. 01, 02)</label>
                  <input type="text" className="w-full border rounded-lg p-1.5 text-sm" value={tab.id || ''} onChange={e => handleTabChange(idx, 'id', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Title</label>
                  <input type="text" className="w-full border rounded-lg p-1.5 text-sm" value={tab.title || ''} onChange={e => handleTabChange(idx, 'title', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1">Description 1</label>
                  <textarea className="w-full border rounded-lg p-1.5 text-sm" rows="2" value={tab.desc1 || ''} onChange={e => handleTabChange(idx, 'desc1', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1">Description 2</label>
                  <textarea className="w-full border rounded-lg p-1.5 text-sm" rows="2" value={tab.desc2 || ''} onChange={e => handleTabChange(idx, 'desc2', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1">Product Image</label>
                  <input type="file" accept="image/*" onChange={e => onImageUpload(e, 'nc_living_art_tab', idx)} className="text-sm mb-2" />
                  {tab.image && <img src={getAssetUrl(tab.image)} alt="tab preview" className="h-20 rounded-md object-cover mt-2" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Quote Management */}
      <div className="mt-8 border-t pt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Footer Tagline</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.footerTagline || ''} onChange={e => handleChange('footerTagline', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Footer Quote</label>
          <textarea className="w-full border rounded-lg p-2" rows="2" value={data.footerQuote || ''} onChange={e => handleChange('footerQuote', e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default LivingArtCustomization;