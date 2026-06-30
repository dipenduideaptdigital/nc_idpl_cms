import React from 'react';

const ProjectsHero = ({ title = 'Our Projects', heroImg }) => {
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
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-945 via-zinc-950/40 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 mt-14 fade-in">
        <h1 className="text-5xl md:text-7xl font-bold font-['Outfit'] mb-6 tracking-tight drop-shadow-xl">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-3 text-xs md:text-sm font-semibold tracking-widest uppercase opacity-85">
          <a href="/" className="hover:text-[#3B82F6] transition-colors">Home</a>
          <span className="text-[#3B82F6] opacity-70">&gt;</span>
          <span className="text-zinc-300">Projects</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHero;