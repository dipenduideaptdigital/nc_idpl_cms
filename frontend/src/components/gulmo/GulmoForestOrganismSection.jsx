import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import designJar from '../../assets/nc_home/design_jar.png';
import brush2 from '../../assets/nc_logo/brush2.png';
import lightStand from '../../assets/gulmo/light-stand-z.png';
import jungleSoil from '../../assets/gulmo/jungle-soil.png';
import forestPlant from '../../assets/gulmo/forest-plant.png';
import maintenanceTool from '../../assets/gulmo/layout-maintenance-tool.png';

const GulmoForestOrganismSection = ({ data }) => {
  const features = [
    {
      id: 'glass',
      label: data?.f1Label || 'GLASS',
      subLabel: '',
      title: data?.f1Title || 'GLASS: TOP CASE',
      description: data?.f1Desc || 'A tall glass cover with ventilation holes that maintains high humidity and temperature.',
      side: 'left',
      dotPos: { top: '34%', left: '9%' },
    },
    {
      id: 'lighting',
      label: data?.f2Label || 'LIGHTING SYSTEM',
      subLabel: data?.f2Sub || 'LIGHT STAND Z',
      title: data?.f2Title || 'LIGHTING SYSTEM',
      description: data?.f2Desc || 'High-spectrum LED lighting engineered specifically to support photosynthesis and vibrant plant growth.',
      side: 'right',
      dotPos: { top: '14%', left: '50%' },
    },
    {
      id: 'plants',
      label: data?.f3Label || 'PLANTS',
      subLabel: '',
      title: data?.f3Title || 'PLANTS & FLORA',
      description: data?.f3Desc || 'Lush evergreen mosses, miniature ferns, and humidity-retaining species crafted for long-term health.',
      side: 'left',
      dotPos: { top: '67%', left: '15%' },
    },
    // Retired Terra Base entry, including its bottom-most hotspot.
    /*
    {
      id: 'terra',
      label: data?.f4Label || 'TERRA BASE',
      subLabel: data?.f4Sub || 'TERRA PLATE',
      title: data?.f4Title || 'TERRA BASE & TERRA PLATE',
      description: data?.f4Desc || 'Cylindrical porous ceramic base supplying continuous hydration through natural water evaporation.',
      side: 'right',
      dotPos: { top: '88%', left: '82%' },
      cardPos: { top: '55%', left: '58%' },
    },
    // Retired standalone Substrate entry. Soil now has one combined label/card.
    {
      id: 'substrate',
      label: data?.f5Label || 'SUBSTRATE',
      subLabel: '',
      title: data?.f5Title || 'SUBSTRATE & SOIL',
      description: data?.f5Desc || 'Multi-layered nutrient substratum optimized for root breathability and balanced moisture retention.',
      side: 'right',
      dotPos: { top: '72%', left: '84%' },
      cardPos: { top: '68%', left: '72%' },
    },
    */
    {
      id: 'soil',
      label: data?.soilLabel || 'JUNGLE SOIL &',
      subLabel: data?.soilSubLabel || 'JUNGLE BASE SOIL',
      title: data?.soilTitle || 'JUNGLE SOIL & JUNGLE BASE SOIL',
      description: data?.soilDescription || 'Layered soil supports healthy roots, holds moisture, and provides a stable foundation for the plants in your terrarium.',
      side: 'right',
      dotPos: { top: '72%', left: '84%' },
    },
    {
      id: 'tool',
      label: data?.f6Label || 'LAYOUT &',
      subLabel: data?.f6Sub || 'MAINTENANCE TOOL',
      title: data?.f6Title || 'LAYOUT & MAINTENANCE TOOL',
      description: data?.f6Desc || 'Precision aquascaping tools for delicate planting, trimming, and pin-point maintenance.',
      side: 'left',
      dotPos: { top: '-5%', left: '12%' },
    },
  ];

  const [activeId, setActiveId] = useState('glass');
  const [cardPosition, setCardPosition] = useState(null);
  const [bottomSpace, setBottomSpace] = useState(0);
  const containerRef = useRef(null);
  const diagramRef = useRef(null);
  const cardRef = useRef(null);

  const activeFeature = features.find((f) => f.id === activeId);
  const cardSide = activeFeature?.side;

  useLayoutEffect(() => {
    const diagram = diagramRef.current;
    const card = cardRef.current;
    if (!activeId || !diagram || !card) {
      setCardPosition(null);
      return;
    }

    // Both columns anchor their cards to their own headings, never the image.
    const placeCard = () => {
      if (!card.offsetWidth) {
        setCardPosition(null);
        setBottomSpace(0);
        return;
      }
      const bounds = diagram.getBoundingClientRect();
      const label = diagram.querySelector(`[data-diagram-label="${activeId}"]`);
      if (!label?.getClientRects().length) {
        setCardPosition(null);
        return;
      }
      const labelBounds = label.getBoundingClientRect();
      const sectionBounds = containerRef.current.getBoundingClientRect();
      const labels = Array.from(diagram.querySelectorAll('[data-diagram-label]'));
      const nextLabel = labels
        .filter((element) => element.parentElement === label.parentElement)
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.top > labelBounds.bottom)
        .sort((a, b) => a.top - b.top)[0];
      const availableHeight = nextLabel ? nextLabel.top - labelBounds.bottom - 20 : 240;
      card.style.maxHeight = `${Math.min(240, availableHeight)}px`;
      const width = card.offsetWidth;
      const height = card.offsetHeight;
      const minLeft = sectionBounds.left + 8 - bounds.left;
      const maxLeft = sectionBounds.right - 8 - bounds.left - width;
      let left = Math.max(minLeft, Math.min(maxLeft,
        (cardSide === 'left' ? labelBounds.left : labelBounds.right - width) - bounds.left));
      const top = labelBounds.bottom - bounds.top + 12;
      const dots = Array.from(diagram.querySelectorAll('[data-diagram-dot]'))
        .map((dot) => dot.getBoundingClientRect());

      // At tablet widths, move outward within the same column to clear a dot.
      for (const dot of dots) {
        if (top < dot.bottom - bounds.top + 16 && top + height > dot.top - bounds.top - 16) {
          if (cardSide === 'left') left = Math.min(left, dot.left - bounds.left - width - 16);
          else left = Math.max(left, dot.right - bounds.left + 16);
        }
      }
      left = Math.max(minLeft, Math.min(maxLeft, left));
      const next = { left, top };
      setCardPosition((previous) => previous?.left === left && previous?.top === top ? previous : next);

      // Reserve room for the lowest card even when it is closed, avoiding jumps.
      const lowestLabel = Math.max(...labels.map((element) => element.getBoundingClientRect().bottom));
      setBottomSpace(Math.max(0, lowestLabel - bounds.bottom + 240));
    };

    placeCard();
    const observer = new ResizeObserver(placeCard);
    observer.observe(diagram);
    observer.observe(card);
    diagram.querySelectorAll('[data-diagram-label], img').forEach((element) => observer.observe(element));
    window.addEventListener('resize', placeCard);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', placeCard);
    };
  }, [activeId, cardSide, data]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      onClick={() => setActiveId(null)}
      className="w-full bg-[#fdfdfc] text-[#374151] pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6 px-4 sm:px-8 overflow-hidden select-none font-kanit cursor-default"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Heading */}
        <h2
          style={{ fontFamily: "'Caveat', 'Architects Daughter', 'Patrick Hand', cursive" }}
          className="font-caveat text-4xl sm:text-5xl md:text-6xl lg:text-5xl text-[#7BA641] font-normal tracking-wide text-center mb-14 md:mb-24"
        >
          {data?.mainTitle || 'The Forest Is A Peculiar Organism'}
        </h2>

        {/* Main Diagram Area */}
        <div
          ref={diagramRef}
          style={{ '--diagram-bottom-space': `${bottomSpace}px` }}
          onClick={() => setActiveId(null)}
          className="relative w-full max-w-4xl mx-auto min-h-[550px] sm:min-h-[620px] md:min-h-[700px] md:mb-[var(--diagram-bottom-space)] flex items-center justify-center"
        >
          
          {/* Background Brush Splash */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img
              src={data?.brushImage || brush2}
              alt="Organic Green Brush Splash"
              className="w-[340px] sm:w-[480px] md:w-[580px] lg:w-[500px] h-auto object-contain opacity-85 transform translate-y-6 md:translate-y-10"
            />
          </div>

          {/* Central Glass Jar Assembly and component layers */}
          <div className="relative z-10 mt-5 w-[180px] sm:w-[240px] md:w-[290px] lg:w-[240px] pointer-events-none">
            <img
              src={data?.jarImage || designJar}
              alt="Exploded Terrarium Design Jar"
              className="relative z-10 block w-full h-auto object-contain drop-shadow-xl"
            />

            {/* The supplied product components are intentionally layered over the glass assembly. */}
            <img
              src={lightStand}
              alt="Light stand Z"
              className="absolute z-20 left-1/2 top-[-19%] w-[118%] h-auto origin-center -translate-x-1/2 scale-y-[1.3] object-contain"
            />
            <img
              src={maintenanceTool}
              alt="Layout and maintenance tool"
              className="absolute z-20 left-[-4%] top-[-10%] w-[44%] h-auto object-contain"
            />
            <img
              src={forestPlant}
              alt="Forest plant"
              className="absolute z-30 left-1/2 top-[25%] w-[84%] h-auto -translate-x-1/2 object-contain"
            />
            <img
              src={jungleSoil}
              alt="Jungle soil"
              className="absolute z-20 left-1/2 top-[64%] w-[98%] h-auto -translate-x-1/2 object-contain"
            />
          {/* Keep hotspots in the jar's coordinate system at every breakpoint. */}
          {features.map((feature) => {
            const isActive = feature.id === activeId;
            return (
              <button
                key={`dot-${feature.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveId(isActive ? null : feature.id);
                }}
                aria-label={feature.title}
                aria-expanded={isActive}
                data-diagram-dot={feature.id}
                style={{ top: feature.dotPos.top, left: feature.dotPos.left }}
                className="absolute z-40 pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6CA844]"
              >
                <div className="relative flex items-center justify-center">
                  <span aria-hidden="true" className="pointer-events-none absolute inline-flex h-8 w-8 rounded-full bg-[#6CA844]/60 motion-safe:animate-ping" />
                  <span
                    className={`block rounded-full transition-[background-color,box-shadow,transform] duration-300 motion-reduce:transition-none ${
                      isActive
                        ? 'w-5 h-5 bg-[#6CA844] shadow-[0_0_12px_rgba(108,168,68,0.8)] border-2 border-white'
                        : 'w-4 h-4 bg-[#6CA844] hover:scale-125 border border-white/80'
                    }`}
                  />
                </div>
              </button>
            );
          })}
          </div>

          {/* Active Tooltip Info Card (Desktop & Tablet) */}
          {activeFeature && (
            <div
              ref={cardRef}
              key={activeFeature.id}
              onClick={(e) => e.stopPropagation()}
              style={{
                top: cardPosition?.top ?? 0,
                left: cardPosition?.left ?? 0,
                visibility: cardPosition ? 'visible' : 'hidden',
              }}
              className="hidden md:flex absolute z-30 h-auto max-h-60 w-60 flex-col justify-start overflow-y-auto break-words rounded-none border border-white/50 bg-[#95A2AB]/[0.11] p-3 backdrop-blur-[12px] shadow-[0_12px_32px_rgba(6,35,43,0.14),inset_0_1px_0_rgba(255,255,255,0.55)]"
            >
              <h4 className="shrink-0 font-kanit text-base leading-6 font-light text-[#503A3A] uppercase mb-2">
                {activeFeature.title}
              </h4>
              <p className="shrink-0 font-kanit text-sm leading-[22px] font-light text-[#503A3A]">
                {activeFeature.description}
              </p>
            </div>
          )}

          {/* Desktop Left Labels */}
          {/* Compact cards let the labels sit closer to their product parts. */}
          <div className="hidden md:flex flex-col items-start gap-48 absolute left-2 lg:left-8 xl:left-22 top-1/2 -translate-y-[390px] z-20 pointer-events-auto">
            {features
              .filter((f) => f.side === 'left')
              .sort((a, b) => ['tool', 'glass', 'plants'].indexOf(a.id) - ['tool', 'glass', 'plants'].indexOf(b.id))
              .map((item) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    data-diagram-label={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(isActive ? null : item.id);
                    }}
                    className={`text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6CA844] transition-colors duration-300 hover:opacity-90 ${
                      item.id === 'tool' ? '-translate-x-8' : ''
                    }`}
                  >
                    <span
                      className={`block font-kanit font-medium text-xl sm:text-2xl lg:text-[34px] xl:text-[33px] leading-tight lg:leading-[45px] tracking-normal uppercase transition-colors ${
                        isActive ? 'text-[#7BA641]' : 'text-[#363636]'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.subLabel && (
                      <span
                        className={`block font-kanit font-medium text-xl sm:text-2xl lg:text-[30px] xl:text-[35px] leading-tight lg:leading-[45px] tracking-normal uppercase transition-colors ${
                          isActive ? 'text-[#7BA641]' : 'text-[#363636]'
                        }`}
                      >
                        {item.id === 'tool' ? <>{'MAINTENANCE'}<br />{'TOOL'}</> : item.subLabel}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Desktop Right Labels */}
          <div className="hidden md:flex flex-col justify-between absolute right-8 lg:right-8 xl:right-2 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-8 h-[460px] z-20 pointer-events-auto">
            {features
              .filter((f) => f.side === 'right')
              .sort((a, b) => ['lighting', 'soil'].indexOf(a.id) - ['lighting', 'soil'].indexOf(b.id))
              .map((item) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    data-diagram-label={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(isActive ? null : item.id);
                    }}
                    className="text-left -translate-y-8 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6CA844] transition-colors duration-300 hover:opacity-90"
                  >
                    <span
                      className={`block font-kanit font-medium text-xl sm:text-2xl lg:text-[30px] xl:text-[33px] leading-tight lg:leading-[45px] tracking-normal uppercase transition-colors ${
                        isActive ? 'text-[#7BA641]' : 'text-[#363636]'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.subLabel && (
                      <span
                        className={`block font-kanit font-medium text-xl sm:text-2xl lg:text-[34px] xl:text-[32px] leading-tight lg:leading-[45px] tracking-normal uppercase transition-colors ${
                          isActive ? 'text-[#7BA641]' : 'text-[#363636]'
                        }`}
                      >
                        {item.subLabel}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

        </div>

        {/* Mobile Info Card */}
        {activeFeature && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`mt-8 space-y-6 z-30 relative ${cardPosition ? 'block md:hidden' : 'block'}`}
          >
            <div className="flex h-auto max-h-60 w-60 mx-auto flex-col justify-start overflow-y-auto break-words rounded-none border border-white/50 bg-[#95A2AB]/[0.11] p-3 backdrop-blur-[12px] shadow-[0_12px_32px_rgba(6,35,43,0.14),inset_0_1px_0_rgba(255,255,255,0.55)]">
              <h4 className="shrink-0 font-kanit text-base leading-6 font-light text-[#503A3A] uppercase mb-2">
                {activeFeature.title}
              </h4>
              <p className="shrink-0 font-kanit text-sm leading-[22px] font-light text-[#503A3A]">
                {activeFeature.description}
              </p>
            </div>
          </div>
        )}

        {/* Mobile Quick Feature Buttons */}
        <div className="block md:hidden mt-4">
          <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
            {features.map((item) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={`mobile-${item.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(isActive ? null : item.id);
                  }}
                  className={`p-3 text-center rounded-md font-kanit font-medium text-xs sm:text-sm uppercase tracking-normal transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#7BA641] text-white shadow-md'
                      : 'bg-gray-100 text-[#363636] hover:bg-gray-200'
                  }`}
                >
                  {item.label} {item.subLabel ? ` / ${item.subLabel}` : ''}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default GulmoForestOrganismSection;
