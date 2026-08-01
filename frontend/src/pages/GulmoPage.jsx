import React, { useEffect } from 'react';
import GulmoHero from '../components/gulmo/GulmoHero';
import RipplesIntroSection from '../components/ripples/RipplesIntroSection';
import GulmoTerrariumSection from '../components/gulmo/GulmoTerrariumSection';
import GulmoQuoteSection from '../components/gulmo/GulmoQuoteSection';
import GulmoForestOrganismSection from '../components/gulmo/GulmoForestOrganismSection';
import GulmoOurProjectsSection from '../components/gulmo/GulmoOurProjectsSection';
import GulmoLetsBeginSection from '../components/gulmo/GulmoLetsBeginSection';
import RipplesNatureAquariumSection from '../components/ripples/RipplesNatureAquariumSection';
import RipplesLetsBeginSection from '../components/ripples/RipplesLetsBeginSection';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';

const GulmoPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#070e06] text-white font-sans antialiased">
      {/* Hero Section */}
      <GulmoHero />

      {/* Intro & Takashi Amano Quote Section */}
      <RipplesIntroSection />

      {/* Terrariums, Paludariums & Indoor Gardens Showcase */}
      <GulmoTerrariumSection />

      {/* Gautama Buddha Quote Section with Table Jar Background */}
      <GulmoQuoteSection />

      {/* The Forest Is A Peculiar Organism Diagram Section */}
      <GulmoForestOrganismSection />

      {/* Our Projects Section with lab1, lab2 & bush3 */}
      <GulmoOurProjectsSection />

      {/* Let's Begin Store Section with Gallery Images */}
      <GulmoLetsBeginSection />

      {/* Get Started CTA Section */}
      <GetStartedCtaSection />
    </div>
  );
};

export default GulmoPage;