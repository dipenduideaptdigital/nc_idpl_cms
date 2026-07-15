import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../../assets/homepage/play.jpg'; 

const ContactBanner = () => {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] flex items-center justify-center overflow-hidden bg-zinc-900 font-helvetica">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-6 flex flex-col items-center opal-move-up mt-10">
        
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          Contact Us
        </h1>
        
        <div className="flex items-center space-x-3 text-sm md:text-base font-medium text-gray-200">
          <Link to="/" className="hover:text-[#3B82F6] transition-colors">Home</Link>
        
          <span className="text-gray-400 font-light text-xs">&gt;</span>
          
          <span className="text-white font-bold">Contact Us</span>
        </div>

      </div>
    </div>
  );
};

export default ContactBanner;