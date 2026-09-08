import React from 'react';
import { Link } from 'react-router-dom';
import brush2Img from '../../assets/nc_logo/brush2.png';

const LearnTogetherSection = ({ data }) => {
  const tagline = data?.tagline || "learn together";
  const mainTitle = data?.mainTitle || "LIVING";
  const italicTitle = data?.italicTitle || "art";
  const subHeadline = data?.subHeadline || "It is a long established fact that a reader will be distracted.";
  const paragraph = data?.paragraph || "It is a long established fact that a reader will be distracted.";
  const buttonText = data?.buttonText || "explore the art";

  if (data?.isVisible === false) return null;

  return (
    <section className="relative w-full bg-white py-16 sm:py-20 lg:py-24 px-6 sm:px-12 lg:px-24 overflow-hidden select-none">
      
      {/* Background Graphic */}
      <div className="absolute right-[-40px] bottom-[50px] pointer-events-none z-0 opacity-100 transform -scale-x-100">
        <img src={brush2Img} alt="" className="w-[200px] lg:w-[400px] h-auto object-contain" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start space-y-6">
        
        {/* Tagline */}
        <span className="font-kanit text-lg sm:text-xl lg:text-[20px] font-medium text-[#6CAB44] tracking-wide lowercase">
          {tagline}
        </span>

        {/* Empty Box Placeholder */}
        <div className="w-[240px] sm:w-[280px] h-[100px] sm:h-[120px] border-[1.5px] border-gray-200 shadow-sm rounded-sm bg-white mb-2"></div>

        {/* Titles */}
        <h2 className="font-reem text-5xl sm:text-6xl lg:text-[64px] font-normal tracking-wide text-[#0f2329] leading-none uppercase pt-2">
          {mainTitle} <span className="font-larken font-bold italic text-[#6CAB44] lowercase ml-1">{italicTitle}</span>
        </h2>

        {/* Subheadline */}
        <h3 className="font-kanit text-2xl sm:text-3xl lg:text-[32px] font-medium text-[#363636] leading-[1.2] max-w-md pt-2">
          {subHeadline}
        </h3>

        {/* Paragraph */}
        <p className="font-kanit text-base sm:text-lg lg:text-xl text-zinc-500 font-light leading-relaxed max-w-md">
          {paragraph}
        </p>

        {/* Button */}
        <div className="pt-4 w-full max-w-md flex justify-end">
          <Link to="/explore" className="group inline-flex items-center gap-3.5 text-[#505A5C] hover:text-[#48682E] transition-colors cursor-pointer">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f4f7f0] group-hover:bg-[#4A712E] text-[#6CAB44] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-[0_2px_12px_rgba(72,104,46,0.35)] group-active:scale-95">
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <span className="font-kanit text-[15px] sm:text-[16px] font-medium tracking-normal lowercase text-[#505A5C] group-hover:text-[#48682E] transition-colors">
              {buttonText}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LearnTogetherSection;