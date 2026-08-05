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
    <section className="relative w-full min-h-[500px] md:min-h-[650px] lg:h-screen -mt-24 overflow-hidden select-none bg-black">
      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bgImage}
          alt="Terrarium Workshop by Gautam Gupta"
          className="w-full h-full object-cover object-center scale-100"
        />
        {/* Top Dark Overlay Gradient for Navbar Contrast */}
        <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default WorkshopHero;