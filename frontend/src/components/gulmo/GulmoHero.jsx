import React from 'react';
import gulmoBg from '../../assets/nc_home/Gulmo.png';

const GulmoHero = ({ data }) => {
  const imgSrc = data?.backgroundImage || gulmoBg;

  return (
    <section className="relative w-full h-[60vh] min-h-[320px] sm:h-[75vh] sm:min-h-[450px] md:h-[88vh] md:min-h-[550px] lg:h-screen lg:min-h-[640px] overflow-hidden select-none bg-[#070e06]">
      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <img
          src={imgSrc}
          alt="Gulmo Concept Gardening"
          className="w-full h-full object-cover object-center sm:object-[center_35%] md:object-center filter brightness-95 contrast-105"
        />
        {/* Top Gradient Overlay for Navbar Legibility */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-36 md:h-44 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
        {/* Bottom Gradient Overlay for Seamless Section Blend */}
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 md:h-36 bg-gradient-to-t from-[#070e06] via-[#070e06]/40 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default GulmoHero;