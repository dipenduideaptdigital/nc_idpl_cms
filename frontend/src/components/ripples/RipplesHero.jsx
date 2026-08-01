import React from 'react';
import rippleBg from '../../assets/nc_home/ripple_bg.png';

const RipplesHero = ({ data }) => {
  return (
    <section className="relative w-full h-screen min-h-[500px] overflow-hidden select-none">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={data?.backgroundImage || rippleBg}
          alt="Ripples Aquatic Studio Aquascape"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default RipplesHero;