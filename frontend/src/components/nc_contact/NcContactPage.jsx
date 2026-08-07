import React, { useEffect } from 'react';
import NcContactBanner from './NcContactBanner';
import NcContactInfo from './NcContactInfo';
import NcJoinAndMap from './NcJoinAndMap';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const NcContactPage = () => {
  useScrollAnimation();

  useEffect(() => {
    document.title = 'Contact Us | Naturecube';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white font-kanit">
      <NcContactBanner />
      <NcContactInfo />
      <NcJoinAndMap />
    </div>
  );
};

export default NcContactPage;