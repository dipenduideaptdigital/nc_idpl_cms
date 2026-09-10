import React from 'react';
import rippleBg from '../../assets/nc_home/ripple_bg.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (typeof path === 'object' && path.url) return getAssetUrl(path.url);
  const pathStr = String(path);
  if (
    pathStr.startsWith('http') || 
    pathStr.startsWith('data:') || 
    pathStr.startsWith('blob:') || 
    pathStr.startsWith('/src/') || 
    pathStr.startsWith('/assets/') ||
    pathStr.startsWith('/@fs/')
  ) {
    return pathStr;
  }
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${pathStr.startsWith('/') ? pathStr : `/${pathStr}`}`;
};

const RipplesHero = ({ data }) => {
  const bgImage = data?.backgroundImage ? getAssetUrl(data.backgroundImage) : rippleBg;
  const title = data?.title || data?.headline || "";
  const tagline = data?.tagline || data?.subTitle || "";
  const description = data?.description || "";

  return (
    <section className="relative w-full h-[60vh] sm:h-[72vh] md:h-[85vh] lg:h-screen min-h-[380px] sm:min-h-[480px] -mt-24 overflow-hidden select-none bg-[#070e06]">
      {/* Background Image & Overlay Layers */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bgImage}
          alt="Ripples Aquatic Studio Aquascape"
          className="w-full h-full object-cover object-[center_35%] md:object-center scale-100 sm:scale-102 md:scale-105 filter brightness-95 contrast-105 transition-all duration-700"
        />
        {/* Top gradient for header navigation readability */}
        <div className="absolute top-0 left-0 right-0 h-36 sm:h-44 bg-gradient-to-b to-transparent pointer-events-none z-10" />
        {/* Bottom gradient for smooth section blending */}
        <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-t from-[#070e06] via-[#070e06]/35 to-transparent pointer-events-none z-10" />
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none z-10" />
      </div>

      {/* Hero Content Overlay (if data props exist) */}
      {(title || tagline || description) && (
        <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-8 md:px-12 lg:px-20 flex flex-col justify-end pb-12 sm:pb-20 md:pb-28">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            {tagline && (
              <span className="font-kanit text-xs sm:text-sm md:text-base font-semibold text-[#7BA641] uppercase tracking-[0.2em] block">
                {tagline}
              </span>
            )}
            {title && (
              <h1 className="font-reem text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide uppercase leading-tight drop-shadow-xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="font-kanit text-sm sm:text-base md:text-lg text-zinc-200/90 font-light leading-relaxed max-w-xl drop-shadow">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default RipplesHero;