import React from 'react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ServiceBannerBlock = ({ title, subTitle, backgroundImage }) => {
  const bgImageUrl = resolveAssetUrl(backgroundImage, '/default-banner.png');
  return (
    <div className="relative w-full h-[300px] md:h-[380px] lg:h-[420px] flex items-center justify-center overflow-hidden bg-zinc-900">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div> 
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 flex flex-col items-center opal-move-up mt-6 sm:mt-10 max-w-full" data-in-view="true">
        {subTitle && (
          <span className="font-['Helvetica',sans-serif] text-xs sm:text-sm font-normal tracking-normal uppercase text-white mb-2 break-words">{subTitle}</span>
        )}
        <h1 className="font-['Montserrat',sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[62px] text-white mb-2 tracking-normal text-center capitalize drop-shadow-lg break-words">
          {title || 'Service Title'}
        </h1>
      </div>
    </div>
  );
};

export default ServiceBannerBlock;