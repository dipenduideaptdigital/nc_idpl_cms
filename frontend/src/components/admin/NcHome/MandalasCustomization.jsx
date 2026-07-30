import React from 'react';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const MandalasCustomization = ({ data, onChange, onImageUpload }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold border-b pb-2 mb-4">Living Mandalas Section</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Tagline</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.tagline || ''} onChange={e => onChange('tagline', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Main Title</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.mainTitle || ''} onChange={e => onChange('mainTitle', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Heading Line 1</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.headingLine1 || ''} onChange={e => onChange('headingLine1', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Heading Line 2</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.headingLine2 || ''} onChange={e => onChange('headingLine2', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Italic Word</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.italicWord || ''} onChange={e => onChange('italicWord', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Button Text</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.buttonText || ''} onChange={e => onChange('buttonText', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Desc Line 1</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.descLine1 || ''} onChange={e => onChange('descLine1', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Desc Line 2</label>
          <input type="text" className="w-full border rounded-lg p-2" value={data.descLine2 || ''} onChange={e => onChange('descLine2', e.target.value)} />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-semibold mb-2">Mandala Image</label>
        <input type="file" accept="image/*" onChange={e => onImageUpload(e, 'nc_mandalas')} className="mb-2" />
        {data.mandalaImage && (
          <div className="mt-2">
            <img src={getAssetUrl(data.mandalaImage)} alt="mandala" className="h-32 rounded-lg object-contain bg-zinc-100" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MandalasCustomization;