import React, { useEffect, useState } from 'react';
import { pagesApi } from '../api/pages';
import ContactBanner from '../components/contact/ContactBanner';
import ContactInfo from '../components/contact/ContactInfo';
import PageRenderer from '../components/shared/PageRenderer';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ContactUs = () => {
  useScrollAnimation();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactPage = async () => {
      try {
        const response = await pagesApi.getPublicPageBySlug('contact');
        const data = response.data || response;
        
        if (data) {
          setPageData(data);
          document.title = `${data.title || 'Contact Us'} | Subhaakritee`;
        }
      } catch (error) {
        console.error("Failed to fetch contact page content. Showing static fallback.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactPage();
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
          <ContactBanner />
          <ContactInfo />
        </>
      )}
    </div>
  );
};

export default ContactUs;