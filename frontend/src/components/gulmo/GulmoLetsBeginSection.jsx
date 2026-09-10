import React from 'react';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';

const GulmoLetsBeginSection = ({ data }) => {
  return (
    <section className="w-full bg-white text-[#1f2937] py-12 sm:py-24 lg:py-32 px-4 sm:px-10 lg:px-16 overflow-hidden select-none font-kanit">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Intro & Store CTA */}
          <div className="w-full md:w-1/2 space-y-6 md:space-y-8 pr-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-reem font-normal  tracking-tight text-[#333] leading-none">
              {data?.title || "Let's begin"}
            </h2>

            <p className="text-sm sm:text-base md:text-[17px] text-[#555a60] font-kanit font-light leading-relaxed max-w-[420px] whitespace-pre-wrap">
              {data?.description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
            </p>

            {/* Store Link & Button */}
            <div className="flex items-center justify-between w-full max-w-[420px] pt-4 sm:pt-6">
              <span className="text-lg sm:text-xl md:text-[22px] font-medium tracking-tight text-zinc-500">
                {data?.storeUrlText || 'naturecube.store'}
              </span>

              <a
                href={data?.storeUrl || "https://naturecube.store"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7BA641] hover:bg-[#6b9337] text-white text-sm sm:text-sm font-normal tracking-widest px-8 py-3 rounded-none uppercase transition-all duration-300 shadow-sm hover:shadow-[0_4px_14px_rgba(123,166,65,0.4)] cursor-pointer inline-block"
              >
                {data?.btnText || 'STORE'}
              </a>
            </div>
          </div>

          {/* Right Column: 2 Overlapping Gallery Image Frames (Fluid Responsive Layout) */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start pt-12 md:pt-0 pb-16 md:pb-0 md:pl-10">
            {/* Wrapper bounded to primary image size */}
            <div className="relative w-[280px] sm:w-[320px] md:w-[340px] lg:w-[380px] h-[340px] sm:h-[380px] md:h-[400px] lg:h-[450px]">
              
              {/* Primary Main Image Frame */}
              <div className="w-full h-full rounded-xs overflow-hidden shadow-xl bg-zinc-100 transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src={data?.imageMain || gallery1}
                  alt="Nature Cube Terrarium Showcase 1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary Overlapping Image Frame (Starts at 50% left & 50% top) */}
              <div className="absolute top-[50%] left-[50%] w-[75%] aspect-square rounded-xs overflow-hidden shadow-2xl bg-zinc-100 z-10 transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={data?.imageOverlay || gallery2}
                  alt="Nature Cube Terrarium Showcase 2"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default GulmoLetsBeginSection;