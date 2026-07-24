import React from 'react';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutBannerBlock = ({ title, breadcrumbText, backgroundImage }) => {
  const bgImageUrl = resolveAssetUrl(backgroundImage, '/default-banner.png');

  return (
    <div className="relative w-full h-[300px] md:h-[380px] lg:h-[420px] flex items-center justify-center overflow-hidden bg-[#F3F4F6]">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div 
        className="relative z-10 text-center px-6 flex flex-col items-center mt-10 md:mt-14 opal-move-up" 
        data-in-view="true"
      >
        <h1 className="font-['Montserrat',sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[62px] text-white mb-3 tracking-normal text-center capitalize drop-shadow-md">
          {title || 'About Us'}
        </h1>
        
        <div className="font-['Helvetica',sans-serif] font-normal text-xs sm:text-sm md:text-base tracking-normal text-center flex items-center space-x-2 text-white uppercase drop-shadow-sm">
          <Link to="/" className="hover:text-[#3B82F6] transition-colors duration-200">
            Home
          </Link>
          <span className="text-white/70 select-none px-1 text-xs sm:text-sm">&gt;</span>
          <span className="text-white">{breadcrumbText || 'About Us'}</span>
        </div>
      </div>
    </div>
  );
};

export default AboutBannerBlock;