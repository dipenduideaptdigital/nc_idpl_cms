import React from 'react';
import heroBg from '../../assets/nc_home/aqua2.png';

const NcContactBanner = () => {
  return (
    <div className="-mt-24 w-full h-[320px] sm:h-[380px] md:h-[420px] flex items-center justify-center font-kanit relative overflow-hidden bg-black text-white">
      {/* Background Image aqua2.png from nc_home */}
      <img
        src={heroBg}
        alt="NatureCube Banner"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-105 scale-105"
      />
      
      {/* Dark gradient vignettes overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Banner Content */}
      <div className="relative z-10 text-center px-6 pt-12 sm:pt-16">
        <h1 
          className="font-larken font-normal text-4xl sm:text-5xl md:text-6xl text-white tracking-wide drop-shadow-md"
          style={{ fontFamily: "'Larken-Medium', 'Larken-MediumItalic', 'Cormorant Garamond', serif" }}
        >
          Contact Us
        </h1>
      </div>
    </div>
  );
};

export default NcContactBanner;