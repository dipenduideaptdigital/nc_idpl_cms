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
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-center font-kanit italic font-medium text-2xl xs:text-3xl sm:text-4xl md:text-[46px] text-[#7BA641] tracking-wide mb-6 sm:mb-12 md:mb-16">
            {data?.section1Title || 'What is Nature Aquarium?'}
          </h2>

          <div className="relative w-full rounded-sm overflow-hidden shadow-md border border-zinc-100 group h-[270px] xs:h-[300px] sm:h-[340px] md:h-[400px] lg:h-[500px] flex items-end sm:items-center">
            <img
              src={card1ImgSrc}
              alt={data?.section1Title || 'What is Nature Aquarium'}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent sm:bg-gradient-to-l sm:from-black/85 sm:via-black/45 sm:to-transparent pointer-events-none" />

            <div className="relative z-10 w-full flex justify-end p-4 xs:p-5 sm:p-8 md:p-12">
              <div className="max-w-full sm:max-w-md space-y-2 xs:space-y-3 sm:space-y-4 text-white">
                <h3 className="font-kanit text-[15px] xs:text-base sm:text-lg md:text-xl lg:text-[22px] font-bold leading-snug xs:leading-normal sm:leading-snug drop-shadow-sm">
                  {data?.card1Title || 'It is a long established fact that a reader will be distracted.'}
                </h3>
                
                <p className="font-kanit text-[13px] xs:text-sm sm:text-[15px] font-light text-zinc-200/90 leading-snug xs:leading-relaxed whitespace-pre-wrap">
                  {data?.card1Description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
                </p>

                <div className="pt-1">
                  <button 
                    onClick={() => {
                      const event = new CustomEvent('open-consultation-modal');
                      window.dispatchEvent(event);
                    }}
                    className="group/btn inline-flex items-center gap-2 text-zinc-200 hover:text-[#7BA641] transition-colors cursor-pointer"
                  >
                    <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-sm group-hover/btn:bg-[#7BA641] text-zinc-200 group-hover/btn:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover/btn:shadow-[0_0_12px_rgba(123,166,65,0.5)] group-active/btn:scale-95">
                      <svg 
                        className="w-3 h-3 xs:w-3.5 xs:h-3.5 transition-transform duration-300 group-hover/btn:rotate-90" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span className="font-kanit text-[13px] xs:text-sm sm:text-sm font-semibold tracking-wide lowercase text-zinc-200 group-hover/btn:text-[#7BA641] transition-colors">
                      explore
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: OUR PROJECTS */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3 ml-0 sm:ml-6 md:ml-10 mb-4 sm:mb-8 md:mb-10">
            <h2 className="font-kanit text-xl xs:text-2xl sm:text-3xl md:text-[32px] font-bold text-zinc-900 tracking-wider uppercase">
              {data?.section2Title || 'OUR PROJECTS'}
            </h2>
            <p className="font-kanit text-xs xs:text-sm sm:text-base md:text-lg text-zinc-600 font-light max-w-2xl leading-relaxed whitespace-pre-wrap">
              {data?.section2Description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
            </p>
          </div>

          <div className="relative w-full rounded-sm overflow-hidden shadow-md border border-zinc-100 group h-[220px] xs:h-[260px] sm:h-[320px] md:h-[400px] lg:h-[500px]">
            <img
              src={card2ImgSrc}
              alt={data?.section2Title || 'Our Projects Aquascape'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 xs:p-5 sm:p-6 flex justify-center text-center">
              <p className="font-kanit text-[13px] xs:text-sm sm:text-base font-semibold text-white drop-shadow-md tracking-wide">
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