import React from 'react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ProjectsHero = ({ title = 'Our Projects', backgroundImage, heroImg }) => {
  const bgImageUrl = resolveAssetUrl(backgroundImage || heroImg, '/default-hero.jpg');

  return (
    <div 
      className="relative w-full mx-auto flex items-center justify-center bg-zinc-950 overflow-hidden"
      style={{
        maxWidth: '1728px',
        height: '480px',
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

      <div className="relative z-10 text-center text-white px-4 mt-14 fade-in">
        <h1 className="text-5xl md:text-7xl font-bold font-['Outfit'] mb-6 tracking-tight drop-shadow-xl">
          {title}
        </h1>
        <div 
          className="flex items-center justify-center gap-3 text-white opacity-95 text-center"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '25px',
            letterSpacing: '0%'
          }}
        >
          <a href="/" className="hover:opacity-80 transition-opacity">Home</a>
          <span className="opacity-70">&gt;</span>
          <span>Projects</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHero;