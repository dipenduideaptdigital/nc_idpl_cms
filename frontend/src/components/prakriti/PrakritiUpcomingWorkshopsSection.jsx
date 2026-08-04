import React, { useState } from 'react';
import bush3 from '../../assets/nc_logo/bush3.png';
import card1 from '../../assets/nc_home/plab3.png';
import card2 from '../../assets/nc_home/plab4.png';
import card3 from '../../assets/nc_home/card3.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  
  if (typeof path === 'object' && path.url) {
    return getAssetUrl(path.url);
  }
  
  if (typeof path !== 'string') return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/src/') || path.startsWith('/assets/') || path.startsWith('/@fs/')) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
    
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

const defaultWorkshops = [
  { id: 1, title: "TERRARIUM WORKSHOP", image: card1 },
  { id: 2, title: "NATURE AQUARIUM WORKSHOP", image: card2 },
  { id: 3, title: "BIOPHILIC ART WORKSHOP", image: card3 }
];

const PrakritiUpcomingWorkshopsSection = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const heading = data?.heading || "UPCOMING WORKSHOPS";
  const subtext = data?.subtext || "It is a long\nestablished fact\nthat a reader will\nbe distracted.";
  const buttonText = data?.buttonText || "Reserve Your Seat";
  const workshops = (data?.workshops && data.workshops.length > 0) ? data.workshops : defaultWorkshops;

  const currentWorkshop = workshops[currentIndex] || workshops[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % workshops.length);
  };

  const handleReserve = () => {
    window.dispatchEvent(new CustomEvent('open-consultation-modal'));
  };

  return (
    <section className="relative w-full bg-[#FAFAF7] text-zinc-900 py-20 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-20 xl:px-24 overflow-hidden select-none font-kanit">
      
      {/* Top-Left Paint Splash (bush3) */}
      <div className="absolute -top-20 -left-20 sm:-top-28 sm:-left-24 md:-top-32 md:-left-28 w-[420px] sm:w-[520px] md:w-[620px] aspect-square pointer-events-none z-0">
        <img
          src={bush3}
          alt=""
          className="w-full h-full object-contain object-left-top opacity-55 filter brightness-105 contrast-105"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Starts at top with UPCOMING WORKSHOPS */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-10 pr-0 lg:pr-4">
          <h2 className="font-kanit font-bold text-3xl sm:text-4xl lg:text-[40px] xl:text-[42px] text-[#1E293B] tracking-tight uppercase leading-tight">
            {heading}
          </h2>
          
          <div 
            className="font-kanit font-bold text-xl sm:text-[28px] text-[#6A6A6A] leading-snug whitespace-pre-line tiptap-content"
            dangerouslySetInnerHTML={{ __html: subtext }}
          />

          <div className="pt-6 sm:pt-10">
            <button
              onClick={handleReserve}
              className="font-kanit font-semibold text-lg text-[#7BA641] pb-1 border-b-2 border-[#7BA641] hover:opacity-80 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer group"
            >
              <span>{buttonText}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Poster Card Deck with Continuous Smooth Slide Track */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end pt-10 lg:pt-30">
          <div className="relative w-full max-w-[500px] xl:max-w-[540px]">
            
            <div className="absolute -top-5 -left-7 w-full h-full bg-white/70 rounded-xs shadow-md border border-zinc-200/50 transform -rotate-1 pointer-events-none" />
            <div className="absolute -top-2.5 -left-3.5 w-full h-full bg-white/90 rounded-xs shadow-lg border border-zinc-200/80 transform rotate-0.5 pointer-events-none" />
            
            {/* Layer 2: Main Poster Card Slider Track */}
            <div className="relative z-10 bg-white rounded-xs shadow-2xl border border-zinc-200/90 p-2 sm:p-3 overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out w-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {workshops.map((ws) => {
                  const imgSrc = ws.image ? getAssetUrl(ws.image) : '';
                  
                  return (
                    <div key={ws.id} className="w-full flex-shrink-0">
                      {imgSrc && (
                        <img
                          src={imgSrc}
                          alt={ws.title || 'Workshop'}
                          className="w-full h-auto object-contain rounded-xs"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attached Dark Overlay Box */}
            <div className="absolute -right-4 sm:-right-60 bottom-8 sm:bottom-30 z-20 bg-[#0C1A22] text-white p-5 sm:p-6 w-[210px] sm:w-[245px] rounded-xs shadow-2xl flex flex-col justify-between border border-zinc-800/80 min-h-[175px] sm:min-h-[195px]">
              <div className="mb-4">
                <h3 className="font-kanit font-bold text-lg sm:text-xl tracking-wide uppercase text-white leading-tight transition-all duration-500">
                  {currentWorkshop?.title}
                </h3>
              </div>
              
              {/* Pagination Counter & Navigation Button */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-700/60 font-kanit mt-auto">
                <span className="text-base sm:text-lg font-medium tracking-widest text-zinc-200">
                  {currentIndex + 1}/{workshops.length}
                </span>
                <button
                  onClick={handleNext}
                  aria-label="Next Workshop"
                  className="text-white hover:text-[#7BA641] transition-all duration-300 text-xl font-bold p-1 cursor-pointer flex items-center gap-1 group hover:scale-110 active:scale-95"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrakritiUpcomingWorkshopsSection;