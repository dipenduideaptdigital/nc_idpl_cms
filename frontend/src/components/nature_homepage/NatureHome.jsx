import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client'; // Make sure this path is correct

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
  const [heroData, setHeroData] = useState(null);
  const [mandalasData, setMandalasData] = useState(null);
  const [livingArtData, setLivingArtData] = useState(null);
  const [showcaseData, setShowcaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [heroRes, mandalasRes, livingArtRes, showcaseRes] = await Promise.allSettled([
          apiClient.get('/cms/section/nc_homepage_hero'),
          apiClient.get('/cms/section/nc_homepage_mandalas'),
          apiClient.get('/cms/section/nc_homepage_living_art'),
          apiClient.get('/cms/section/nc_homepage_showcase')
        ]);

        if (heroRes.status === 'fulfilled') setHeroData(heroRes.value.data?.data?.content);
        if (mandalasRes.status === 'fulfilled') setMandalasData(mandalasRes.value.data?.data?.content);
        if (livingArtRes.status === 'fulfilled') setLivingArtData(livingArtRes.value.data?.data?.content);
        if (showcaseRes.status === 'fulfilled') setShowcaseData(showcaseRes.value.data?.data?.content);

      } catch (error) {
        console.error("Failed to fetch NatureCube home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#070e06] flex items-center justify-center text-[#7BA641] font-sans">
        Loading NatureCube...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#070e06] text-white font-sans antialiased">
      {/* Header Navigation */}
      <NatureNavbar />

      {/* Dynamic Sections (Data passed as props) */}
      <NatureHero data={heroData} />
      <LivingMandalasSection data={mandalasData} />
      <LivingArtSection data={livingArtData} />
      <NatureShowcaseSection data={showcaseData} />

      {/* Static Sections (Will make dynamic later) */}
      <PlantDisplaySection />
      <ServicesSection />
      <OurPartnersSection />
      <OurBlogsSection />
      <WhatTheySaySection />
      <GetStartedCtaSection />

      {/* Footer */}
      <NatureFooter />
    </div>
  );
};

export default NatureHome;