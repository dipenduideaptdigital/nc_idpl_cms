import React from 'react';
import gulmoBg from '../../assets/nc_home/Gulmo.png';

const GulmoHero = () => {
  return (
    <section className="relative w-full h-screen min-h-[500px] overflow-hidden select-none">
      {/* Background Hero Image - Contains Full Built-in Logo & Design */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={gulmoBg}
          alt="Gulmo Concept Gardening"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle Top Gradient for Header Legibility */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default GulmoHero;
