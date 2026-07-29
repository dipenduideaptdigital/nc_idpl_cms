import React from 'react';
import NatureNavbar from './NatureNavbar';
import NatureHero from './NatureHero';
import LivingMandalasSection from './LivingMandalasSection';
import LivingArtSection from './LivingArtSection';
import NatureShowcaseSection from './NatureShowcaseSection';
import PlantDisplaySection from './PlantDisplaySection';
import ServicesSection from './ServicesSection';
import OurPartnersSection from './OurPartnersSection';
import OurBlogsSection from './OurBlogsSection';
import WhatTheySaySection from './WhatTheySaySection';
import GetStartedCtaSection from './GetStartedCtaSection';
import NatureFooter from './NatureFooter';

const NatureHome = () => {
  return (
    <div className="w-full min-h-screen bg-[#070e06] text-white font-sans antialiased">
      {/* Header Navigation */}
      <NatureNavbar />

      {/* Hero Section */}
      <NatureHero />

      {/* Living Mandalas Section */}
      <LivingMandalasSection />

      {/* Living Art Section */}
      <LivingArtSection />

      {/* Nature Showcase Section */}
      <NatureShowcaseSection />

      {/* Plant Display Section */}
      <PlantDisplaySection />

      {/* Services Section */}
      <ServicesSection />

      {/* Our Partners Section */}
      <OurPartnersSection />

      {/* Our Blogs Section */}
      <OurBlogsSection />

      {/* What They Say Section */}
      <WhatTheySaySection />

      {/* Get Started CTA Section */}
      <GetStartedCtaSection />

      {/* Footer */}
      <NatureFooter />
    </div>
  );
};

export default NatureHome;
