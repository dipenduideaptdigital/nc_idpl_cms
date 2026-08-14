import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MandalaHeader from './MandalaHeader';
import MandalaPanel1 from './MandalaPanel1';
import MandalaPanel2 from './MandalaPanel2';
import MandalaPanel3 from './MandalaPanel3';
import grassImg from '../../assets/nc_mandala/grass.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const MandalaHorizontalScroll = ({ data }) => {
  const containerRef = useRef(null);
  const [activePanel, setActivePanel] = useState(0);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const flatData = data || {};

  // Dynamically calculate total visible panels based on admin toggles
  const totalPanels = [
    flatData.p1_isVisible !== false ? 1 : 0,
    flatData.p2_isVisible !== false ? 1 : 0,
    flatData.p3_isVisible !== false ? 1 : 0,
  ].reduce((a, b) => a + b, 0);
  
  const structuredData = {
    panoramicImage: flatData.panoramic_image,
    panel1: {
      title: flatData.p1_title,
      subLine1: flatData.p1_subLine1,
      subLine2: flatData.p1_subLine2,
      subItalic: flatData.p1_subItalic,
      rightTitle: flatData.p1_rightTitle,
      rightDesc: flatData.p1_rightDesc,
      quote: flatData.p1_quote,
      mandalaImage: flatData.p1_mandalaImage,
      mountainImage: flatData.p1_mountainImage
    },
    panel2: {
      titleLine1: flatData.p2_titleLine1,
      titleLine2: flatData.p2_titleLine2,
      desc1: flatData.p2_desc1,
      desc2: flatData.p2_desc2,
      patternImage: flatData.p2_patternImage,
      branchImage: flatData.p2_branchImage
    },
    panel3: {
      title: flatData.p3_title,
      desc: flatData.p3_desc,
      tagline1: flatData.p3_tagline1,
      tagline2: flatData.p3_tagline2,
      mandalaImage: flatData.p3_mandalaImage,
      fishImage: flatData.p3_fishImage
    }
  };

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

  // Convert vertical mouse wheel scrolling into horizontal scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      // Disable auto horizontal scroll when editing visually in Admin Panel
      if (document.body.classList.contains('puck-mode')) return;
      
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.5;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Mouse Drag to Scroll
  const handleMouseDown = (e) => {
    if (document.body.classList.contains('puck-mode')) return;
    const el = containerRef.current;
    if (!el) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current) return;
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.8;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-white text-zinc-900 font-kanit">
      
      {/* Top Header Navbar */}
      <MandalaHeader />

      {/* Horizontal Scroll Track Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full h-full flex flex-row overflow-x-auto overflow-y-hidden scrollbar-none relative cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'smooth' }}
      >

        {flatData.p1_isVisible !== false && <MandalaPanel1 data={structuredData.panel1} />}
        {flatData.p2_isVisible !== false && <MandalaPanel2 data={structuredData.panel2} />}
        {flatData.p3_isVisible !== false && <MandalaPanel3 data={structuredData.panel3} />}
        {flatData.p1_isVisible !== false && (
          <div className="absolute bottom-0 left-[100vw] -translate-x-[45%] z-20 pointer-events-none w-[220px] sm:w-[320px] md:w-[420px] lg:w-[500px] xl:w-[560px] max-h-[80vh]">
            <img
              src={structuredData.panoramicImage ? resolveAssetUrl(structuredData.panoramicImage) : grassImg}
              alt="Tall Grass Plants Artwork"
              className="w-full h-auto object-contain object-bottom filter drop-shadow-md"
            />
          </div>
        )}
      </div>

      {/* Left Scroll Navigation Arrow */}
      {activePanel > 0 && (
        <button
          onClick={() => scrollToPanel(activePanel - 1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 bg-zinc-900/70 hover:bg-zinc-800 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl cursor-pointer"
          aria-label="Previous Panel"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right Scroll Navigation Arrow */}
      {activePanel < totalPanels - 1 && (
        <button
          onClick={() => scrollToPanel(activePanel + 1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-40 bg-zinc-900/70 hover:bg-zinc-800 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl cursor-pointer"
          aria-label="Next Panel"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Right Panel Indicator Dots */}
      <div className="fixed bottom-6 right-8 sm:right-12 z-[60] flex items-center space-x-2 bg-zinc-900/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 shadow-2xl">
        {Array.from({ length: totalPanels }).map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              scrollToPanel(idx);
            }}
            className={`flex items-center justify-center h-6 rounded-full transition-all duration-300 cursor-pointer ${
              activePanel === idx
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

export default MandalaHorizontalScroll;