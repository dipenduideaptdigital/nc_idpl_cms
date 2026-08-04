import React from 'react';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const PrakritiLetsBeginSection = ({ data }) => {
  const title = data?.title || "Let's begin";
  const description = data?.description || 'Transform your indoor spaces with living art. Explore our curated collections of botanical aquascapes, terrariums, and custom biomes built by Prakriti Lab.';
  const storeUrlText = data?.storeUrlText || 'naturecube.store';
  const storeUrl = data?.storeUrl || "https://naturecube.store";
  const btnText = data?.btnText || 'STORE';
  
  const imageMainSrc = data?.imageMain ? getAssetUrl(data.imageMain) : gallery1;
  const imageOverlaySrc = data?.imageOverlay ? getAssetUrl(data.imageOverlay) : gallery2;

  return (
    <section className="w-full bg-white text-[#1f2937] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden select-none font-kanit border-t border-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Intro & Store CTA */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#7BA641] uppercase block">
              Prakriti Lab Studio
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1c2826]">
              {title}
            </h2>
            
            <div 
              className="text-base sm:text-lg text-[#555a60] font-light leading-relaxed max-w-md tiptap-content"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {/* Store Link & Button */}
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap pt-4 sm:pt-6">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c2826]">
                {storeUrlText}
              </span>
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7BA641] hover:bg-[#6b9337] text-white text-xs sm:text-sm font-semibold tracking-wider px-8 py-3 rounded-xs uppercase transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(123,166,65,0.4)] cursor-pointer inline-block"
              >
                {btnText}
              </a>
            </div>
          </div>

          {/* Right Column: 2 Overlapping Gallery Image Frames */}
          <div className="lg:col-span-6 relative w-full max-w-[500px] lg:max-w-none mx-auto lg:ml-0 pt-6 lg:pt-0">
            <div className="relative flex justify-start lg:justify-end pb-12 sm:pb-30 pr-6 sm:pr-12">
              
              {/* Primary Main Image Frame */}
              <div className="w-[260px] sm:w-[340px] md:w-[380px] h-[320px] sm:h-[400px] md:h-[450px] rounded-sm overflow-hidden shadow-xl bg-zinc-100 transition-transform duration-500 hover:scale-[1.01] mr-10">
                <img
                  src={imageMainSrc}
                  alt="Prakriti Lab Showcase 1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary Overlapping Image Frame */}
              <div className="absolute -bottom-2 sm:bottom-0 right-0 sm:right-2 w-[190px] sm:w-[250px] md:w-[280px] h-[210px] sm:h-[270px] md:h-[300px] rounded-sm overflow-hidden shadow-2xl bg-zinc-100 z-10 border-4 border-white transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={imageOverlaySrc}
                  alt="Prakriti Lab Showcase 2"
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

export default PrakritiLetsBeginSection;