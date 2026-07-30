import React from 'react';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const PlantDisplayCustomization = ({ data, onImageUpload }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-2">Plant Display Banner</h2>
      
      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
        <label className="block text-sm font-semibold mb-2">Full Width Banner Image</label>
        <p className="text-xs text-zinc-500 mb-4">Upload a high-resolution wide image (recommended size: 1920x800px).</p>
        
        <input 
          type="file" 
          accept="image/*" 
          onChange={e => onImageUpload(e, 'nc_plant_display')} 
          className="mb-4 text-sm w-full" 
        />
        
        {data?.plantImage && (
          <div className="mt-4 border rounded-lg overflow-hidden w-full h-48 sm:h-64 shadow-inner relative">
            <img 
              src={getAssetUrl(data.plantImage)} 
              alt="Plant Display Preview" 
              className="w-full h-full object-cover object-center" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDisplayCustomization;