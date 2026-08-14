import React from 'react';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';

const GulmoLetsBeginSection = ({ data }) => {
  return (
    <section className="w-full bg-white text-[#1f2937] py-12 sm:py-24 lg:py-32 px-4 sm:px-10 lg:px-16 overflow-hidden select-none font-kanit">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Intro & Store CTA */}
          <div className="md:col-span-6 space-y-6 md:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1c2826]">
              {data?.title || "Let's begin"}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#555a60] font-light leading-relaxed max-w-md whitespace-pre-wrap">
              {data?.description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
            </p>

            {/* Store Link & Button */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-wrap pt-4 sm:pt-6">
              <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#1c2826]">
                {data?.storeUrlText || 'naturecube.store'}
              </span>

              <a
                href={data?.storeUrl || "https://naturecube.store"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7BA641] hover:bg-[#6b9337] text-white text-xs sm:text-sm font-semibold tracking-wider px-6 sm:px-7 py-2.5 rounded-xs uppercase transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(123,166,65,0.4)] cursor-pointer inline-block"
              >
                {data?.btnText || 'STORE'}
              </a>
            </div>
          </div>

          {/* Right Column: 2 Overlapping Gallery Image Frames (Fluid Responsive Layout) */}
          <div className="md:col-span-6 relative w-full max-w-[360px] xs:max-w-[420px] sm:max-w-[500px] md:max-w-none mx-auto md:ml-0 pt-4 md:pt-0">
            <div className="relative flex justify-start md:justify-end pb-12 xs:pb-16 sm:pb-24 md:pb-28 pr-2 sm:pr-6 md:pr-8">
              
              {/* Primary Main Image Frame */}
              <div className="w-[66%] sm:w-[300px] md:w-[320px] lg:w-[380px] h-[230px] xs:h-[280px] sm:h-[370px] md:h-[390px] lg:h-[450px] rounded-xs overflow-hidden shadow-xl bg-zinc-100 transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src={data?.imageMain || gallery1}
                  alt="Nature Cube Terrarium Showcase 1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary Overlapping Image Frame */}
              <div className="absolute bottom-0 right-0 sm:right-2 w-[54%] sm:w-[220px] md:w-[240px] lg:w-[280px] h-[170px] xs:h-[210px] sm:h-[250px] md:h-[270px] lg:h-[300px] rounded-xs overflow-hidden shadow-2xl bg-zinc-100 z-10 border-2 xs:border-4 border-white transition-transform duration-500 hover:scale-[1.02]">
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