import React, { useEffect, useState } from 'react';
import { pagesApi } from '../api/pages';
import NcContactBanner from '../components/nc_contact/NcContactBanner';
import NcContactInfo from '../components/nc_contact/NcContactInfo';
import NcJoinAndMap from '../components/nc_contact/NcJoinAndMap';
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
          document.title = `${data.title || 'Contact Us'} | Naturecube`;
        } else {
          document.title = 'Contact Us | Naturecube';
        }
      } catch (error) {
        console.error("Failed to fetch contact page content. Showing static fallback.", error);
        document.title = 'Contact Us | Naturecube';
      } finally {
        setLoading(false);
      }
    };

    fetchContactPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#485b34]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-kanit">
      {pageData && pageData.content?.blocks?.length > 0 ? (
        <PageRenderer blocks={pageData.content.blocks} />
      ) : (
        <>
          <NcContactBanner />
          <NcContactInfo />
          <NcJoinAndMap />
        </>
      )}
    </div>
  );
};

export default ContactUs;