import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const SpacesStories = ({ data }) => {
  const defaultImages = [defaultGallery1, defaultGallery2, defaultGallery3];
  const images = (data?.images?.length > 0 ? data.images : defaultImages).map((img, idx) => {
    const isString = typeof img === 'string';
    const rawUrl = isString ? img : img.url;
    const label = isString ? '' : img.label;
    return {
      url: getAssetUrl(rawUrl, defaultImages[idx] || defaultImages[0]),
      label: label
    };
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-24 bg-white text-zinc-900">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Top Content */}
        <div className="text-center max-w-4xl mx-auto mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-zinc-900">
            {data?.titleLine1 || 'Spaces. Stories.'} {data?.titleLine2 || 'Experiences.'}
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 font-medium">
            {data?.description || '26 Years Of Crafting Environments Defined By Excellence.'}
          </p>
        </div>

        {/* 3D Carousel */}
        <div className="relative w-full h-[350px] md:h-[480px] flex justify-center items-center overflow-hidden">
          {images.map((img, idx) => {
            const isActive = idx === currentIndex;
            const isPrev = idx === (currentIndex - 1 + images.length) % images.length;
            const isNext = idx === (currentIndex + 1) % images.length;

            let isPrevPrev = false;
            let isNextNext = false;
            if (images.length >= 5) {
               isPrevPrev = idx === (currentIndex - 2 + images.length) % images.length;
               isNextNext = idx === (currentIndex + 2) % images.length;
            }

            let classes = "absolute transition-all duration-700 ease-in-out transform cursor-pointer shadow-2xl";
            let zIndex = 0;

            if (isActive) {
              classes += " w-[85%] md:w-[55%] h-full z-30 scale-100 opacity-100";
              zIndex = 30;
            } else if (isPrev) {
              classes += " w-[75%] md:w-[45%] h-[85%] -translate-x-[45%] md:-translate-x-[65%] z-20 opacity-90 brightness-[0.5]";
              zIndex = 20;
            } else if (isNext) {
              classes += " w-[75%] md:w-[45%] h-[85%] translate-x-[45%] md:translate-x-[65%] z-20 opacity-90 brightness-[0.5]";
              zIndex = 20;
            } else if (isPrevPrev) {
              classes += " w-[65%] md:w-[35%] h-[70%] -translate-x-[85%] md:-translate-x-[115%] z-10 opacity-50 brightness-[0.3]";
              zIndex = 10;
            } else if (isNextNext) {
              classes += " w-[65%] md:w-[35%] h-[70%] translate-x-[85%] md:translate-x-[115%] z-10 opacity-50 brightness-[0.3]";
              zIndex = 10;
            } else {
              classes += " w-0 h-0 opacity-0 -z-10";
              zIndex = -10;
            }

            return (
              <div 
                key={idx} 
                className={classes} 
                style={{ zIndex }} 
                onClick={() => setCurrentIndex(idx)}
              >
                <img src={img.url} alt={img.label || `Gallery ${idx}`} className="w-full h-full object-cover" />
                {isActive && img.label && (
                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                    <h3 className="text-white text-3xl md:text-5xl font-bold tracking-tight drop-shadow-md">{img.label}</h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpacesStories;
