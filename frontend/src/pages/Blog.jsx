import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogHero from '../components/blog/BlogHero';
import BlogContent from '../components/blog/BlogContent';
import CallToAction from '../components/shared/CallToAction';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Blog = () => {
  const [searchParams] = useSearchParams();
  useScrollAnimation();

  useEffect(() => {
    const page = searchParams.get('page') || 1;
    const category = searchParams.get('categorySlug');
    const search = searchParams.get('search');
    
    let title = 'Blog & Articles | Subhaakritee';
    if (category) title = `Category: ${category} - Blog | Subhaakritee`;
    if (search) title = `Search: "${search}" - Blog | Subhaakritee`;

    document.title = title;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 font-kanit">
      <BlogHero />
      <BlogContent />
      <CallToAction />
    </div>
  );
};

export default Blog;