import React from 'react';
import HeroSectionTwo from '../components/landing-design-2/HeroSectionTwo';
import AboutSectionTwo from '../components/landing-design-2/AboutSectionTwo';
import ServicesSectionTwo from '../components/landing-design-2/ServicesSectionTwo';
import ProcessSectionTwo from '../components/landing-design-2/ProcessSectionTwo';
import ProjectSliderTwo from '../components/landing-design-2/ProjectSliderTwo';
import HappySpaces from '../components/landing-design-2/HappySpaces';
import TestimonialsTwo from '../components/landing-design-2/TestimonialsTwo';
import TrustedPartners from '../components/landing-design-2/TrustedPartners';
import HappyCustomers from '../components/landing-design-2/HappyCustomers';
import StatsSectionTwo from '../components/landing-design-2/StatsSectionTwo';
import CtaSectionTwo from '../components/landing-design-2/CtaSectionTwo';

const LandingReference2 = () => {
  const handleScrollDown = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    window.dispatchEvent(new Event('open-consultation-modal'));
  };

  return (
    <div className="font-helvetica w-full overflow-x-hidden bg-white">
      <HeroSectionTwo onScrollDown={handleScrollDown} />
      <AboutSectionTwo onCtaClick={handleCtaClick} />
      <ServicesSectionTwo />
      <ProcessSectionTwo />
      <ProjectSliderTwo />
        <TrustedPartners />
      <StatsSectionTwo onCtaClick={handleCtaClick} />
      <HappySpaces />
      <HappyCustomers />
      <TestimonialsTwo />
      
      
      <CtaSectionTwo onCtaClick={handleCtaClick} />
    </div>
  );
};

export default LandingReference2;