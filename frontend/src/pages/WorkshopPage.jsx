import React, { useEffect } from 'react';
import WorkshopHero from '../components/workshop/WorkshopHero';
import WorkshopDetailsSection from '../components/workshop/WorkshopDetailsSection';
import WorkshopGallerySection from '../components/workshop/WorkshopGallerySection';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';

const WorkshopPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#070e06] text-white font-sans antialiased">
      {/* Hero Section */}
      <WorkshopHero />

      {/* Workshop Details & Highlights Section */}
      <WorkshopDetailsSection />

      {/* Workshop Photo Gallery Section */}
      <WorkshopGallerySection />

      {/* Get Started CTA Section */}
      <GetStartedCtaSection />
    </div>
  );
};

export default WorkshopPage;