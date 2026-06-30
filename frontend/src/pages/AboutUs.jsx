import React, { useEffect } from 'react';
import AboutBanner from '../components/about/AboutBanner';
import AboutExperience from '../components/about/AboutExperience';
import useScrollAnimation from '../hooks/useScrollAnimation';
import AboutProcess from '../components/about/AboutProcess';
import Timeline from '../components/about/Timeline';
import AboutAwards from '../components/about/AboutAwards';
import AboutGallery from '../components/about/AboutGallery';
import Cta from '../components/about/Cta';

const AboutUs = () => {
  useScrollAnimation();

  useEffect(() => {
    document.title = 'About Us | Subhaakritee';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white font-helvetica">
      <AboutBanner />
      <AboutExperience />
      <AboutProcess />
      <Timeline/>
      <AboutAwards />
      <AboutGallery />
      <Cta/>
    </div>
  );
};

export default AboutUs;