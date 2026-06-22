import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { pagesApi } from '../api/pages';
import { blogsApi } from '../api/blogs';
import { ShieldAlert, AlertTriangle, Clock, Lock, ServerCrash } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import PageRenderer from '../components/shared/PageRenderer';
import BlogDetailHero from '../components/blog/BlogDetailHero';
import BlogBlockParser from '../components/blog/BlogBlockParser';

const PreviewPage = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const previewType = searchParams.get('type'); 
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useScrollAnimation();

  useEffect(() => {
    const originalTitle = document.title;
    let existingRobots = document.querySelector('meta[name="robots"]');
    let originalRobotsContent = existingRobots ? existingRobots.getAttribute('content') : null;

    if (existingRobots) {
      existingRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      meta.setAttribute('data-preview', 'true');
      document.head.appendChild(meta);
    }

    return () => {
      document.title = originalTitle;
      const addedMeta = document.querySelector('meta[data-preview="true"]');
      if (addedMeta) {
        document.head.removeChild(addedMeta);
      } else if (existingRobots && originalRobotsContent !== null) {
        existingRobots.setAttribute('content', originalRobotsContent);
      }
    };
  }, []);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const isBlog = previewType === 'blog' || previewType?.includes('blog');
        const res = isBlog 
          ? await blogsApi.resolvePublicBlogPreview(token)
          : await pagesApi.getPreviewPageData(token);
          
        const normalizedData = isBlog ? {
          isBlog: true,
          title: res.data.blog.title,
          expiresAt: res.data.preview.expiresAt,
          blogData: res.data.blog 
        } : {
          isBlog: false,
          title: res.data.page.title,
          blocks: res.data.page.content?.blocks,
          expiresAt: res.data.preview?.expiresAt 
        };

        setData(normalizedData);
        document.title = `[PREVIEW] ${normalizedData.title} | Subhaakritee`;
      } catch (err) {
        setError({
          status: err.response?.status || 500,
          message: err.response?.data?.message || 'Server encountered an error while loading preview.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPreview();
  }, [token, previewType]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        <p className="mt-4 text-zinc-600 font-medium">Resolving secure preview...</p>
      </div>
    );
  }

  if (error) {
    let ErrorIcon = ShieldAlert;
    let errorTitle = 'Preview Unavailable';
    let iconBg = 'bg-red-100';
    let iconColor = 'text-red-600';

    if (error.status === 410) {
      ErrorIcon = Clock;
      errorTitle = 'Preview Expired';
      iconBg = 'bg-amber-100';
      iconColor = 'text-amber-600';
    } else if (error.status === 403 || error.status === 401) {
      ErrorIcon = Lock;
      errorTitle = 'Preview Revoked';
      iconBg = 'bg-zinc-200';
      iconColor = 'text-zinc-600';
    } else if (error.status === 404) {
      ErrorIcon = ShieldAlert;
      errorTitle = 'Invalid Preview Link';
      iconBg = 'bg-red-100';
      iconColor = 'text-red-600';
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-zinc-100">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${iconBg}`}>
            <ErrorIcon className={`w-8 h-8 ${iconColor}`} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">{errorTitle}</h1>
          <p className="text-zinc-500 mb-8">{error.message}</p>
          <Link to="/" className="inline-block bg-zinc-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-zinc-800 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-16 bg-white"> 
      
      {/* DYNAMIC ENGINE ROUTER */}
      {data.isBlog ? (
        <div className="blog-preview-wrapper font-sans">
          <BlogDetailHero post={data.blogData} />
          <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-16 opal-move-up mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <article className="bg-transparent">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {data.blogData.categories?.map(cat => (
                      <span key={cat.id || cat.name} className="px-4 py-1.5 bg-[#3B82F6] text-white text-xs font-bold rounded-full uppercase tracking-widest">
                        {cat.name}
                      </span>
                    ))}
                    <span className="text-zinc-500 text-sm font-medium">
                      {data.blogData.publishedAt ? new Date(data.blogData.publishedAt).toLocaleDateString() : 'Draft Mode'}
                    </span>
                  </div>
                  <h1 className="font-['Outfit'] text-[36px] md:text-[50px] font-bold text-zinc-900 leading-[1.1] tracking-tight mb-8">
                    {data.blogData.title}
                  </h1>
                  <div className="blog-content-wrapper">
                    <BlogBlockParser contentPayload={data.blogData.content} />
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Render Landing Page Specific Layout */
        <PageRenderer blocks={data.blocks} />
      )}

      {/* PREVIEW BANNER */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t border-amber-400">
        <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
          <AlertTriangle className="w-5 h-5" />
          PREVIEW MODE ({data.isBlog ? 'BLOG POST' : 'PAGE'})
        </div>
        
        {data.expiresAt && (
          <div className="text-xs font-semibold bg-amber-900/10 border border-amber-900/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Expires: {new Date(data.expiresAt).toLocaleString([], {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;