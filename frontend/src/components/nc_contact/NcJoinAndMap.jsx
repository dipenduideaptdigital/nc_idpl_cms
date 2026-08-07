import React from 'react';
import teamBanner from '../../assets/nc_contact/team_banner.png';
import mapImg from '../../assets/nc_contact/map.png';

const NcJoinAndMap = () => {
  return (
    <div className="w-full font-kanit">
      
      {/* Join Our Team Banner */}
      <section className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${teamBanner})` }}
        >
          {/* Soft dark overlay for text contrast */}
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
              Join Our Team
            </h2>
            <p className="text-white/95 font-normal text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              We work alongside our clients as one team with a shared ambition to achieve extraordinary results, outperform the competition and redefine industries.
            </p>
            <a
              href="#careers"
              className="inline-block bg-[#7BA641] hover:bg-[#6b9535] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-7 py-3 rounded-sm transition-colors shadow-md cursor-pointer"
            >
              JOIN NOW
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[350px] sm:h-[450px] md:h-[520px] relative overflow-hidden bg-zinc-100">
        <img 
          src={mapImg} 
          alt="Location Map" 
          className="w-full h-full object-cover object-center"
        />
      </section>

    </div>
  );
};

export default NcJoinAndMap;