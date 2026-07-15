import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../../assets/service/banner.png';

const ServiceBanner = () => {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-zinc-900 font-helvetica">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div> 
      </div>

      <div className="relative z-10 text-center px-6 flex flex-col items-center opal-move-up mt-10" data-in-view="true">
        
        
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          Residential Interior
        </h1>
      </div>
    </div>
  );
};

export default ServiceBanner;