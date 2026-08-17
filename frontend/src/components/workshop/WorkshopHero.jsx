import React from 'react';
import workshopBg from '../../assets/nc_home/Workshop_hero.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (typeof path === 'object' && path.url) return getAssetUrl(path.url);
  if (typeof path !== 'string') return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/src/') || path.startsWith('/assets/') || path.startsWith('/@fs/')) return path;

  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
    
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

const WorkshopHero = ({ data }) => {
  const bgImage = data?.backgroundImage ? getAssetUrl(data.backgroundImage) : workshopBg;

  return (
    <section className="relative w-full h-[52vw] min-h-[280px] xs:min-h-[340px] sm:min-h-[440px] md:min-h-[560px] lg:min-h-[680px] lg:h-[calc(100vh-2rem)] max-h-[900px] -mt-20 sm:-mt-24 overflow-hidden select-none bg-black">
      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bgImage}
          alt="Terrarium Workshop by Gautam Gupta"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-[75%_center] sm:object-center scale-100 transition-all duration-500 ease-out"
        />
        {/* Top Dark Overlay Gradient for Navbar Contrast */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
        
        {/* Bottom Dark Gradient for Smooth Section Blend */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
};

export default WorkshopHero;