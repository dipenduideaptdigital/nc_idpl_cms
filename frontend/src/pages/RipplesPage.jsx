import React, { useEffect } from 'react';
import RipplesHero from '../components/ripples/RipplesHero';
import RipplesBreadcrumb from '../components/ripples/RipplesBreadcrumb';
import RipplesIntroSection from '../components/ripples/RipplesIntroSection';
import RipplesNatureAquariumSection from '../components/ripples/RipplesNatureAquariumSection';
import RipplesLetsBeginSection from '../components/ripples/RipplesLetsBeginSection';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';

const RipplesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#070e06] text-white font-sans antialiased">
      {/* Hero Section */}
      <RipplesHero />
      <RipplesBreadcrumb />

      {/* Intro & Takashi Amano Quote Section */}
      <RipplesIntroSection />

      {/* What is Nature Aquarium & Our Projects Section */}
      <RipplesNatureAquariumSection />

      {/* Let's Begin Section */}
      <RipplesLetsBeginSection />

      {/* Get Started CTA Section */}
      <GetStartedCtaSection />
    </div>
  );
};

export default RipplesPage;
