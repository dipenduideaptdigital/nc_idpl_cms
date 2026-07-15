import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import TipTapEditor from './TipTapEditor';

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
  onChange,
  onImageUpload
}) => {
  const [activeSlideTab, setActiveSlideTab] = useState('slide1');

  const s1BgRef = useRef(null);
  const s1FrontRef = useRef(null);
  const s2BgRef = useRef(null);
  const s3BgRef = useRef(null);

  const s1Data = heroData?.slide1 || {};
  const s2Data = heroData?.slide2 || {};
  const s3Data = heroData?.slide3 || {};

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
        
        {/* ===================== SLIDE 1  ===================== */}
        {activeSlideTab === 'slide1' && (
          <>
            <div className="space-y-6">
              <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Slide 1 Content</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Title Line 1</label>
                  <input type="text" value={s1Data.titleLine1 || ''} onChange={(e) => onChange('slide1', 'titleLine1', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Title Line 2</label>
                  <input type="text" value={s1Data.titleLine2 || ''} onChange={(e) => onChange('slide1', 'titleLine2', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
                  <input type="text" value={s1Data.badgeText || ''} onChange={(e) => onChange('slide1', 'badgeText', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Button Text</label>
                  <input type="text" value={s1Data.buttonText || ''} onChange={(e) => onChange('slide1', 'buttonText', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                </div>
              </div>
              
              {/*  TipTap Editor */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Subtitle / Description</label>
                <TipTapEditor 
                  value={s1Data.subtitle || ''} 
                  onChange={(html) => onChange('slide1', 'subtitle', html)} 
                  placeholder="Enter slide 1 description here..."
                />
              </div>
              
              <div className="pt-4 border-t border-zinc-100">
                <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Glass Card Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Number (e.g. 250+)</label>
                    <input type="text" value={s1Data.glassCardNumber || ''} onChange={(e) => onChange('slide1', 'glassCardNumber', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Sub-text</label>
                    <input type="text" value={s1Data.glassCardText1 || ''} onChange={(e) => onChange('slide1', 'glassCardText1', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Main Text</label>
                  <input type="text" value={s1Data.glassCardText2 || ''} onChange={(e) => onChange('slide1', 'glassCardText2', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Media Assets</h3>
              {/* S1 BG */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div><h4 className="font-semibold text-zinc-800">Background Image</h4></div>
                  <button type="button" onClick={() => s1BgRef.current?.click()} className="flex items-center gap-2 text-sm border border-zinc-200 px-3 py-1.5 rounded-lg bg-white hover:border-zinc-900">
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <input type="file" ref={s1BgRef} onChange={(e) => onImageUpload(e, 'slide1_bg')} className="hidden" accept="image/*" />
                </div>
                {s1Data.backgroundImage ? (
                  <img src={getAssetUrl(s1Data.backgroundImage)} alt="Preview" className="w-full h-32 rounded-xl object-cover border border-zinc-200" />
                ) : <div className="w-full h-32 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center"><span className="text-zinc-400 text-sm">No image</span></div>}
              </div>
              {/* S1 Front */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div><h4 className="font-semibold text-zinc-800">Front Image</h4></div>
                  <button type="button" onClick={() => s1FrontRef.current?.click()} className="flex items-center gap-2 text-sm border border-zinc-200 px-3 py-1.5 rounded-lg bg-white hover:border-zinc-900">
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <input type="file" ref={s1FrontRef} onChange={(e) => onImageUpload(e, 'slide1_front')} className="hidden" accept="image/*" />
                </div>
                {s1Data.frontImage ? (
                  <img src={getAssetUrl(s1Data.frontImage)} alt="Preview" className="w-32 h-32 mx-auto rounded-xl object-cover border border-zinc-200" />
                ) : <div className="w-32 h-32 mx-auto rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center"><span className="text-zinc-400 text-sm">No image</span></div>}
              </div>
            </div>
          </>
        )}

        {/* ===================== SLIDE 2 ===================== */}
        {activeSlideTab === 'slide2' && (
          <>
            <div className="space-y-6">
              <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Slide 2 Content</h3>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
                <input type="text" value={s2Data.badgeText || ''} onChange={(e) => onChange('slide2', 'badgeText', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Main Title</label>
                <input type="text" value={s2Data.title || ''} onChange={(e) => onChange('slide2', 'title', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
              </div>

              {/* TipTap Editor */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
                <TipTapEditor 
                  value={s2Data.description || ''} 
                  onChange={(html) => onChange('slide2', 'description', html)} 
                  placeholder="Enter slide 2 description here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Watermark Text (e.g. Office)</label>
                <input type="text" value={s2Data.watermarkText || ''} onChange={(e) => onChange('slide2', 'watermarkText', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Media Assets</h3>
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div><h4 className="font-semibold text-zinc-800">Background Image</h4></div>
                  <button type="button" onClick={() => s2BgRef.current?.click()} className="flex items-center gap-2 text-sm border border-zinc-200 px-3 py-1.5 rounded-lg bg-white hover:border-zinc-900">
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <input type="file" ref={s2BgRef} onChange={(e) => onImageUpload(e, 'slide2_bg')} className="hidden" accept="image/*" />
                </div>
                {s2Data.backgroundImage ? (
                  <img src={getAssetUrl(s2Data.backgroundImage)} alt="Preview" className="w-full h-40 rounded-xl object-cover border border-zinc-200" />
                ) : <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center"><span className="text-zinc-400 text-sm">No image</span></div>}
              </div>
            </div>
          </>
        )}

        {/* ===================== SLIDE 3 ===================== */}
        {activeSlideTab === 'slide3' && (
          <>
            <div className="space-y-6">
              <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Slide 3 Content</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Title Line 1</label>
                  <input type="text" value={s3Data.titleLine1 || ''} onChange={(e) => onChange('slide3', 'titleLine1', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Title Line 2</label>
                  <input type="text" value={s3Data.titleLine2 || ''} onChange={(e) => onChange('slide3', 'titleLine2', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Subtitle</label>
                  <input type="text" value={s3Data.subtitle || ''} onChange={(e) => onChange('slide3', 'subtitle', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Button Text</label>
                  <input type="text" value={s3Data.buttonText || ''} onChange={(e) => onChange('slide3', 'buttonText', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
                </div>
              </div>

              {/*  TipTap Editor  */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
                <TipTapEditor 
                  value={s3Data.description || ''} 
                  onChange={(html) => onChange('slide3', 'description', html)} 
                  placeholder="Enter slide 3 description here..."
                />
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Media Assets</h3>
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div><h4 className="font-semibold text-zinc-800">Background Image</h4></div>
                  <button type="button" onClick={() => s3BgRef.current?.click()} className="flex items-center gap-2 text-sm border border-zinc-200 px-3 py-1.5 rounded-lg bg-white hover:border-zinc-900">
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <input type="file" ref={s3BgRef} onChange={(e) => onImageUpload(e, 'slide3_bg')} className="hidden" accept="image/*" />
                </div>
                {s3Data.backgroundImage ? (
                  <img src={getAssetUrl(s3Data.backgroundImage)} alt="Preview" className="w-full h-40 rounded-xl object-cover border border-zinc-200" />
                ) : <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center"><span className="text-zinc-400 text-sm">No image</span></div>}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default HeroCustomization;