import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { pagesApi } from '../api/pages';
import { ArrowLeft } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import AboutSection from '../components/home/AboutSection';
import OurServices from '../components/home/OurServices';
import HowWeWork from '../components/home/HowWeWork';
import OurProjects from '../components/home/OurProjects';
import Panoramas from '../components/home/Panoramas';
import Team from '../components/home/Team';
import Testimonials from '../components/home/Testimonials';
import VideoBanner from '../components/home/VideoBanner';
import BlogSection from '../components/home/BlogSection';
import Gallery from '../components/home/Gallery';
import CtaSection from '../components/home/CtaSection';
import ContactFormBlock from '../components/blocks/ContactFormBlock';

const renderBlock = (block, index) => {
  const { type, data } = block;
  switch (type) {
    case 'hero': return <Hero key={index} data={data} />;
    case 'services': return <Services key={index} data={data} />;
    case 'about': return <AboutSection key={index} data={data} />;
    case 'our_services': return <OurServices key={index} data={data} />;
    case 'how_we_work': return <HowWeWork key={index} data={data} />;
    case 'our_projects': return <OurProjects key={index} data={data} />;
    case 'panoramas': return <Panoramas key={index} data={data} />;
    case 'team': return <Team key={index} data={data} />;
    case 'testimonials': return <Testimonials key={index} data={data} />;
    case 'video_banner': return <VideoBanner key={index} data={data} />;
    case 'blog_section': return <BlogSection key={index} data={data} />;
    case 'gallery': return <Gallery key={index} data={data} />;
    case 'cta': return <CtaSection key={index} data={data} />;
    case 'contactForm': return <ContactFormBlock key={index} data={data} />;
    case 'richText':
      return (
        <div key={index} className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div 
              className="prose prose-zinc lg:prose-lg mx-auto prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-800"
              dangerouslySetInnerHTML={{ __html: data?.content || '' }}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useScrollAnimation();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await pagesApi.getPublicPageBySlug(slug);
        setPage(response.data);
        
        // Basic SEO injection
        if (response.data.metaTitle) {
          document.title = `${response.data.metaTitle} | Subhaakritee`;
        } else {
          document.title = `${response.data.title} | Subhaakritee`;
        }

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && response.data.metaDescription) {
          metaDesc.setAttribute('content', response.data.metaDescription);
        }
      } catch (err) {
        console.error('Failed to load page:', err);
        setError(err.response?.status === 404 ? 'not-found' : 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
        <p className="mt-4 text-zinc-500 font-medium tracking-wide">Loading page...</p>
      </div>
    );
  }

  if (error === 'not-found') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-zinc-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-zinc-800 mb-2">Page Not Found</h2>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">The page you are looking for doesn't exist or has been moved.</p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">Something went wrong while loading this page.</p>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="animate-in fade-in duration-700 min-h-screen">
      {page.content?.blocks?.length > 0 ? (
        page.content.blocks.map((block, index) => renderBlock(block, index))
      ) : (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <p className="text-center text-zinc-500 italic">
            This page is currently empty.
          </p>
        </div>
      )}
    </div>
  );
};

export default DynamicPage;