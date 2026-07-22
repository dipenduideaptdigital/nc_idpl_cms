import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ImageField from './ImageField';

const VideoBannerCustomization = ({
  videoBannerData,
  onChange
}) => {
  
  const handleImageSelect = (url) => {
    onChange({ target: { name: 'image', value: url } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <ImageIcon className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Video Play Banner Section</h2>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Content Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Text Content</h3>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">YouTube Video Link or ID (e.g. https://www.youtube.com/watch?v=ScMzIvxBSi4)</label>
            <input 
              type="text" 
              name="videoId"
              value={videoBannerData.videoId || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Headline (Use `\n` for newline)</label>
            <input 
              type="text" 
              name="title"
              value={videoBannerData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Description / Paragraph Text</label>
            <textarea 
              name="description"
              value={videoBannerData.description || ''}
              onChange={onChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Cover Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Cover Asset</h3>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="mb-6">
              <h4 className="font-semibold text-zinc-800">Thumbnail Cover Image</h4>
              <p className="text-xs text-zinc-500">Video background thumbnail image</p>
            </div>
            
            <ImageField 
              value={videoBannerData.image || ''} 
              onChange={handleImageSelect} 
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoBannerCustomization;