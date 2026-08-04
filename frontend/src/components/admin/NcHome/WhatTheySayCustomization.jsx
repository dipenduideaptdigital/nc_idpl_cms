import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ImageField from '../ImageField';

const WhatTheySayCustomization = ({ data, setData }) => {
  const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const handleTestimonialChange = (index, field, value) => {
    setData(prev => {
      const newItems = [...(prev.testimonials || [])];
      newItems[index][field] = value;
      return { ...prev, testimonials: newItems };
    });
  };

  const handleAddTestimonial = () => {
    setData(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), { name: '', location: '', comment: '', image: '' }]
    }));
  };

  const handleRemoveTestimonial = (index) => {
    setData(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors duration-300">What They Say (Testimonials) Section</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Tagline</label>
          <input 
            type="text" 
            className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors duration-300" 
            value={data.tagline || ''} 
            onChange={e => handleChange('tagline', e.target.value)} 
            placeholder="e.g. what they say"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Title Prefix (e.g. OUR)</label>
          <input 
            type="text" 
            className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors duration-300" 
            value={data.titlePrefix || ''} 
            onChange={e => handleChange('titlePrefix', e.target.value)} 
            placeholder="e.g. OUR"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Italic Title (e.g. partners)</label>
          <input 
            type="text" 
            className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors duration-300" 
            value={data.italicTitle || ''} 
            onChange={e => handleChange('italicTitle', e.target.value)} 
            placeholder="e.g. partners"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Headline (Use &lt;br /&gt; for line break)</label>
          <textarea 
            rows="2"
            className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors duration-300"
            value={data.headline || ''} 
            onChange={e => handleChange('headline', e.target.value)} 
            placeholder="e.g. Real people with<br />life-changing results"
          />
        </div>
      </div>

      <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-4 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Testimonials</h3>
          <button 
            onClick={handleAddTestimonial} 
            className="text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
        
        <div className="space-y-4">
          {(data.testimonials || []).map((item, idx) => (
            <div key={idx} className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 relative transition-colors duration-300">
              <button 
                onClick={() => handleRemoveTestimonial(idx)} 
                className="absolute top-4 right-4 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-md transition-colors z-10 cursor-pointer"
                title="Remove Testimonial"
              >
                <Trash2 className="w-4 h-4"/>
              </button>
              
              <div className="grid grid-cols-2 gap-4 pr-8">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-400 transition-colors duration-300">Client Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors duration-300" 
                    value={item.name || ''} 
                    onChange={e => handleTestimonialChange(idx, 'name', e.target.value)} 
                    placeholder="e.g. Mr. Dhiraj Basin"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-400 transition-colors duration-300">Location / Designation</label>
                  <input 
                    type="text" 
                    className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors duration-300" 
                    value={item.location || ''} 
                    onChange={e => handleTestimonialChange(idx, 'location', e.target.value)} 
                    placeholder="e.g. Kolkata"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-400 transition-colors duration-300">Comment</label>
                  <textarea 
                    rows="3"
                    className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors duration-300"
                    value={item.comment || ''} 
                    onChange={e => handleTestimonialChange(idx, 'comment', e.target.value)} 
                    placeholder="Enter client testimonial text..."
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-400 transition-colors duration-300">Client Image</label>
                  <ImageField 
                    value={item.image} 
                    onChange={(url) => handleTestimonialChange(idx, 'image', url)} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatTheySayCustomization;