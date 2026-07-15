import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { pagesApi } from '../api/pages';
import { ArrowLeft } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import PageRenderer from '../components/shared/PageRenderer';
import SEOHead from '../components/shared/SEOHead'; 

const DynamicPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname; 
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useScrollAnimation();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await pagesApi.getPublicPageBySlug(currentPath);
        setPage(response.data);
        
      } catch (err) {
        console.error('Failed to load page:', err);
        
        if (err.response?.status === 301 && err.response?.data?.data?.redirect) {
          navigate(err.response.data.data.newUrl, { replace: true });
          return;
        }

        setError(err.response?.status === 404 ? 'not-found' : 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [currentPath, navigate]); 

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
    <>
      <SEOHead data={page} type="page" />
      <PageRenderer blocks={page.content?.blocks} />
    </>
  );
};

export default DynamicPage;