import React from 'react';
import mandalaImg from '../../assets/nc_mandala/mandala.png';
import mountainImg from '../../assets/nc_mandala/mountain.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const MandalaPanel1 = ({ data }) => {
  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-800 flex-shrink-0 relative flex flex-col justify-between pt-32 sm:pt-36 lg:pt-38 pb-10 sm:pb-14 px-8 sm:px-14 lg:px-24 select-none font-kanit overflow-hidden">
      
      {/* Top Title & Subtitle matching second image layout */}
      <div className="space-y-1 relative z-10 max-w-2xl pl-2 sm:pl-6 lg:pl-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black tracking-wide uppercase leading-tight font-kanit">
          {data?.title || "LIVING MANDALAS"}
        </h1>
        
        {/* Subtitle block indented to the right under LIVING MANDALAS */}
        <div className="pl-16 sm:pl-24 lg:pl-32 font-kanit text-lg sm:text-2xl lg:text-3xl font-bold text-[#4B6B2E] tracking-tight leading-snug space-y-0.5 pt-0.5">
          <div>{data?.subLine1 || "A quest to"}</div>
          <div>{data?.subLine2 || "expose the principles of"}</div>
          <div className="font-larken italic text-[#4B6B2E] text-2xl sm:text-3xl lg:text-4xl font-normal lowercase">
            {data?.subItalic || "mandala"}
          </div>
        </div>
      </div>

      {/* Main Content Showcase Section */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 pl-2 sm:pl-6 lg:pl-50 pr-6 lg:pr-36">
        
        {/* Left Visual Composition: Green Blob + Mandala Artwork + Mountain Overlay */}
        <div className="relative flex-shrink-0 w-[240px] sm:w-[290px] md:w-[330px] lg:w-[360px] aspect-square flex items-center justify-center">
          
          {/* Soft Green Watercolor Blob Background */}
          <div className="absolute inset-0 z-0 bg-[#E3EED4]/60 rounded-full blur-2xl scale-105 transform translate-x-2 -translate-y-2 pointer-events-none" />

          {/* Main Colorful Circular Mandala Artwork */}
          <img
            src={data?.mandalaImage ? resolveAssetUrl(data.mandalaImage) : mandalaImg}
            alt="Living Mandala Art"
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_8px_22px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:scale-[1.02]"
          />

          {/* Overlaid Snowy Mountain Graphic (Bottom Left Edge) */}
          <div className="absolute -bottom-2 -left-6 sm:-left-15 z-20 w-[140px] sm:w-[170px] md:w-[190px] pointer-events-none drop-shadow-md">
            <img
              src={data?.mountainImage ? resolveAssetUrl(data.mountainImage) : mountainImg}
              alt="Mountain Base"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="absolute -bottom-2 -left-6 sm:-left-[90px] z-20 w-[140px] sm:w-[170px] md:w-[190px] pointer-events-none drop-shadow-md">
            <img
              src={data?.mountainImage ? resolveAssetUrl(data.mountainImage) : mountainImg}
              alt="Mountain Base"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Text Description & Quotes */}
        <div className="max-w-xs sm:max-w-sm lg:max-w-md space-y-5 pt-2 lg:pt-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight mb-2.5">
              {data?.rightTitle || "mandalas"}
            </h2>
            <div 
              className="text-xs sm:text-sm text-[#6A6A6A] font-normal leading-relaxed text-left tiptap-content"
              dangerouslySetInnerHTML={{ __html: data?.rightDesc || "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>" }}
            />
          </div>

          <div className="pt-1 ">
            <p className="text-xs sm:text-sm font-semibold text-[#6A6A6A] leading-snug">
              {data?.quote || "This eternal circle of life is playing constantly in and around us."}
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Row: Quote on Left & Hold-and-Drag Navigation Indicator on Right */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-2">
        
        {/* Bottom Left Quote */}
        <div className="max-w-xs sm:max-w-sm pl-2 sm:pl-6 lg:pl-30">
          <p className="text-xs sm:text-sm font-medium text-[#6A6A6A] leading-snug">
            {data?.quote || "This eternal circle of life is playing constantly in and around us."}
          </p>
        </div>

        {/* Center-Right Drag Navigation Prompt */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-zinc-400 tracking-wider pr-16 sm:pr-32 lg:pr-56">
          <span>Hold and drag to navigate</span>
          <div className="flex items-center text-zinc-400">
            <span className="w-10 sm:w-14 h-[1.5px] bg-zinc-400 inline-block" />
            <svg className="w-4 h-4 -ml-1 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MandalaPanel1;