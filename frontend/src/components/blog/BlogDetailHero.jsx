import React from 'react';
import { resolveAssetUrl } from '../../utils/assetResolver';
import defaultHero from '../../assets/blog/hero.jpg';

const BlogDetailHero = ({ post }) => {
  if (!post) return null;

  const bgImage = resolveAssetUrl(post.featuredImage?.url, defaultHero);

  return (
    <section className="relative w-full h-[55vh] min-h-[320px] sm:h-[70vh] sm:min-h-[440px] md:h-[82vh] md:min-h-[520px] lg:h-[90vh] max-h-[780px] -mt-24 overflow-hidden select-none bg-zinc-950 font-kanit">
      
      {/* Background Image - Exactly like Gulmo / Ripples Hero */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bgImage}
          alt={post.title || "Our Blog"}
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        {/* Top Dark Overlay Gradient for Navbar Contrast */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-36 md:h-44 bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none z-10" />
        {/* Bottom Dark Gradient for Seamless Section Blend */}
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 md:h-36 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none z-10" />
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none z-10" />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-20 w-full h-full flex items-center justify-center pt-16 sm:pt-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-larken-medium font-normal text-white tracking-tight drop-shadow-2xl capitalize leading-tight">
          our blog
        </h1>
      </div>
    </section>
  );
};

export default BlogDetailHero;