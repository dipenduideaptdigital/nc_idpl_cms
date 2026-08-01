import React from 'react';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';

const GulmoLetsBeginSection = () => {
  return (
    <section className="w-full bg-white text-[#1f2937] py-16 sm:py-24 lg:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden select-none font-kanit">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Intro & Store CTA */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1c2826]">
              Let's begin
            </h2>

            <p className="text-base sm:text-lg text-[#555a60] font-light leading-relaxed max-w-md">
              Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.
            </p>

            {/* Store Link & Button */}
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap pt-4 sm:pt-6">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c2826]">
                naturecube.store
              </span>

              <a
                href="https://naturecube.store"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7BA641] hover:bg-[#6b9337] text-white text-xs sm:text-sm font-semibold tracking-wider px-7 py-2.5 rounded-xs uppercase transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(123,166,65,0.4)] cursor-pointer inline-block"
              >
                STORE
              </a>
            </div>
          </div>

          {/* Right Column: 2 Overlapping Gallery Image Frames */}
          <div className="lg:col-span-6 relative w-full max-w-[500px] lg:max-w-none mx-auto lg:ml-0  pt-6 lg:pt-0">
            <div className="relative flex justify-start lg:justify-end pb-12 sm:pb-30 pr-6 sm:pr-12">
              
              {/* Primary Main Image Frame (gallery1.png) */}
              <div className="w-[260px] sm:w-[340px] md:w-[380px] h-[320px] sm:h-[400px] md:h-[450px] rounded-xs overflow-hidden shadow-xl bg-zinc-100 transition-transform duration-500 hover:scale-[1.01] mr-10">
                <img
                  src={gallery1}
                  alt="Nature Cube Terrarium Showcase 1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary Overlapping Image Frame (gallery2.png) */}
              <div className="absolute -bottom-2 sm:bottom-0 right-0 sm:right-2 w-[190px] sm:w-[250px] md:w-[280px] h-[210px] sm:h-[270px] md:h-[300px] rounded-xs overflow-hidden shadow-2xl bg-zinc-100 z-10 border-4 border-white transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={gallery2}
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