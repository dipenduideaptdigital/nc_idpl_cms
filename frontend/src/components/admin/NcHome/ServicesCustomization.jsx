import React from 'react';
import { Type, LayoutGrid, Plus, Trash2, Settings } from 'lucide-react';
import TipTapEditor from '../TipTapEditor';
import ImageField from '../ImageField';

const ServicesCustomization = ({ data, setData }) => {
  
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
    <div className="space-y-8">
      
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <Type className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Main Heading Content</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Tagline</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
              value={data.tagline || ''} 
              onChange={e => handleChange('tagline', e.target.value)} 
              placeholder="e.g. OUR SERVICES"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Main Headline</label>
            <TipTapEditor 
              value={data.headline || ''} 
              onChange={html => handleChange('headline', html)} 
              placeholder="Enter main headline here..."
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 transition-colors duration-300">Sub Paragraph</label>
            <TipTapEditor 
              value={data.subtext || ''} 
              onChange={html => handleChange('subtext', html)} 
              placeholder="Enter subtext or short description..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Service Cards</h3>
          </div>
          <button 
            onClick={handleAddService}
            className="text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-white flex items-center gap-2 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {(data.services || []).map((svc, idx) => (
            <div key={idx} className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors relative">
              <button 
                onClick={() => handleRemoveService(idx)} 
                className="absolute top-4 right-4 p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                title="Remove Service"
              >
                <Trash2 className="w-5 h-5"/>
              </button>
              
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors duration-300">
                <Settings className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Service Item {idx + 1}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 transition-colors duration-300">Service Number (e.g. 01)</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
                    value={svc.number || ''} 
                    onChange={e => handleServiceChange(idx, 'number', e.target.value)} 
                    placeholder="01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 transition-colors duration-300">Service Title</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" 
                    value={svc.title || ''} 
                    onChange={e => handleServiceChange(idx, 'title', e.target.value)} 
                    placeholder="Enter service title..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 transition-colors duration-300">Description</label>
                  <TipTapEditor 
                    value={svc.description || ''} 
                    onChange={html => handleServiceChange(idx, 'description', html)} 
                    placeholder="Write detailed service description..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 transition-colors duration-300">Service Image</label>
                  <div className="max-w-sm">
                    <ImageField 
                      value={svc.image} 
                      onChange={(url) => handleServiceChange(idx, 'image', url)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!data.services || data.services.length === 0) && (
            <div className="text-center py-10 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 transition-colors duration-300">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-300">No services added yet.</p>
              <button 
                onClick={handleAddService}
                className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline"
              >
                Click here to add your first service
              </button>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ServicesCustomization;