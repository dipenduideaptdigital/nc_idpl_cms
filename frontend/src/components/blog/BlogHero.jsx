import React from 'react';
import hero from '../../assets/blog/hero.jpg'


const BlogHero = () => {
  return (
    <div className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${hero})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Title & Breadcrumbs */}
      <div className="relative z-10 text-center text-white fade-in mt-16">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight shadow-sm">Blog</h1>
        <div className="flex items-center justify-center gap-3 text-base md:text-lg font-medium opacity-90 tracking-wide">
          <span className="hover:text-amber-400 cursor-pointer transition-colors">Home</span>
          <span className="text-amber-400 opacity-70">&gt;</span>
          <span>Blog</span>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
