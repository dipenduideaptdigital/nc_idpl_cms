import React, { useState } from 'react';
import { Image as ImageIcon, X, FolderOpen } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';
import MediaPickerModal from './MediaPickerModal';

const ImageField = ({ value, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectMedia = (url) => {
    onChange(url);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
  };

  const displayUrl = resolveAssetUrl(value);

  return (
    <div className="w-full">
      {value ? (
        <div className="relative group w-full h-40 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200">
          <img 
            src={displayUrl} 
            alt="Selected Preview" 
            className="w-full h-full object-cover" 
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
            <button 
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white text-zinc-900 text-xs font-bold rounded-lg hover:bg-zinc-100 shadow-sm flex items-center gap-2 transition-transform hover:scale-105"
            >
              <FolderOpen className="w-4 h-4" /> Change Image
            </button>
            <button 
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 shadow-sm flex items-center gap-2 transition-transform hover:scale-105"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setIsModalOpen(true)}
          className="w-full h-40 border-2 border-dashed border-zinc-300 hover:border-blue-500 bg-zinc-50 hover:bg-blue-50/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <ImageIcon className="w-6 h-6 text-zinc-400 group-hover:text-blue-500" />
          </div>
          <span className="text-sm font-semibold text-zinc-600 group-hover:text-blue-600">
            Browse Media Library
          </span>
          <span className="text-xs text-zinc-400 mt-1">
            Click to select or upload an image
          </span>
        </div>
      )}

      {/* Render the Modal outside the normal flow */}
      <MediaPickerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelectMedia} 
      />
    </div>
  );
};

export default ImageField;