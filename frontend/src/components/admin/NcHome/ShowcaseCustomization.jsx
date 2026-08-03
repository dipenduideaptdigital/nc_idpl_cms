import React from 'react';
import TipTapEditor from '../TipTapEditor';
import ImageField from '../ImageField';

const ShowcaseCustomization = ({ data, setData }) => {
  
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleGalleryChange = (url, index) => {
    setData(prev => {
      const newGallery = [...(prev.galleryImages || [])];
      while (newGallery.length <= index) {
        newGallery.push('');
      }
      newGallery[index] = url;
      return { ...prev, galleryImages: newGallery };
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Nature Showcase Section</h2>
      
      {/* ROW 1: NatureCube */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 transition-colors duration-300">
        <h3 className="font-bold text-md text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Row 1: Main Introduction</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Row 1 Logo</label>
            <div className="max-w-sm">
              <ImageField 
                value={data.row1Logo || ''} 
                onChange={url => handleChange('row1Logo', url)} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Row 1 Description</label>
            <TipTapEditor 
              value={data.row1Desc || ''} 
              onChange={html => handleChange('row1Desc', html)} 
              placeholder="Enter Row 1 description..."
            />
          </div>
        </div>
        
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 transition-colors duration-300">
          <label className="block text-sm font-semibold mb-4 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Gallery Images (3 required)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map(idx => (
              <div key={idx} className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300">
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider transition-colors duration-300">Image 0{idx + 1}</label>
                <ImageField 
                  value={data.galleryImages?.[idx] || ''} 
                  onChange={url => handleGalleryChange(url, idx)} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2: Ripples */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 transition-colors duration-300">
        <h3 className="font-bold text-md text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Row 2: Ripples Studio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Ripples Logo</label>
            <ImageField 
              value={data.row2Logo || ''} 
              onChange={url => handleChange('row2Logo', url)} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Floating Image (e.g. Fish)</label>
            <ImageField 
              value={data.row2FloatingImg || ''} 
              onChange={url => handleChange('row2FloatingImg', url)} 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Description</label>
            <TipTapEditor 
              value={data.row2Desc || ''} 
              onChange={html => handleChange('row2Desc', html)} 
              placeholder="Enter Ripples Studio description..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Button Text</label>
            <input 
              type="text" 
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm" 
              value={data.row2BtnText || ''} 
              onChange={e => handleChange('row2BtnText', e.target.value)} 
              placeholder="e.g. Learn More"
            />
          </div>
        </div>
      </div>

      {/* ROW 3: Gulmohar */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 transition-colors duration-300">
        <h3 className="font-bold text-md text-zinc-800 dark:text-zinc-100 transition-colors duration-300">Row 3: Gulmohar Concept</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Gulmohar Logo</label>
            <ImageField 
              value={data.row3Logo || ''} 
              onChange={url => handleChange('row3Logo', url)} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Floating Image (e.g. Terrarium)</label>
            <ImageField 
              value={data.row3FloatingImg || ''} 
              onChange={url => handleChange('row3FloatingImg', url)} 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Description</label>
            <TipTapEditor 
              value={data.row3Desc || ''} 
              onChange={html => handleChange('row3Desc', html)} 
              placeholder="Enter Gulmohar Concept description..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Button Text</label>
            <input 
              type="text" 
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm" 
              value={data.row3BtnText || ''} 
              onChange={e => handleChange('row3BtnText', e.target.value)} 
              placeholder="e.g. Discover More"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseCustomization;