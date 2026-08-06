import React, { useEffect, useState } from 'react';
import AboutHorizontalScroll from '../components/nc_about/AboutHorizontalScroll';
import { pagesApi } from '../api/pages';

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await pagesApi.getPublicPageBySlug('about-us');
      
      if (res.data && res.data.content?.blocks) {
        const block = res.data.content.blocks.find(b => b.type === 'aboutHorizontalScroll');
        if (block) {
          setAboutData(block.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch About page data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-[#7BA641] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white font-sans antialiased">
      <AboutHorizontalScroll data={aboutData} />
    </div>
  );
};

export default AboutUs;