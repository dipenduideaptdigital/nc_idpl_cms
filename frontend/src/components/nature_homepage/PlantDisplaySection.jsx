import React from 'react';
import plantHeroImg from '../../assets/nc_home/plant_hero.jpg';

const PlantDisplaySection = () => {
  return (
    <section className="relative w-full bg-black overflow-hidden select-none">
      {/* Full Width Plant Hero Display */}
      <div className="relative w-full h-[400px] sm:h-[550px] md:h-[680px] lg:h-[800px]">
        <img
          src={plantHeroImg}
          alt="Aquascape Nature Plant Display"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        {/* Subtle gradient overlays for smooth section transitions */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#fcfdfc] to-transparent opacity-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent opacity-40 pointer-events-none" />
      </div>
    </section>
  );
};

export default PlantDisplaySection;
