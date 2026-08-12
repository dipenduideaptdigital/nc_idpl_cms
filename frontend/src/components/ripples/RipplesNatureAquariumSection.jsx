import React from 'react';
import aqua1 from '../../assets/nc_home/aqua1.png';
import aqua2 from '../../assets/nc_home/aqua2.png';
import ellipseBtnImg from '../../assets/nc_logo/Ellipse_plus_btn.png';

const RipplesNatureAquariumSection = ({ data }) => {
  return (
    <section className="w-full bg-white select-none font-kanit py-10 md:py-18 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto space-y-20 md:space-y-28">
        
        <div className="space-y-7 md:space-y-5">
          <h2 className="text-center font-kanit italic font-medium text-3xl mb-20 sm:text-4xl md:text-[46px] text-[#7BA641] tracking-wide">
            {data?.section1Title || 'What is Nature Aquarium?'}
          </h2>

          <div className="relative w-full rounded-sm overflow-hidden shadow-md border border-zinc-100 group h-[260px] sm:h-[320px] md:h-[360px] lg:h-[500px] flex items-center">
            <img
              src={data?.card1Image || aqua1}
              alt={data?.section1Title || 'What is Nature Aquarium'}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative w-full flex justify-end p-6 sm:p-8 md:p-12">
              <div className="max-w-md space-y-3 md:space-y-4 text-white">
                <h3 className="font-kanit text-base sm:text-lg md:text-xl lg:text-[22px] font-bold leading-snug drop-shadow-sm">
                  {data?.card1Title || 'It is a long established fact that a reader will be distracted.'}
                </h3>
                
                <p className="font-kanit text-xs sm:text-sm font-light text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {data?.card1Description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
                </p>

                <div className="pt-1">
                  <button 
                    onClick={() => {
                      const event = new CustomEvent('open-consultation-modal');
                      window.dispatchEvent(event);
                    }}
                    className="group/btn inline-flex items-center gap-2.5 text-zinc-200 hover:text-[#7BA641] transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-sm group-hover/btn:bg-[#7BA641] text-zinc-200 group-hover/btn:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover/btn:shadow-[0_0_12px_rgba(123,166,65,0.5)] group-active/btn:scale-95">
                      <svg 
                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:rotate-90" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span className="font-kanit text-xs font-semibold tracking-wide lowercase text-zinc-200 group-hover/btn:text-[#7BA641] transition-colors">
                      explore
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3 ml-10 mb-10">
            <h2 className="font-kanit text-2xl sm:text-3xl md:text-[32px] font-bold text-zinc-900 tracking-wider uppercase">
              {data?.section2Title || 'OUR PROJECTS'}
            </h2>
            <p className="font-kanit text-sm sm:text-base md:text-lg text-zinc-600 font-light max-w-2xl leading-relaxed whitespace-pre-wrap">
              {data?.section2Description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
            </p>
          </div>

          <div className="relative w-full rounded-sm overflow-hidden shadow-md border border-zinc-100 group h-[260px] sm:h-[320px] md:h-[360px] lg:h-[500px]">
            <img
              src={data?.card2Image || aqua2}
              alt={data?.section2Title || 'Our Projects Aquascape'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-6 flex justify-center text-center">
              <p className="font-kanit text-xs sm:text-sm md:text-base font-semibold text-white drop-shadow-md tracking-wide">
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