import React, { useEffect } from 'react';
import PrakritiHero from '../components/prakriti/PrakritiHero';
import PrakritiEducationSection from '../components/prakriti/PrakritiEducationSection';
import PrakritiUpcomingWorkshopsSection from '../components/prakriti/PrakritiUpcomingWorkshopsSection';
import PrakritiLabExperienceSection from '../components/prakriti/PrakritiLabExperienceSection';
import PrakritiGetInTouchSection from '../components/prakriti/PrakritiGetInTouchSection';
import PrakritiLetsBeginSection from '../components/prakriti/PrakritiLetsBeginSection';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';

const PrakritiLabPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FAFAF7] text-zinc-900 font-sans antialiased">
      <PrakritiHero />

      <PrakritiEducationSection />

      <PrakritiUpcomingWorkshopsSection />

      <PrakritiLabExperienceSection />

      <PrakritiGetInTouchSection />

      <PrakritiLetsBeginSection />

      <GetStartedCtaSection />
    </div>
  );
};

export default PrakritiLabPage;