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

const ServicesCustomization = ({ data, setData, onImageUpload }) => {
  
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    setData(prev => {
      const newServices = [...(prev.services || [])];
      newServices[index][field] = value;
      return { ...prev, services: newServices };
    });
  };

  const handleAddService = () => {
    setData(prev => {
      const currentServices = prev.services || [];
      const newNumber = `0${currentServices.length + 1}`;
      return {
        ...prev,
        services: [...currentServices, { number: newNumber, title: '', description: '', image: '' }]
      };
    });
  };

  const handleRemoveService = (index) => {
    setData(prev => {
      const newServices = (prev.services || []).filter((_, i) => i !== index);
      return { ...prev, services: newServices };
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold border-b pb-2">Our Services Section</h2>
      
      {/* Top Level Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Tagline</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.tagline || ''} onChange={e => handleChange('tagline', e.target.value)} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Main Headline</label>
          <textarea className="w-full border rounded-lg p-2" rows="2" value={data.headline || ''} onChange={e => handleChange('headline', e.target.value)} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Sub Paragraph</label>
          <textarea className="w-full border rounded-lg p-2" rows="2" value={data.subtext || ''} onChange={e => handleChange('subtext', e.target.value)} />
        </div>
      </div>

      {/* Services Array Management */}
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold">Service Cards</h3>
          <button 
            onClick={handleAddService}
            className="text-sm bg-zinc-100 px-3 py-1 rounded-md hover:bg-zinc-200 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
        
        <div className="space-y-4">
          {(data.services || []).map((svc, idx) => (
            <div key={idx} className="border border-zinc-200 p-4 rounded-xl bg-zinc-50 relative">
              <button 
                onClick={() => handleRemoveService(idx)} 
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4"/>
              </button>
              
              <div className="grid grid-cols-2 gap-4 pr-6">
                <div>
                  <label className="block text-xs font-semibold mb-1">Service Number (e.g. 01)</label>
                  <input type="text" className="w-full border rounded-lg p-1.5 text-sm" value={svc.number || ''} onChange={e => handleServiceChange(idx, 'number', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Title</label>
                  <input type="text" className="w-full border rounded-lg p-1.5 text-sm" value={svc.title || ''} onChange={e => handleServiceChange(idx, 'title', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1">Description</label>
                  <textarea className="w-full border rounded-lg p-1.5 text-sm" rows="3" value={svc.description || ''} onChange={e => handleServiceChange(idx, 'description', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1">Service Image</label>
                  <input type="file" accept="image/*" onChange={e => onImageUpload(e, 'nc_services_image', idx)} className="text-sm mb-2" />
                  {svc.image && <img src={getAssetUrl(svc.image)} alt="service preview" className="h-24 rounded-md object-cover mt-2" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesCustomization;