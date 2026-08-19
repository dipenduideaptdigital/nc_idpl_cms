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
import ScrollToTop from '../shared/ScrollToTop';
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
  
  const [loading, setLoading] = useState(true);

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
        const [
          heroRes, mandalasRes, livingArtRes, showcaseRes, 
          plantRes, servicesRes, partnersRes, 
          blogsRes, whatTheySayRes, ctaRes
        ] = await Promise.allSettled([
          apiClient.get('/cms/section/nc_homepage_hero'),
          apiClient.get('/cms/section/nc_homepage_mandalas'),
          apiClient.get('/cms/section/nc_homepage_living_art'),
          apiClient.get('/cms/section/nc_homepage_showcase'),
          apiClient.get('/cms/section/nc_homepage_plant_display'),
          apiClient.get('/cms/section/nc_homepage_services'),
          apiClient.get('/cms/section/nc_homepage_partners'),
          apiClient.get('/cms/section/nc_homepage_blogs'),
          apiClient.get('/cms/section/nc_homepage_what_they_say'),
          apiClient.get('/cms/section/nc_homepage_cta')
        ]);

        if (heroRes.status === 'fulfilled') setHeroData(heroRes.value.data?.data?.content);
        if (mandalasRes.status === 'fulfilled') setMandalasData(mandalasRes.value.data?.data?.content);
        if (livingArtRes.status === 'fulfilled') setLivingArtData(livingArtRes.value.data?.data?.content);
        if (showcaseRes.status === 'fulfilled') setShowcaseData(showcaseRes.value.data?.data?.content);
        if (plantRes.status === 'fulfilled') setPlantData(plantRes.value.data?.data?.content);
        if (servicesRes.status === 'fulfilled') setServicesData(servicesRes.value.data?.data?.content);
        if (partnersRes.status === 'fulfilled') setPartnersData(partnersRes.value.data?.data?.content);
        if (blogsRes.status === 'fulfilled') setBlogsData(blogsRes.value.data?.data?.content);
        if (whatTheySayRes.status === 'fulfilled') setWhatTheySayData(whatTheySayRes.value.data?.data?.content);
        if (ctaRes.status === 'fulfilled') setCtaData(ctaRes.value.data?.data?.content);

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
      <div className="w-full min-h-screen bg-zinc-50 dark:bg-[#070e06] flex items-center justify-center text-zinc-700 dark:text-[#7BA641] font-sans transition-colors duration-300">
        Loading NatureCube...
      </div>
    );
  }

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
      <ScrollToTop />

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