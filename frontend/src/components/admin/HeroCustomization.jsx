import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import TipTapEditor from './TipTapEditor';
import ImageField from './ImageField';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const HeroCustomization = ({
  heroData,
  onChange
}) => {
  const [activeSlideTab, setActiveSlideTab] = useState('slide1');

  const renderSlideForm = (slideKey, slideData) => (
    <>
      <div className="space-y-6">
        <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Slide Content</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Title Line 1</label>
            <input type="text" value={slideData.titleLine1 || ''} onChange={(e) => onChange(slideKey, 'titleLine1', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Title Line 2</label>
            <input type="text" value={slideData.titleLine2 || ''} onChange={(e) => onChange(slideKey, 'titleLine2', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input type="text" value={slideData.badgeText || ''} onChange={(e) => onChange(slideKey, 'badgeText', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Button Text</label>
            <input type="text" value={slideData.buttonText || ''} onChange={(e) => onChange(slideKey, 'buttonText', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
          </div>
        </div>
        
        {/* TipTap Editor */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">Subtitle / Description</label>
          <TipTapEditor 
            value={slideData.subtitle || ''} 
            onChange={(html) => onChange(slideKey, 'subtitle', html)} 
            placeholder={`Enter ${slideKey} description here...`}
          />
        </div>
        
        <div className="pt-4 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Glass Card Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Number (e.g. 250+)</label>
              <input type="text" value={slideData.glassCardNumber || ''} onChange={(e) => onChange(slideKey, 'glassCardNumber', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Sub-text</label>
              <input type="text" value={slideData.glassCardText1 || ''} onChange={(e) => onChange(slideKey, 'glassCardText1', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Main Text</label>
            <input type="text" value={slideData.glassCardText2 || ''} onChange={(e) => onChange(slideKey, 'glassCardText2', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Media Assets</h3>
        
        {/* Background Image using the new ImageField */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div><h4 className="font-semibold text-zinc-800">Background Image</h4></div>
          </div>
          <ImageField 
            value={slideData.backgroundImage} 
            onChange={(url) => onChange(slideKey, 'backgroundImage', url)} 
          />
        </div>

        {/* Front Image using the new ImageField */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div><h4 className="font-semibold text-zinc-800">Front Image</h4></div>
          </div>
          <ImageField 
            value={slideData.frontImage} 
            onChange={(url) => onChange(slideKey, 'frontImage', url)} 
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <ImageIcon className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Hero Slider</h2>
      </div>

      {/* Slide Selector Tabs */}
      <div className="flex border-b border-zinc-200 bg-zinc-50/30 px-8 pt-4 gap-6">
        <button
          onClick={() => setActiveSlideTab('slide1')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeSlideTab === 'slide1' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Slide 1
        </button>
        <button
          onClick={() => setActiveSlideTab('slide2')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeSlideTab === 'slide2' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Slide 2
        </button>
        <button
          onClick={() => setActiveSlideTab('slide3')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeSlideTab === 'slide3' ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Slide 3
        </button>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {activeSlideTab === 'slide1' && renderSlideForm('slide1', heroData?.slide1 || {})}
        {activeSlideTab === 'slide2' && renderSlideForm('slide2', heroData?.slide2 || {})}
        {activeSlideTab === 'slide3' && renderSlideForm('slide3', heroData?.slide3 || {})}
      </div>
    </div>
  );
};

export default HeroCustomization;