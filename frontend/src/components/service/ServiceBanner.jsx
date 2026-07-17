import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../../assets/service/banner.png';

const ServiceBanner = ({ title = 'Residential Interior', subTitle }) => {
  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-zinc-900 font-helvetica">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div> 
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 flex flex-col items-center opal-move-up mt-6 sm:mt-10 max-w-full" data-in-view="true">
        
        {subTitle && (
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white/80 mb-2 sm:mb-3">
            {subTitle}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-white mb-2 sm:mb-4 tracking-tight drop-shadow-lg break-words">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default ServiceBanner;