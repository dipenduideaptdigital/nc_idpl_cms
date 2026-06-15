import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { pagesApi } from '../api/pages';
import { ArrowLeft } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import PageRenderer from '../components/shared/PageRenderer';

const DynamicPage = () => {
  const location = useLocation();
  const currentPath = location.pathname; 
  const params = useParams();
  const fullSlug = params.slug 
    ? (params['*'] ? `${params.slug}/${params['*']}` : params.slug) 
    : params['*'];
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useScrollAnimation();

  useEffect(() => {
    const originalTitle = document.title;
    const metaDescElement = document.querySelector('meta[name="description"]');
    const originalDesc = metaDescElement ? metaDescElement.getAttribute('content') : '';

    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await pagesApi.getPublicPageBySlug(currentPath);
        setPage(response.data);
        
        // Basic SEO injection
        if (response.data.metaTitle) {
          document.title = `${response.data.metaTitle} | Subhaakritee`;
        } else {
          document.title = `${response.data.title} | Subhaakritee`;
        }

        if (metaDescElement && response.data.metaDescription) {
          metaDescElement.setAttribute('content', response.data.metaDescription);
        } else if (!metaDescElement && response.data.metaDescription) {
          const newMeta = document.createElement('meta');
          newMeta.name = 'description';
          newMeta.content = response.data.metaDescription;
          newMeta.setAttribute('data-dynamic-meta', 'true');
          document.head.appendChild(newMeta);
        }
      } catch (err) {
        console.error('Failed to load page:', err);
        setError(err.response?.status === 404 ? 'not-found' : 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();

    return () => {
      document.title = originalTitle;
      
      const createdMeta = document.querySelector('meta[data-dynamic-meta="true"]');
      if (createdMeta) {
        document.head.removeChild(createdMeta);
      } else if (metaDescElement) {
        metaDescElement.setAttribute('content', originalDesc);
      }
    };
  }, [currentPath]); 

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

  return <PageRenderer blocks={page.content?.blocks} />;
};

export default DynamicPage;