import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import apiClient from '../../api/client';

const ImageField = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const getAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
      : 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (res.data?.success && res.data?.data?.url) {
        onChange(res.data.data.url);
      } else {
        setError('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-1 mb-3">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 aspect-video group">
          <img src={getAssetUrl(value)} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
             <button 
                type="button"
                onClick={() => onChange('')}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded"
             >
                Remove
             </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 border-dashed bg-zinc-50 aspect-video flex flex-col items-center justify-center p-2 text-center text-zinc-400">
          <ImageIcon className="w-6 h-6 mb-1" />
          <span className="text-[10px]">No image selected</span>
        </div>
      )}
      
      {error && <p className="text-xs text-red-500">{error}</p>}
      
      <div className="flex gap-2">
        <input 
          type="text" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Image URL..."
          className="flex-1 px-2 py-1 text-xs border border-zinc-200 rounded-md bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 min-w-0"
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          ref={fileInputRef}
          className="hidden" 
        />
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0 disabled:opacity-50"
          title="Upload Image"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-600" /> : <Upload className="w-3.5 h-3.5 text-zinc-600" />}
        </button>
      </div>
    </div>
  );
};

export default ImageField;