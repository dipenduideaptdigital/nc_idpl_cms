import React from 'react';
import aqua1 from '../../assets/nc_home/aqua1.png';
import aqua2 from '../../assets/nc_home/aqua2.png';

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

const RipplesNatureAquariumSection = ({ data }) => {
  const card1ImgSrc = data?.card1Image ? getAssetUrl(data.card1Image) : aqua1;
  const card2ImgSrc = data?.card2Image ? getAssetUrl(data.card2Image) : aqua2;

  return (
    <section className="w-full bg-white select-none font-kanit py-10 md:py-18 px-4 sm:px-8 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto space-y-14 sm:space-y-20 md:space-y-28">
        
        {/* Section 1: What is Nature Aquarium? */}
        <div className="min-h-[85vh] lg:min-h-screen flex flex-col justify-center space-y-8 sm:space-y-12 lg:space-y-16 pt-8 pb-16">
          <h2 className="text-center font-larken italic font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[68px] text-[#6CA844] tracking-wide flex-shrink-0">
            {data?.section1Title || 'What is Nature Aquarium?'}
          </h2>

          <div className="relative w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] lg:w-[calc(100vw-8rem)] left-1/2 right-1/2 -ml-[calc(50vw-1rem)] md:-ml-[calc(50vw-2rem)] lg:-ml-[calc(50vw-4rem)] rounded-md overflow-hidden group flex-grow min-h-[400px] lg:min-h-[65vh] flex items-end sm:items-center">
            <img
              src={card1ImgSrc}
              alt={data?.section1Title || 'What is Nature Aquarium'}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            {/* Dark gradient overlay for text readability - only covers the right side */}
            <div className="absolute inset-y-0 right-0 w-full sm:w-[80%] md:w-[70%] lg:w-[60%] bg-gradient-to-t from-[#0e222b] via-[#0e222b]/90 to-transparent sm:bg-gradient-to-l sm:from-[#0e222b] sm:from-40% sm:via-[#0e222b]/80 sm:to-transparent pointer-events-none" />

            <div className="relative z-10 w-full flex justify-end px-6 sm:px-12 md:px-20 lg:px-32 py-8 sm:py-12 md:py-16">
              <div className="max-w-full sm:max-w-lg lg:max-w-xl space-y-4 sm:space-y-6 lg:space-y-8 text-white">
                <h3 className="font-kanit text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-bold leading-snug drop-shadow-md">
                  {data?.card1Title || 'It is a long established fact\nthat a reader will be\ndistracted.'}
                </h3>
                
                <p className="font-kanit text-sm sm:text-base lg:text-[18px] font-light text-zinc-200 leading-relaxed whitespace-pre-wrap max-w-md">
                  {data?.card1Description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
                </p>

                <div className="pt-2 lg:pt-4">
                  <button 
                    onClick={() => {
                      const event = new CustomEvent('open-consultation-modal');
                      window.dispatchEvent(event);
                    }}
                    className="group/btn inline-flex items-center gap-4 lg:gap-5 cursor-pointer"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-[#7BA641] group-hover/btn:border-[#7BA641] group-hover/btn:shadow-[0_4px_14px_rgba(123,166,65,0.4)] group-active/btn:scale-95">
                      <svg 
                        className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/btn:rotate-90" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span className="font-kanit text-base md:text-[20px] font-medium tracking-wide lowercase text-zinc-100 group-hover/btn:text-[#7BA641] transition-colors">
                      explore
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: OUR PROJECTS */}
        <div className="min-h-[85vh] lg:min-h-screen flex flex-col justify-center space-y-8 sm:space-y-12 lg:space-y-16 pt-8 pb-16">
          <div className="relative w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] lg:w-[calc(100vw-8rem)] left-1/2 right-1/2 -ml-[calc(50vw-1rem)] md:-ml-[calc(50vw-2rem)] lg:-ml-[calc(50vw-4rem)] flex-shrink-0 space-y-4 sm:space-y-6">
            <h2 className="font-reem text-3xl sm:text-4xl md:text-[42px] font-bold text-[#0e222b] tracking-wide uppercase">
              {data?.section2Title || 'OUR PROJECTS'}
            </h2>
            <p className="font-kanit text-lg sm:text-2xl md:text-[40px] text-zinc-500 font-light max-w-5xl leading-snug whitespace-pre-wrap">
              {data?.section2Description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
            </p>
          </div>

          <div className="relative w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] lg:w-[calc(100vw-8rem)] left-1/2 right-1/2 -ml-[calc(50vw-1rem)] md:-ml-[calc(50vw-2rem)] lg:-ml-[calc(50vw-4rem)] rounded-md overflow-hidden group">
            <img
              src={card2ImgSrc}
              alt={data?.section2Title || 'Our Projects Aquascape'}
              className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 sm:p-8 md:p-10 flex justify-center text-center z-10">
              <p className="font-kanit text-sm sm:text-base md:text-xl font-semibold text-white drop-shadow-md tracking-wide max-w-7xl mx-auto px-4">
                {data?.card2Caption || 'It is a long established fact that a reader will be distracted.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RipplesNatureAquariumSection;