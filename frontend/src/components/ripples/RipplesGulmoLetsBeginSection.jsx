import React from 'react';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';

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
    
  const slash = pathStr.startsWith('/') ? '' : '/';
  return `${baseUrl}${slash}${pathStr}`;
};

const RipplesGulmoLetsBeginSection = ({ data }) => {
  const mainImgSrc = data?.imageMain ? getAssetUrl(data.imageMain) : gallery1;
  const overlayImgSrc = data?.imageOverlay ? getAssetUrl(data.imageOverlay) : gallery2;

  return (
    <section className="w-full bg-white text-[#1f2937] py-12 sm:py-24 lg:py-32 px-4 sm:px-10 lg:px-16 overflow-hidden select-none font-kanit">
      <div className="max-w-6xl mx-auto">
        <div className="relative flex justify-end gap-8 md:gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Intro & Store CTA */}
          
          <div className=" absolute bottom-0 left-50 space-y-6 md:space-y-8 pr-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-reem tracking-tighter text-[#1c2826] leading-none">
              {data?.title || "Let's begin"}
            </h2>

            <p className="text-sm sm:text-base md:text-[17px] text-[#555a60] font-kanit font-light leading-relaxed max-w-[500px] whitespace-pre-wrap">
              {data?.description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
            </p>

            {/* Store Link & Button */}
            <div className="flex items-center justify-end gap-4 sm:gap-6 md:gap-8 flex-wrap">
              <span className="text-lg sm:text-xl md:text-[22px] font-black tracking-tight text-[#1c2826]">
                {data?.storeUrlText || 'naturecube.store'}
              </span>

              <a
                href={data?.storeUrl || "https://naturecube.store"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7BA641] hover:bg-[#6b9337] text-white text-xs sm:text-sm font-bold tracking-widest px-8 py-3 rounded-none uppercase transition-all duration-300 shadow-sm hover:shadow-[0_4px_14px_rgba(123,166,65,0.4)] cursor-pointer inline-block"
              >
                {data?.btnText || 'STORE'}
              </a>
              </div>
          
              
          </div>

          {/* Right Column: 2 Overlapping Gallery Image Frames (Fluid Responsive Layout) */}
          <div className="relative flex justify-end w-full md:max-w-none mx-auto md:ml-0 pt-4 md:pt-0">
            <div className="relative h-[650px] w-[550px]">
              
              {/* Primary Main Image Frame */}
              <div className="absolute top-0 w-[66%] sm:w-[300px] md:w-[320px] lg:w-[380px] h-[230px] xs:h-[280px] sm:h-[370px] md:h-[390px] lg:h-[450px] rounded-xs overflow-hidden shadow-xl bg-zinc-100 transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src={mainImgSrc}
                  alt="Nature Cube Terrarium Showcase 1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary Overlapping Image Frame */}
              <div className="absolute bottom-0 right-10 w-[54%] sm:w-[220px] md:w-[240px] lg:w-[280px] h-[170px] xs:h-[210px] sm:h-[250px] md:h-[270px] lg:h-[300px] rounded-xs overflow-hidden shadow-2xl bg-zinc-100 z-10 border-2 xs:border-4 border-white transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={overlayImgSrc}
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

export default RipplesGulmoLetsBeginSection;