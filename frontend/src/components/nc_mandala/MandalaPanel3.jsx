import React from 'react';
import darkMandalaImg from '../../assets/nc_mandala/dark_Mandala.png';
import fishImg from '../../assets/nc_mandala/fish.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const MandalaPanel3 = ({ data }) => {
  // Dynamic variables with default fallbacks
  const title = data?.title || "elements of balance";
  const desc = data?.desc || "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>";
  const tagline1 = data?.tagline1 || "LIQUID LANDSCAPES MIRRORED IN MINDFUL ART,";
  const tagline2 = data?.tagline2 || "A LIVING MANDALA'S HEART.";
  
  const mandalaImageSrc = data?.mandalaImage ? resolveAssetUrl(data.mandalaImage) : darkMandalaImg;
  const fishImageSrc = data?.fishImage ? resolveAssetUrl(data.fishImage) : fishImg;

  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-800 flex-shrink-0 relative flex flex-col justify-center items-center pt-32 sm:pt-36 lg:pt-38 pb-12 sm:pb-16 px-8 sm:px-14 lg:px-24 select-none font-kanit overflow-hidden">
      
      {/* Swimming Neon Tetra Fish Overlay Top Right */}
      <div className="absolute top-[14%] sm:top-[10%] right-[5vw] lg:right-[5vw] z-20 pointer-events-none w-28 sm:w-40 lg:w-38">
        <img
          src={fishImageSrc}
          alt="Neon Tetra Fishes"
          className="w-full h-auto object-contain"
        />
      </div>
       <div className="absolute top-[14%] sm:top-[18%] right-[9vw] lg:right-[10vw] z-20 pointer-events-none w-28 sm:w-40 lg:w-48">
        <img
          src={fishImageSrc}
          alt="Neon Tetra Fishes"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Main Container holding Split Dark Mandala & Text */}
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 lg:gap-12 pl-12 sm:pl-24 lg:pl-32 pr-4 sm:pr-8">
        
        {/* Left Visual Composition: Green Blob + Split Dark Mandala Artwork */}
        <div className="relative flex-shrink-0 w-[260px] sm:w-[320px] md:w-[360px] lg:w-[400px] aspect-square flex items-center justify-center">
          
          {/* Light Green Watercolor Splash Background */}
          <div className="absolute inset-0 z-0 bg-[#E5EED7]/75 rounded-full blur-2xl scale-105 pointer-events-none" />

          {/* Split Dark Mandala Circle Image */}
          <img
            src={mandalaImageSrc}
            alt="Dark Split Mandala Art"
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Right Text Description & Tagline matching screenshot */}
        <div className="max-w-xs sm:max-w-sm lg:max-w-md space-y-6 pt-2 md:pt-4">
          
          {/* Title: "elements of balance" (lowercase bold dark text) */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight lowercase font-kanit">
            {title}
          </h2>

          {/* Body Paragraph: Indented to the right underneath title */}
          <div 
            className="pl-8 sm:pl-14 lg:pl-16 text-xs sm:text-sm text-[#6A6A6A] font-normal leading-relaxed text-left tiptap-content [&>p]:mb-0"
            dangerouslySetInnerHTML={{ __html: desc }}
          />

          {/* Bottom Bold Tagline */}
          <div className="pt-4">
            <h3 className="text-xs sm:text-sm lg:text-[14px] font-extrabold tracking-wider text-[#0F242A] uppercase leading-snug font-kanit">
              <div>{tagline1}</div>
              <div>{tagline2}</div>
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MandalaPanel3;