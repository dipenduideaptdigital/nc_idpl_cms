import React from 'react';
import NatureNavbar from './NatureNavbar';
import NatureHero from './NatureHero';
import LivingMandalasSection from './LivingMandalasSection';

const NatureHome = () => {
  return (
    <div className="w-full min-h-screen bg-[#070e06] text-white font-sans antialiased">
      {/* Header Navigation */}
      <NatureNavbar />

      {/* Hero Section */}
      <NatureHero />

      {/* Living Mandalas Section */}
      <LivingMandalasSection />
    </div>
  );
};

export default NatureHome;
