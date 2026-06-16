import React from 'react';
import { Link } from 'react-router-dom';
import defaultHero from '../../assets/blog/hero.jpg';

const BlogDetailHero = ({ post }) => {
  if (!post) return null;

  return (
    <div className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${post.featuredImage || defaultHero})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="relative z-10 text-center text-white fade-in mt-16 px-4">
        <div className="flex items-center justify-center gap-3 text-base md:text-lg font-medium opacity-90 tracking-wide">
          <Link to="/" className="hover:text-amber-400 cursor-pointer transition-colors">Home</Link>
          <span className="text-amber-400 opacity-70">&gt;</span>
          <span>{post.title}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailHero;
