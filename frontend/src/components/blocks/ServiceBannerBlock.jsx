import React from 'react';

const ServiceBannerBlock = ({ title, subTitle, backgroundImage }) => {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-zinc-900 font-helvetica">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: `url(${backgroundImage || '/default-banner.png'})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div> 
      </div>

      <div className="relative z-10 text-center px-6 flex flex-col items-center opal-move-up mt-10" data-in-view="true">
        {subTitle && (
          <span className="text-white text-lg mb-2">{subTitle}</span>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          {title || 'Service Title'}
        </h1>
      </div>
    </div>
  );
};

export default ServiceBannerBlock;