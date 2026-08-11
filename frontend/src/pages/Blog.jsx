import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogHero from '../components/blog/BlogHero';
import BlogContent from '../components/blog/BlogContent';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';
import apiClient from '../api/client';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Blog = () => {
  const [searchParams] = useSearchParams();
  const [ctaData, setCtaData] = useState(null);
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

    apiClient.get('/cms/section/nc_homepage_cta')
      .then(res => setCtaData(res.data?.data?.content))
      .catch(console.error);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 font-kanit">
      <BlogHero />
      <BlogContent />
      <GetStartedCtaSection data={ctaData} />
    </div>
  );
};

export default Blog;