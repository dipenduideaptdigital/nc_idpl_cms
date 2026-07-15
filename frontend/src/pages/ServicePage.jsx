import React, { useEffect, useState } from 'react';
import { pagesApi } from '../api/pages';
import ServiceBanner from '../components/service/ServiceBanner';
import ServiceDetails from '../components/service/ServiceDetails';
import CtaSection from '../components/home/CtaSection'; 
import useScrollAnimation from '../hooks/useScrollAnimation';
import PageRenderer from '../components/shared/PageRenderer'; 

const ServicePage = () => {
  useScrollAnimation();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicePage = async () => {
      try {
        const response = await pagesApi.getPublicPageBySlug('services'); 
        const data = response.data || response;
        
        if (data) {
          setPageData(data);
          document.title = `${data.title || 'Services'} | Subhaakritee`;
        }
      } catch (error) {
        console.error("Failed to fetch service page content. Showing static fallback.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicePage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-helvetica">
      {pageData && pageData.content?.blocks?.length > 0 ? (
        
        <PageRenderer blocks={pageData.content.blocks} />
        
      ) : (
        <>
          <ServiceBanner title="Commercial Interior" subTitle="Services" />
          <ServiceDetails />
          <CtaSection />
        </>
      )}
    </div>
  );
};

export default ServicePage;