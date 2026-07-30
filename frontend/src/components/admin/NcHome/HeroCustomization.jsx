import React from 'react';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const HeroCustomization = ({ data, onChange, onImageUpload }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold border-b pb-2 mb-4">Hero Section</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Title Line 1</label>
          <input 
            type="text" 
            className="w-full border rounded-lg p-2" 
            value={data.titleLine1 || ''} 
            onChange={e => onChange('titleLine1', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Title Line 2</label>
          <input 
            type="text" 
            className="w-full border rounded-lg p-2" 
            value={data.titleLine2 || ''} 
            onChange={e => onChange('titleLine2', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Sub Headline</label>
          <input 
            type="text" 
            className="w-full border rounded-lg p-2" 
            value={data.subHeadline || ''} 
            onChange={e => onChange('subHeadline', e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Italic Word</label>
          <input 
            type="text" 
            className="w-full border rounded-lg p-2" 
            value={data.italicWord || ''} 
            onChange={e => onChange('italicWord', e.target.value)} 
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-semibold mb-2">Background Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={e => onImageUpload(e, 'nc_hero')} 
          className="mb-2" 
        />
        {data.backgroundImage && (
          <div className="mt-2">
            <img 
              src={getAssetUrl(data.backgroundImage)} 
              alt="Hero Background Preview" 
              className="h-32 rounded-lg object-cover" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCustomization;