import React from 'react';
import patternImg from '../../assets/nc_mandala/pattern.png';
import branchImg from '../../assets/nc_mandala/branch.png';
import { resolveAssetUrl } from '../../utils/assetResolver';
import brush1 from '../../assets/nc_logo/brush1.png';
const MandalaPanel2 = ({ data }) => {
  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-800 flex-shrink-0 relative flex flex-col justify-center items-center pt-20 sm:pt-24 lg:pt-28 pb-6 sm:pb-10 px-8 sm:px-14 lg:px-24 select-none font-kanit overflow-hidden">
      
      {/* Main Layout Container matching Second Design Image */}
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-4 lg:gap-8 pl-12 sm:pl-24 lg:pl-32 pr-4 sm:pr-8">
        
        {/* Left Visual Composition: Top-Left Mandala Pattern + Diagonally Spanning Green Blob + Bottom-Right Plant Branch */}
        <div className="relative flex-shrink-0 w-[260px] sm:w-[320px] lg:w-[380px] h-[280px] sm:h-[340px]">
          
          {/* Diagonally Spanning Soft Green Watercolor Blob Background */}
          <img src={brush1} alt="Brush1" className="w-full h-auto object-contain filter drop-shadow-sm rotate-[12deg]"/>

          {/* Top-Left Line Art Mandala Pattern Image (Dynamic) */}
          <div className="absolute top-0 left-0 z-10 w-[170px] sm:w-[210px] lg:w-[240px] aspect-square">
            <img
              src={data?.patternImage ? resolveAssetUrl(data.patternImage) : patternImg}
              alt="Line Art Mandala Pattern"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
            />
          </div>

          {/* Bottom-Right Black Line-Art Plant Branch Artwork (Dynamic) */}
          <div className="absolute bottom-[-100px] right-2 sm:right-[-20px] z-20 w-[130px] sm:w-[160px] lg:w-[190px]">
            <img
              src={data?.branchImage ? resolveAssetUrl(data.branchImage) : branchImg}
              alt="Plant Branch Art"
              className="w-full h-auto object-contain filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* Right Content Area matching exact screenshot text design */}
        <div className="max-w-xs sm:max-w-sm lg:max-w-md space-y-6 pt-2 md:pt-16 ml-6 sm:ml-10">
          
          {/* Title: 2-Line "elements of balance" (Dynamic lowercase bold dark font) */}
          <h2 className="text-3xl sm:text-3xl lg:text-[40px] font-extrabold text-zinc-900 tracking-tight lowercase font-kanit leading-[0.95] max-w-[260px] sm:max-w-[320px]">
            <div>{data?.titleLine1 || "elements of"}</div>
            <div>{data?.titleLine2 || "balance"}</div>
          </h2>

          <div className="space-y-6 pt-2">
            {/* Paragraph 1 (Dynamic Rich Text from TipTap) */}
            <div 
              className="text-xs sm:text-sm text-[#6A6A6A] font-normal leading-relaxed text-left max-w-xs sm:max-w-sm tiptap-content [&>p]:mb-0"
              dangerouslySetInnerHTML={{ 
                __html: data?.desc1 || "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.</p>" 
              }} 
            />

            {/* Paragraph 2: Indented further to the right as shown in screenshot (Dynamic Rich Text) */}
            <div className="pl-14 sm:pl-20 lg:pl-28">
              <div 
                className="text-xs sm:text-sm text-[#6A6A6A] font-normal leading-relaxed max-w-xs tiptap-content [&>p]:mb-0"
                dangerouslySetInnerHTML={{ 
                  __html: data?.desc2 || "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>" 
                }} 
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MandalaPanel2;