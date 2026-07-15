import React from 'react';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutBannerBlock = ({ title, breadcrumbText, backgroundImage }) => {
  const bgImageUrl = resolveAssetUrl(backgroundImage, '/default-banner.png');

  return (
    <div className="relative w-full h-[320px] md:h-[420px] lg:h-[480px] flex items-center justify-center overflow-hidden bg-[#F3F4F6] font-helvetica">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      <div 
        className="relative z-10 text-center px-6 flex flex-col items-center mt-20 md:mt-24 opal-move-up" 
        data-in-view="true"
      >
        <h1 className="text-4xl md:text-5xl lg:text-[60px] font-bold text-amber-50 mb-4 tracking-tight drop-shadow-lg">
          {title || 'About Us'}
        </h1>
        
        <div className="flex items-center space-x-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-amber-50 drop-shadow-md">
          <Link to="/" className="hover:text-[#3B82F6] transition-colors duration-200">
            Home
          </Link>
          <span className="text-gray-400 select-none px-1 text-[10px]">&gt;</span>
          <span className="text-amber-50">{breadcrumbText || 'About Us'}</span>
        </div>
      </div>
    </div>
  );
};

export default AboutBannerBlock;