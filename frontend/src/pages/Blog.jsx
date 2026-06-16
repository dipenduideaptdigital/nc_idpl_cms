import React, { useEffect } from 'react';
import BlogContent from '../components/blog/BlogContent';
import useScrollAnimation from '../hooks/useScrollAnimation';
import CallToAction from '../components/shared/CallToAction';
import BlogHero from '../components/blog/BlogHero';

const Blog = () => {
  useScrollAnimation();

  useEffect(() => {
    document.title = 'Blog | Subhaakritee';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <BlogHero />

      <BlogContent />
      <CallToAction />
    </div>
  );
};

export default Blog;
