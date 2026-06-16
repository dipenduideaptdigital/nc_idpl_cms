import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import WhySubhaakritee from '../components/landing/WhySubhaakritee';
import MetricsBarOne from '../components/landing/MetricsBarOne';
import ModernWorkspace from '../components/landing/ModernWorkspace';
import MetricsBarTwo from '../components/landing/MetricsBarTwo';
import SpacesStories from '../components/landing/SpacesStories';
import WayWeCreate from '../components/landing/WayWeCreate';
import GallerySection from '../components/landing/GallerySection';
import TrustedClients from '../components/landing/TrustedClients';
import GetInTouch from '../components/landing/GetInTouch';

const LandingReference = () => {
  return (
    <div className="font-sans w-full overflow-x-hidden">
      <HeroSection />
      <WhySubhaakritee />
      <MetricsBarOne />
      <ModernWorkspace />
      <MetricsBarTwo />
      <SpacesStories />
      <WayWeCreate />
      <GallerySection />
      <TrustedClients />
      <GetInTouch />
    </div>
  );
};

export default LandingReference;