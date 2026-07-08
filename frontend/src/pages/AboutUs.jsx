import React, { useEffect, useState } from 'react';
import { pagesApi } from '../api/pages';
import PageRenderer from '../components/shared/PageRenderer';
import useScrollAnimation from '../hooks/useScrollAnimation';

import AboutBanner from '../components/about/AboutBanner';
import AboutExperience from '../components/about/AboutExperience';
import AboutProcess from '../components/about/AboutProcess';
import Timeline from '../components/about/Timeline';
import AboutAwards from '../components/about/AboutAwards';
import AboutGallery from '../components/about/AboutGallery';
import Cta from '../components/about/Cta';

const AboutUs = () => {
  useScrollAnimation();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const response = await pagesApi.getPublicPageBySlug('about-us'); 
        const data = response.data || response;
        if (data) {
          setPageData(data);
          document.title = `${data.title || 'About Us'} | Subhaakritee`;
        }
      } catch (error) {
        console.error("Failed to fetch About Us content.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
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
          <AboutBanner />
          <AboutExperience />
          <AboutProcess />
          <Timeline />
          {/* <AboutAwards /> */}
          <AboutGallery />
          <Cta />
        </>
      )}
    </div>
  );
};

export default AboutUs;