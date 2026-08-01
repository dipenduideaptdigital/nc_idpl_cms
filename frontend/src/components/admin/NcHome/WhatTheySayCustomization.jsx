import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import TipTapEditor from '../TipTapEditor';
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
    <div className="space-y-6">
      <h2 className="text-lg font-bold border-b pb-2">What They Say (Testimonials) Section</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Tagline</label>
          <input 
            type="text" 
            className="w-full border rounded-lg p-2" 
            value={data.tagline || ''} 
            onChange={e => handleChange('tagline', e.target.value)} 
            placeholder="e.g. Testimonials"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Title Prefix (e.g. OUR)</label>
          <input 
            type="text" 
            className="w-full border rounded-lg p-2" 
            value={data.titlePrefix || ''} 
            onChange={e => handleChange('titlePrefix', e.target.value)} 
            placeholder="e.g. OUR"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Italic Title (e.g. partners)</label>
          <input 
            type="text" 
            className="w-full border rounded-lg p-2" 
            value={data.italicTitle || ''} 
            onChange={e => handleChange('italicTitle', e.target.value)} 
            placeholder="e.g. clients"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1">Headline</label>
          <TipTapEditor 
            value={data.headline || ''} 
            onChange={html => handleChange('headline', html)} 
            placeholder="Enter main headline..."
          />
        </div>
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-bold">Testimonials</h3>
          <button 
            onClick={handleAddTestimonial} 
            className="text-sm bg-zinc-100 px-3 py-1 rounded-md hover:bg-zinc-200 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
        
        <div className="space-y-4">
          {(data.testimonials || []).map((item, idx) => (
            <div key={idx} className="border border-zinc-200 p-4 rounded-xl bg-zinc-50 relative">
              <button 
                onClick={() => handleRemoveTestimonial(idx)} 
                className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors z-10"
                title="Remove Testimonial"
              >
                <Trash2 className="w-4 h-4"/>
              </button>
              
              <div className="grid grid-cols-2 gap-4 pr-8">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-600">Client Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-zinc-200 rounded-lg p-2 text-sm focus:outline-none focus:border-zinc-400" 
                    value={item.name || ''} 
                    onChange={e => handleTestimonialChange(idx, 'name', e.target.value)} 
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-zinc-600">Location / Designation</label>
                  <input 
                    type="text" 
                    className="w-full border border-zinc-200 rounded-lg p-2 text-sm focus:outline-none focus:border-zinc-400" 
                    value={item.location || ''} 
                    onChange={e => handleTestimonialChange(idx, 'location', e.target.value)} 
                    placeholder="e.g. New York, USA"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-zinc-600">Comment</label>
                  <TipTapEditor 
                    value={item.comment || ''} 
                    onChange={html => handleTestimonialChange(idx, 'comment', html)} 
                    placeholder="Enter client testimonial text..."
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-zinc-600">Client Image</label>
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