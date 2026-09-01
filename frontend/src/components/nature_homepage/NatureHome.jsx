import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client'; 

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
import WhatsAppButton from '../shared/WhatsAppButton';
// import ScrollToTop from '../shared/ScrollToTop';
import GetInTouch from '../shared/GetInTouch';

const NatureHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [mandalasData, setMandalasData] = useState(null);
  const [livingArtData, setLivingArtData] = useState(null);
  const [showcaseData, setShowcaseData] = useState(null);
  const [plantData, setPlantData] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [partnersData, setPartnersData] = useState(null);
  const [blogsData, setBlogsData] = useState(null);
  const [whatTheySayData, setWhatTheySayData] = useState(null);
  const [ctaData, setCtaData] = useState(null);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    
    window.addEventListener('open-consultation-modal', handleOpenModal);
    window.addEventListener('close-consultation-modal', handleCloseModal);
    const hasSeenModal = sessionStorage.getItem('nc_has_seen_modal');
    
    let timer;
    if (!hasSeenModal) {
      timer = setTimeout(() => {
        setIsModalOpen(true);
        sessionStorage.setItem('nc_has_seen_modal', 'true');
      }, 4000);
    }

    return () => {
      window.removeEventListener('open-consultation-modal', handleOpenModal);
      window.removeEventListener('close-consultation-modal', handleCloseModal);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const requiredKeys = [
          'nc_homepage_hero', 'nc_homepage_mandalas', 'nc_homepage_living_art', 
          'nc_homepage_showcase', 'nc_homepage_plant_display', 'nc_homepage_services', 
          'nc_homepage_partners', 'nc_homepage_blogs', 'nc_homepage_what_they_say', 'nc_homepage_cta'
        ].join(',');

        // Single API call to fetch everything
        const response = await apiClient.get(`/cms/sections?keys=${requiredKeys}`);
        const allData = response.data?.data || {};

        // distribute the data to states
        setHeroData(allData['nc_homepage_hero']?.content);
        setMandalasData(allData['nc_homepage_mandalas']?.content);
        setLivingArtData(allData['nc_homepage_living_art']?.content);
        setShowcaseData(allData['nc_homepage_showcase']?.content);
        setPlantData(allData['nc_homepage_plant_display']?.content);
        setServicesData(allData['nc_homepage_services']?.content);
        setPartnersData(allData['nc_homepage_partners']?.content);
        setBlogsData(allData['nc_homepage_blogs']?.content);
        setWhatTheySayData(allData['nc_homepage_what_they_say']?.content);
        setCtaData(allData['nc_homepage_cta']?.content);

      } catch (error) {
        console.error("Failed to fetch NatureCube home data:", error);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-[#070e06] text-zinc-900 dark:text-white font-sans antialiased transition-colors duration-300">
      <NatureNavbar />

      {/* Dynamic Sections */}
      <NatureHero data={heroData} />
      <LivingMandalasSection data={mandalasData} />
      <LivingArtSection data={livingArtData} />
      <NatureShowcaseSection data={showcaseData} />
      <PlantDisplaySection data={plantData} />
      <ServicesSection data={servicesData} />
      <OurPartnersSection data={partnersData} />
      <OurBlogsSection data={blogsData} />
      <WhatTheySaySection data={whatTheySayData} />
      <GetStartedCtaSection data={ctaData} />
      <NatureFooter />
      
      <WhatsAppButton />
      {/* <ScrollToTop /> */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white text-zinc-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto z-10 transition-transform duration-300 transform scale-100 flex flex-col">
            <GetInTouch isModal={true} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NatureHome;