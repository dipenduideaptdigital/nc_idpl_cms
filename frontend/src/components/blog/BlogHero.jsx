import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/blog/hero.jpg';

const BlogHero = () => {
  return (
    <div className="relative h-[50vh] min-h-[420px] w-full flex items-center justify-center bg-zinc-900 font-kanit -mt-24">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none"></div>
      </div>

      <div className="relative z-10 text-center text-white fade-in mt-20">
        <h1 className="text-6xl md:text-7xl font-bold font-kanit mb-6 tracking-tight drop-shadow-xl">
          Blog
        </h1>
        <div className="flex items-center justify-center gap-3 text-sm md:text-base font-medium tracking-widest uppercase opacity-80">
          <Link to="/" className="hover:text-[#3B82F6] transition-colors">Home</Link>
          <span className="text-[#3B82F6] opacity-70">&gt;</span>
          <span>Blog</span>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;