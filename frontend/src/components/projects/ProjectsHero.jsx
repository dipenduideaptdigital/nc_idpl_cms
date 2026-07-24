import React from 'react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ProjectsHero = ({ title = 'Our Projects', backgroundImage, heroImg }) => {
  const bgImageUrl = resolveAssetUrl(backgroundImage || heroImg, '/default-hero.jpg');

  return (
    <div 
      className="relative w-full mx-auto flex items-center justify-center bg-zinc-950 overflow-hidden"
      style={{
        maxWidth: '1728px',
        height: '420px',
        top: '-6px',
        opacity: 1,
        transform: 'rotate(0deg)'
      }}
    >
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80 scale-105 transition-transform duration-[10000ms]"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-945 via-zinc-950/40 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 mt-10 fade-in">
        <h1 className="font-['Montserrat',sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[62px] mb-3 tracking-normal text-center capitalize drop-shadow-xl">
          {title}
        </h1>
        <div 
          className="font-['Helvetica',sans-serif] font-normal text-xs sm:text-sm md:text-base tracking-normal text-center flex items-center justify-center gap-2 text-white opacity-95 uppercase"
        >
          <a href="/" className="hover:opacity-80 transition-opacity">Home</a>
          <span className="opacity-70 text-xs sm:text-sm">&gt;</span>
          <span>Projects</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHero;