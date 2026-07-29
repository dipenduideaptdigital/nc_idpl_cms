import React, { useEffect } from 'react';
import RipplesHero from '../components/ripples/RipplesHero';
import RipplesIntroSection from '../components/ripples/RipplesIntroSection';
import RipplesNatureAquariumSection from '../components/ripples/RipplesNatureAquariumSection';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';

const RipplesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#070e06] text-white font-sans antialiased">
      {/* Hero Section */}
      <RipplesHero />

      {/* Intro & Takashi Amano Quote Section */}
      <RipplesIntroSection />

      {/* What is Nature Aquarium & Our Projects Section */}
      <RipplesNatureAquariumSection />

      {/* Get Started CTA Section */}
      <GetStartedCtaSection />
    </div>
  );
};

export default RipplesPage;
