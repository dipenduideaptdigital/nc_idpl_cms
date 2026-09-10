import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MandalaHeader from '../nc_mandala/MandalaHeader';
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
import brushImg from '../../assets/nc_logo/brush1.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutHorizontalScroll = ({ data }) => {
  const containerRef = useRef(null);
  const [activePanel, setActivePanel] = useState(0);
  const [panelCount, setPanelCount] = useState(0);

  const flatData = data || {};



  const structuredData = {
    panoramicImage: flatData.panoramic_image,
    heroPanel: {
      headlineLine1: flatData.hero_headlineLine1,
      headlineLine2: flatData.hero_headlineLine2,
      subtext: flatData.hero_subtext,
      yearsExp: flatData.hero_yearsExp,
      sinceYear: flatData.hero_sinceYear,
      clientCount: flatData.hero_clientCount,
      image: flatData.hero_image
    },
    journeyPanel: {
      heading: flatData.journey_heading,
      paragraph1: flatData.journey_paragraph1,
      paragraph2: flatData.journey_paragraph2,
      bgImage: flatData.journey_image
    },
    awardsPanel: {
      headingLine1: flatData.awards_headingLine1,
      headingLine2: flatData.awards_headingLine2,
      subtext: flatData.awards_subtext,
      awards: flatData.awards_list
    },
    historyPanel: {
      title: flatData.history_title,
      smallText: flatData.history_smallText,
      boldText: flatData.history_boldText,
      image1: flatData.history_image1,
      image2: flatData.history_image2
    },
    seminarsPanel: {
      year2011Title: flatData.seminars_year2011Title,
      seminarHeading: flatData.seminars_seminarHeading,
      seminarText: flatData.seminars_seminarText,
      year2014Title: flatData.seminars_year2014Title,
      cuttakHeading: flatData.seminars_cuttakHeading,
      cuttakText: flatData.seminars_cuttakText,
      image1: flatData.seminars_image1,
      image2: flatData.seminars_image2
    },
    ripplesPanel: {
      year2015Title: flatData.ripples_year2015Title,
      shopHeading: flatData.ripples_shopHeading,
      shopText: flatData.ripples_shopText,
      year2016Title: flatData.ripples_year2016Title,
      journalHeading: flatData.ripples_journalHeading,
      image1: flatData.ripples_image1,
      image2: flatData.ripples_image2
    },
    brandsPanel: {
      year2017Title: flatData.brands_year2017Title,
      terrariumHeading: flatData.brands_terrariumHeading,
      terrariumText: flatData.brands_terrariumText,
      year2020Title: flatData.brands_year2020Title,
      bringsLine1: flatData.brands_bringsLine1,
      bringsLine2: flatData.brands_bringsLine2,
      year2025Title: flatData.brands_year2025Title,
      centreHeading: flatData.brands_centreHeading,
      image1: flatData.brands_image1,
      image2: flatData.brands_image2,
      image3: flatData.brands_image3
    },
    mainImagePanel: {
      image: flatData.main_image
    },
    teamPanel: {
      title: flatData.team_title,
      statement: flatData.team_statement,
      name: flatData.team_name,
      role: flatData.team_role,
      description: flatData.team_description,
      image: flatData.team_image
    },
    teamMembersPanel: {
      leader1Name: flatData.members_leader1Name,
      leader1Bio: flatData.members_leader1Bio,
      image1: flatData.members_leader1Image,
      leader2Name: flatData.members_leader2Name,
      leader2Bio: flatData.members_leader2Bio,
      image2: flatData.members_leader2Image,
      leader3Name: flatData.members_leader3Name,
      leader3Bio: flatData.members_leader3Bio,
      image3: flatData.members_leader3Image,
      groupImage: flatData.members_groupImage
    }
  };

  const getPanels = () => {
    const el = containerRef.current;
    if (!el) return [];
    return Array.from(el.children).filter(child => !child.classList.contains('pointer-events-none'));
  };

  const scrollToPanel = (index) => {
    const panels = getPanels();
    if (!panels[index]) return;
    const targetChild = panels[index];
    containerRef.current.scrollTo({
      left: targetChild.offsetLeft,
      behavior: 'smooth'
    });
    setActivePanel(index);
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const panels = getPanels();
    if (panels.length === 0) return;

    const scrollLeft = el.scrollLeft;
    let closestIndex = 0;
    let minDiff = Infinity;

    panels.forEach((child, idx) => {
      const diff = Math.abs(child.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activePanel) {
      setActivePanel(closestIndex);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const panels = getPanels();
    setPanelCount(panels.length);

    const handleWheel = (e) => {
      if (document.body.classList.contains('puck-mode')) return;
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.5;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [flatData]);

  const totalPanels = panelCount || 10;

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-black text-white font-kanit">

      {/* Persistent Navigation Bar across all panels */}
      <MandalaHeader data={{ logo: flatData.logo }} />

      {/* Horizontal Scroll Track */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full flex flex-row overflow-x-auto overflow-y-hidden scrollbar-none relative"
        style={{ scrollBehavior: 'smooth' }}
      >
        {flatData.hero_isVisible !== false && <AboutHeroPanel data={structuredData.heroPanel} />}
        {flatData.journey_isVisible !== false && <AboutJourneyPanel data={structuredData.journeyPanel} />}
        {flatData.awards_isVisible !== false && <AboutAwardsPanel data={structuredData.awardsPanel} />}
        {flatData.history_isVisible !== false && <AboutHistoryPanel data={structuredData.historyPanel} />}
        {flatData.seminars_isVisible !== false && <AboutSeminarsPanel data={structuredData.seminarsPanel} />}
        {flatData.ripples_isVisible !== false && <AboutRipplesPanel data={structuredData.ripplesPanel} />}

        {flatData.brands_isVisible !== false && (
          <>
            <AboutBrandsPanel data={structuredData.brandsPanel} />
            <AboutMainImagePanel data={structuredData.mainImagePanel} />
          </>
        )}

        {flatData.team_isVisible !== false && (
          <>
            <AboutTeamPanel data={structuredData.teamPanel} />
            <AboutTeamMembersPanel data={structuredData.teamMembersPanel} />
          </>
        )}

        {/* PANORAMIC OVERLAY IMAGE - Shown only if Hero is visible */}
        {flatData.hero_isVisible !== false && (
          <div className="absolute top-[32%] sm:top-[28%] lg:top-[28%] left-[95vw] -translate-x-[56%] z-20 pointer-events-none w-[90vw] sm:w-[70vw] md:w-[58vw] lg:w-[48vw] xl:w-[44vw]">
            <img
              src={structuredData.panoramicImage ? resolveAssetUrl(structuredData.panoramicImage) : tankImg}
              alt="Naturecube Aquarium Tank"
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* BRUSH DECOR OVERLAY - Positioned seamlessly between Awards and History panels */}
        {flatData.awards_isVisible !== false && (
          <div className="absolute -top-16 left-[265vw] -translate-x-1/2 z-20 pointer-events-none w-[420px] sm:w-[520px] lg:w-[420px] opacity-40">
            <img
              src={brushImg}
              alt="Background Decor"
              className="w-full h-auto object-contain"
            />
          </div>
        )}
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