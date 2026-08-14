import React, { useState } from 'react';
import bush3 from '../../assets/nc_logo/bush3.png';
import card1 from '../../assets/nc_home/plab3.png';
import card2 from '../../assets/nc_home/plab4.png';
import card3 from '../../assets/nc_home/card3.png';

// Upgraded getAssetUrl: Handles deeper Puck ImageField objects & string paths flawlessly
const getAssetUrl = (path) => {
  if (!path) return '';

  let urlPath = path;

  if (typeof path === 'object') {
    urlPath = path.url || path.src || path.path || '';
  }

  if (typeof urlPath !== 'string' || !urlPath) return '';

  if (urlPath.startsWith('http') || urlPath.startsWith('data:')) return urlPath;

  if (urlPath.startsWith('/src/') || urlPath.startsWith('/assets/') || urlPath.startsWith('/@fs/')) {
    return urlPath;
  }

  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';

  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;

  return `${cleanBaseUrl}${cleanPath}`;
};

const defaultWorkshops = [
  { id: 1, title: "TERRARIUM WORKSHOP", image: card1 },
  { id: 2, title: "NATURE AQUARIUM WORKSHOP", image: card2 },
  { id: 3, title: "BIOPHILIC ART WORKSHOP", image: card3 }
];

const PrakritiUpcomingWorkshopsSection = (props) => {
  const blockData = props?.data || props || {};

  const [currentIndex, setCurrentIndex] = useState(0);

  const heading = blockData.heading || "UPCOMING WORKSHOPS";
  const subtext = blockData.subtext || "It is a long\nestablished fact\nthat a reader will\nbe distracted.";
  const buttonText = blockData.buttonText || "Reserve Your Seat";

  // Array Fallbacks for Workshops
  const dynamicWorkshops = blockData.workshops || blockData.cards || blockData.items || [];
  const workshops = dynamicWorkshops.length > 0 ? dynamicWorkshops : defaultWorkshops;

  const currentWorkshop = workshops[currentIndex] || workshops[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % workshops.length);
  };

  const handleReserve = () => {
    window.dispatchEvent(new CustomEvent('open-consultation-modal'));
  };

  return (
    <section className="relative w-full bg-[#FAFAF7] text-zinc-900 py-16 sm:py-28 lg:py-36 px-4 sm:px-12 lg:px-20 xl:px-24 overflow-hidden select-none font-kanit">
      
      {/* Top-Left Paint Splash */}
      <div className="absolute -top-20 -left-20 sm:-top-28 sm:-left-24 md:-top-32 md:-left-28 w-[320px] sm:w-[520px] md:w-[620px] aspect-square pointer-events-none z-0">
        <img
          src={bush3}
          alt="Paint Splash Accent"
          className="w-full h-full object-contain object-left-top opacity-55 filter brightness-105 contrast-105"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-6 sm:space-y-10 pr-0 lg:pr-4">
          <h2 className="font-kanit font-bold text-3xl sm:text-4xl lg:text-[40px] xl:text-[42px] text-[#1E293B] tracking-tight uppercase leading-tight">
            {heading}
          </h2>
          
          <div 
            className="font-kanit font-bold text-xl sm:text-[28px] text-[#6A6A6A] leading-snug whitespace-pre-line tiptap-content"
            dangerouslySetInnerHTML={{ __html: subtext }}
          />

          <div className="pt-4 sm:pt-10">
            <button
              onClick={handleReserve}
              className="font-kanit font-semibold text-lg text-[#7BA641] pb-1 border-b-2 border-[#7BA641] hover:opacity-80 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer group"
            >
              <span>{buttonText}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Stacked Cards Loop */}
        <div className="lg:col-span-5 relative w-full flex flex-col items-center sm:items-stretch lg:items-end justify-center pt-6 lg:pt-30">
          <div className="relative w-full max-w-[500px] xl:max-w-[540px] aspect-[4/3] sm:aspect-[1.25/1]">
            
            {workshops.map((ws, index) => {
              const uploadedImgField = ws.image || ws.imageUrl || ws.src || ws.picture;
              
              const adminImg = uploadedImgField ? getAssetUrl(uploadedImgField) : '';
              const fallbackImg = defaultWorkshops[index]?.image || card1;
              const finalImageSrc = adminImg || fallbackImg;

              const relativeIndex = (index - currentIndex + workshops.length) % workshops.length;
              
              let stackStyles = "";
              if (relativeIndex === 0) {
                stackStyles = "z-30 translate-y-0 translate-x-0 rotate-0 scale-100 opacity-100 shadow-2xl";
              } else if (relativeIndex === 1) {
                stackStyles = "z-20 -translate-y-3 -translate-x-4 rotate-1 scale-[0.97] opacity-90 shadow-lg";
              } else if (relativeIndex === 2) {
                stackStyles = "z-10 -translate-y-6 -translate-x-8 -rotate-1 scale-[0.94] opacity-70 shadow-md";
              } else {
                stackStyles = "z-0 -translate-y-8 -translate-x-10 scale-[0.9] opacity-0 pointer-events-none"; 
              }

              return (
                <div 
                  key={ws.id || index}
                  className={`absolute top-0 left-0 w-full h-full bg-white rounded-xs border border-zinc-200/90 p-2 sm:p-3 transition-all duration-700 ease-in-out origin-bottom-right ${stackStyles}`}
                >
                   <img
                      src={finalImageSrc}
                      alt={ws.title || 'Workshop'}
                      className="w-full h-full object-cover rounded-xs"
                    />
                </div>
              );
            })}

            {/* Exact Original Desktop Attached Dark Overlay Box (Hidden on mobile < sm) */}
            <div className="hidden sm:flex absolute -right-4 sm:-right-60 bottom-8 sm:bottom-12 z-40 bg-[#0C1A22] text-white p-5 sm:p-6 w-[210px] sm:w-[245px] rounded-xs shadow-2xl flex-col justify-between border border-zinc-800/80 min-h-[175px] sm:min-h-[195px]">
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
                  className="text-[#ffffff] hover:text-[#7BA641] transition-all duration-300 text-xl font-bold p-1 cursor-pointer flex items-center gap-1 group hover:scale-110 active:scale-95"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
            
          </div>

          {/* Mobile Black Card (Rendered below the image stack on small screens < sm with 100% visible image cards) */}
          <div className="sm:hidden w-full max-w-[400px] mt-6 z-40 bg-[#0C1A22] text-white p-4.5 rounded-xl shadow-xl flex flex-col justify-between border border-zinc-800/80">
            <div className="mb-3">
              <h3 className="font-kanit font-bold text-base tracking-wide uppercase text-white leading-tight">
                {currentWorkshop?.title}
              </h3>
            </div>

            {/* Pagination Counter & Navigation Button */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-700/60 font-kanit">
              <span className="text-sm font-medium tracking-widest text-zinc-200">
                {currentIndex + 1}/{workshops.length}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next Workshop"
                className="text-[#ffffff] hover:text-[#7BA641] transition-all duration-300 text-lg font-bold p-1 cursor-pointer flex items-center gap-2 group active:scale-95"
              >
                <span className="text-xs uppercase font-semibold tracking-wider text-[#7BA641]">Next</span>
                <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>


  );
};

export default PrakritiUpcomingWorkshopsSection;