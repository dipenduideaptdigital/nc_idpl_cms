import React from 'react';
import defaultGallery1 from '../../assets/homepage/gallery1.png';
import defaultGallery2 from '../../assets/homepage/gallery2.png';
import defaultGallery3 from '../../assets/homepage/gallery3.png';

const getAssetUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.includes('/assets/homepage/')) return fallback;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const GallerySection = ({ data }) => {
  const defaultImages = [
    defaultGallery1, defaultGallery2, defaultGallery3,
    defaultGallery1, defaultGallery2, defaultGallery3
  ];
  
  const images = (data?.images?.length > 0 ? data.images : defaultImages).map((img, idx) => 
    getAssetUrl(img, defaultImages[idx % defaultImages.length])
  );

  return (
    <section className="py-24 px-4 bg-white text-center">
      <div className="container mx-auto max-w-[1200px]">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900 tracking-tight">
          {data?.title || 'Gallery'}
        </h2>
        <p className="text-zinc-600 mb-16 text-lg md:text-xl font-medium max-w-3xl mx-auto">
          {data?.subtitle || 'Showcasing Interiors That Inspire, Perform, And Endure'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {images.map((img, idx) => (
            <div key={idx} className="relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 aspect-[16/10] bg-zinc-100">
              <img 
                src={img} 
                alt={`Gallery visual ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
