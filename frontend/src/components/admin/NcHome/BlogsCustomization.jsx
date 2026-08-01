import React from 'react';
import { Type, LayoutGrid, FileText } from 'lucide-react';
import TipTapEditor from '../TipTapEditor';
import ImageField from '../ImageField';

const BlogsCustomization = ({ data, setData }) => {
  
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (index, field, value) => {
    setData(prev => {
      const newCards = [...(prev.cards || [])];
      if (!newCards[index]) {
        newCards[index] = { title: '', description: '', image: '' };
      }
      newCards[index][field] = value;
      return { ...prev, cards: newCards };
    });
  };

  // Ensure we always map over 4 cards for the UI layout
  const cards = data.cards || [{}, {}, {}, {}];
  while (cards.length < 4) {
    cards.push({ title: '', description: '', image: '' });
  }

  return (
    <div className="space-y-8">
      
      {/* Top Level Text Fields */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
          <Type className="w-5 h-5 text-zinc-700" />
          <h3 className="text-lg font-semibold text-zinc-800">Main Heading Content</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Tagline</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
              value={data.tagline || ''} 
              onChange={e => handleChange('tagline', e.target.value)} 
              placeholder="e.g. latest insights"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Main Title (Bold)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
              value={data.mainTitle || ''} 
              onChange={e => handleChange('mainTitle', e.target.value)} 
              placeholder="e.g. OUR"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Italic Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50" 
              value={data.italicTitle || ''} 
              onChange={e => handleChange('italicTitle', e.target.value)} 
              placeholder="e.g. blogs"
            />
          </div>
          
          {/* Replaced textarea with TipTapEditor */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Light Subtext</label>
            <TipTapEditor 
              value={data.subText || ''} 
              onChange={html => handleChange('subText', html)} 
              placeholder="Short introductory text..."
            />
          </div>
          
          {/* Replaced textarea with TipTapEditor */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Bold Headline</label>
            <TipTapEditor 
              value={data.headline || ''} 
              onChange={html => handleChange('headline', html)} 
              placeholder="Large headline text..."
            />
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
          <LayoutGrid className="w-5 h-5 text-zinc-700" />
          <h3 className="text-lg font-semibold text-zinc-800">Blog Step Cards (Strictly 4)</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.slice(0, 4).map((card, idx) => (
            <div key={idx} className="border border-zinc-200 p-5 rounded-xl bg-zinc-50/30 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-zinc-400" />
                <h4 className="font-bold text-sm text-zinc-700">Card 0{idx + 1}</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Card Title</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-white" 
                    value={card.title || ''} 
                    onChange={e => handleCardChange(idx, 'title', e.target.value)} 
                    placeholder="Enter card title..."
                  />
                </div>
                
                {/* Replaced textarea with TipTapEditor */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Description</label>
                  <TipTapEditor 
                    value={card.description || ''} 
                    onChange={html => handleCardChange(idx, 'description', html)} 
                    placeholder="Enter short description..."
                  />
                </div>
                
                {/* Replaced input type="file" with ImageField */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Card Image</label>
                  <ImageField 
                    value={card.image} 
                    onChange={(url) => handleCardChange(idx, 'image', url)} 
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

export default BlogsCustomization;