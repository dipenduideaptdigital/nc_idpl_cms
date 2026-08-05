import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AboutHeroPanel from './AboutHeroPanel';
import AboutJourneyPanel from './AboutJourneyPanel';
import AboutAwardsPanel from './AboutAwardsPanel';
import AboutHistoryPanel from './AboutHistoryPanel';
import AboutSeminarsPanel from './AboutSeminarsPanel';
import AboutRipplesPanel from './AboutRipplesPanel';
import AboutBrandsPanel from './AboutBrandsPanel';
import AboutMainImagePanel from './AboutMainImagePanel';
import AboutTeamPanel from './AboutTeamPanel';
import AboutTeamMembersPanel from './AboutTeamMembersPanel';
import tankImg from '../../assets/nc_about/tank.png';

const AboutHorizontalScroll = ({ data }) => {
  const containerRef = useRef(null);
  const [activePanel, setActivePanel] = useState(0);

  const totalPanels = 10;

  const scrollToPanel = (index) => {
    const el = containerRef.current;
    if (!el || !el.children[index]) return;

    const targetChild = el.children[index];
    el.scrollTo({
      left: targetChild.offsetLeft,
      behavior: 'smooth'
    });
    setActivePanel(index);
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index >= 0 && index < totalPanels && index !== activePanel) {
      setActivePanel(index);
    }
  };

  // Wheel listener: Converts vertical mouse wheel scrolling into horizontal scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.5;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-black text-white font-kanit">

      {/* Horizontal Scroll Track */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full flex flex-row overflow-x-auto overflow-y-hidden scrollbar-none relative"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Panel 1: Hero Section */}
        <AboutHeroPanel data={data?.heroPanel} />

        {/* Panel 2: Journey Section */}
        <AboutJourneyPanel data={data?.journeyPanel} />

        {/* Panel 3: Awards Won Section */}
        <AboutAwardsPanel data={data?.awardsPanel} />

        {/* Panel 4: History Grid Section */}
        <AboutHistoryPanel data={data?.historyPanel} />

        {/* Panel 5: 2011 & 2014 Seminars Section */}
        <AboutSeminarsPanel data={data?.seminarsPanel} />

        {/* Panel 6: 2015 & 2016 Ripples & Aqua Journal Section */}
        <AboutRipplesPanel data={data?.ripplesPanel} />

        {/* Panel 7: 2017 Terrarium, 2020 2Hr/Oase, & 2025 Experience Centre Section */}
        <AboutBrandsPanel data={data?.brandsPanel} />

        {/* Panel 8: Showcase Main Image Section */}
        <AboutMainImagePanel />

        {/* Panel 9: Our Team Gautam Gupta Mentor Section */}
        <AboutTeamPanel data={data?.teamPanel} />

        {/* Panel 10: Core Team Members (Col. Basudev Mitra, Partha Chakraborty, Sanjoy Dutta & Group) Section */}
        <AboutTeamMembersPanel data={data?.teamMembersPanel} />

        {/* PANORAMIC OVERLAY IMAGE: Aquarium Tank spanning across Panel 1 and Panel 2 */}
        <div className="absolute top-[32%] sm:top-[28%] lg:top-[28%] left-[95vw] -translate-x-[56%] z-20 pointer-events-none w-[90vw] sm:w-[70vw] md:w-[58vw] lg:w-[48vw] xl:w-[44vw]">
          <img
            src={tankImg}
            alt="Naturecube Aquarium Tank"
            className="w-full h-auto object-contain"
          />
        </div>

      </div>

      {/* Left Scroll Navigation Arrow */}
      {activePanel > 0 && (
        <button
          onClick={() => scrollToPanel(activePanel - 1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 bg-zinc-900/70 hover:bg-zinc-600 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl cursor-pointer"
          aria-label="Previous Panel"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right Scroll Navigation Arrow */}
      {activePanel < totalPanels - 1 && (
        <button
          onClick={() => scrollToPanel(activePanel + 1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-40 bg-zinc-900/70 hover:bg-zinc-600 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl cursor-pointer"
          aria-label="Next Panel"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Right Panel Indicator Dots */}
      <div className="fixed bottom-6 right-24 sm:right-28 z-[60] flex items-center space-x-2 bg-zinc-900/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 shadow-2xl">
        {Array.from({ length: totalPanels }).map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              scrollToPanel(idx);
            }}
            className={`flex items-center justify-center h-6 rounded-full transition-all duration-300 cursor-pointer ${activePanel === idx
                ? 'bg-[#7BA641] text-white w-8 font-bold text-[11px] shadow-sm'
                : 'bg-white/30 hover:bg-white/80 text-white/80 w-6 text-[11px] font-semibold'
              }`}
            aria-label={`Go to panel ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

    </div>
  );
};

export default AboutHorizontalScroll;