import React from 'react';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const PartnersCustomization = ({ data, setData, onImageUpload }) => {
  
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handlePartnerUpload = (e, index) => {
    onImageUpload(e, 'nc_partners_logo', index);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold border-b pb-2">Our Partners Section</h2>
      
      {/* Typography Fields */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
        <h3 className="font-bold text-md mb-2">Text Content</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Main Title (Bold)</label>
            <input type="text" className="w-full border rounded-lg p-2" value={data.mainTitle1 || ''} onChange={e => handleChange('mainTitle1', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Italic Title</label>
            <input type="text" className="w-full border rounded-lg p-2" value={data.italicTitle || ''} onChange={e => handleChange('italicTitle', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Headline (Use &lt;br /&gt; for new line)</label>
            <input type="text" className="w-full border rounded-lg p-2" value={data.headline || ''} onChange={e => handleChange('headline', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1">Paragraph</label>
            <textarea className="w-full border rounded-lg p-2" rows="3" value={data.paragraph || ''} onChange={e => handleChange('paragraph', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Button Text</label>
            <input type="text" className="w-full border rounded-lg p-2" value={data.buttonText || ''} onChange={e => handleChange('buttonText', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Button Link</label>
            <input type="text" className="w-full border rounded-lg p-2" value={data.buttonLink || ''} onChange={e => handleChange('buttonLink', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Partner Logos Grid */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-4">
        <h3 className="font-bold text-md mb-2">Partner Logos (Max 6)</h3>
        <p className="text-xs text-zinc-500 mb-4">Upload up to 6 partner logos. First 3 will appear in the left column, next 3 in the right column (staggered).</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map(idx => (
            <div key={idx} className="border p-4 rounded-lg bg-white flex flex-col items-center justify-between">
              <label className="block text-xs font-semibold mb-2 text-center">Logo {idx + 1}</label>
              <div className="h-20 w-full mb-3 flex items-center justify-center bg-zinc-50 border border-dashed rounded">
                {data.partnerLogos?.[idx] ? (
                  <img src={getAssetUrl(data.partnerLogos[idx])} alt={`logo-${idx}`} className="max-h-16 max-w-full object-contain" />
                ) : (
                  <span className="text-zinc-400 text-xs">No Image</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={e => handlePartnerUpload(e, idx)} className="text-xs w-full" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PartnersCustomization;