import React from 'react';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const ShowcaseCustomization = ({ data, setData, onImageUpload }) => {
  
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleGalleryUpload = (e, index) => {
    onImageUpload(e, 'nc_showcase_gallery', index);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold border-b pb-2">Nature Showcase Section</h2>
      
      {/* ROW 1: NatureCube */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
        <h3 className="font-bold text-md mb-2">Row 1: Main Introduction</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Row 1 Logo</label>
            <input type="file" accept="image/*" onChange={e => onImageUpload(e, 'nc_showcase_row1Logo')} className="text-sm mb-2" />
            {data.row1Logo && <img src={getAssetUrl(data.row1Logo)} alt="logo" className="h-12 object-contain" />}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Row 1 Description</label>
            <textarea className="w-full border rounded-lg p-2" rows="3" value={data.row1Desc || ''} onChange={e => handleChange('row1Desc', e.target.value)} />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <label className="block text-sm font-semibold mb-2">Gallery Images (3 required)</label>
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map(idx => (
              <div key={idx} className="border p-2 rounded-lg bg-white">
                <input type="file" accept="image/*" onChange={e => handleGalleryUpload(e, idx)} className="text-xs w-full mb-2" />
                {data.galleryImages?.[idx] && <img src={getAssetUrl(data.galleryImages[idx])} alt={`gal-${idx}`} className="h-24 w-full object-cover rounded-md" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2: Ripples */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
        <h3 className="font-bold text-md mb-2">Row 2: Ripples Studio</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Ripples Logo</label>
            <input type="file" accept="image/*" onChange={e => onImageUpload(e, 'nc_showcase_row2Logo')} className="text-sm mb-2" />
            {data.row2Logo && <img src={getAssetUrl(data.row2Logo)} alt="logo" className="h-12 object-contain" />}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Floating Image (e.g. Fish)</label>
            <input type="file" accept="image/*" onChange={e => onImageUpload(e, 'nc_showcase_row2FloatingImg')} className="text-sm mb-2" />
            {data.row2FloatingImg && <img src={getAssetUrl(data.row2FloatingImg)} alt="floating" className="h-16 object-contain" />}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Description (Use &lt;b&gt; text &lt;/b&gt; to make words bold)</label>
            <textarea className="w-full border rounded-lg p-2" rows="2" value={data.row2Desc || ''} onChange={e => handleChange('row2Desc', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Button Text</label>
            <input type="text" className="w-full border rounded-lg p-2" value={data.row2BtnText || ''} onChange={e => handleChange('row2BtnText', e.target.value)} />
          </div>
        </div>
      </div>

      {/* ROW 3: Gulmohar */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
        <h3 className="font-bold text-md mb-2">Row 3: Gulmohar Concept</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Gulmohar Logo</label>
            <input type="file" accept="image/*" onChange={e => onImageUpload(e, 'nc_showcase_row3Logo')} className="text-sm mb-2" />
            {data.row3Logo && <img src={getAssetUrl(data.row3Logo)} alt="logo" className="h-12 object-contain" />}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Floating Image (e.g. Terrarium)</label>
            <input type="file" accept="image/*" onChange={e => onImageUpload(e, 'nc_showcase_row3FloatingImg')} className="text-sm mb-2" />
            {data.row3FloatingImg && <img src={getAssetUrl(data.row3FloatingImg)} alt="floating" className="h-16 object-contain" />}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Description (Use &lt;b&gt; text &lt;/b&gt; to make words bold)</label>
            <textarea className="w-full border rounded-lg p-2" rows="2" value={data.row3Desc || ''} onChange={e => handleChange('row3Desc', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Button Text</label>
            <input type="text" className="w-full border rounded-lg p-2" value={data.row3BtnText || ''} onChange={e => handleChange('row3BtnText', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseCustomization;