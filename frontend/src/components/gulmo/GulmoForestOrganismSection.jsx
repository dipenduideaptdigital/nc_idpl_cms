import React, { useState, useEffect, useRef } from 'react';
import designJar from '../../assets/nc_home/design_jar.png';
import brush2 from '../../assets/nc_logo/brush2.png';

const GulmoForestOrganismSection = ({ data }) => {
  const features = [
    {
      id: 'glass',
      label: data?.f1Label || 'GLASS',
      subLabel: '',
      title: data?.f1Title || 'GLASS: TOP CASE',
      description: data?.f1Desc || 'A tall glass cover with ventilation holes that maintains high humidity and temperature.',
      side: 'left',
      dotPos: { top: '22%', left: '42.5%' },
      cardPos: { top: '27%', left: '30%' },
    },
    {
      id: 'lighting',
      label: data?.f2Label || 'LIGHTING SYSTEM',
      subLabel: '',
      title: data?.f2Title || 'LIGHTING SYSTEM',
      description: data?.f2Desc || 'High-spectrum LED lighting engineered specifically to support photosynthesis and vibrant plant growth.',
      side: 'right',
      dotPos: { top: '15%', left: '56.5%' },
      cardPos: { top: '12%', left: '58%' },
    },
    {
      id: 'plants',
      label: data?.f3Label || 'PLANTS',
      subLabel: '',
      title: data?.f3Title || 'PLANTS & FLORA',
      description: data?.f3Desc || 'Lush evergreen mosses, miniature ferns, and humidity-retaining species crafted for long-term health.',
      side: 'left',
      dotPos: { top: '48%', left: '44%' },
      cardPos: { top: '42%', left: '26%' },
    },
    {
      id: 'terra',
      label: data?.f4Label || 'TERRA BASE',
      subLabel: data?.f4Sub || 'TERRA PLATE',
      title: data?.f4Title || 'TERRA BASE & TERRA PLATE',
      description: data?.f4Desc || 'Cylindrical porous ceramic base supplying continuous hydration through natural water evaporation.',
      side: 'right',
      dotPos: { top: '63%', left: '53.5%' },
      cardPos: { top: '55%', left: '58%' },
    },
    {
      id: 'substrate',
      label: data?.f5Label || 'SUBSTRATE',
      subLabel: '',
      title: data?.f5Title || 'SUBSTRATE & SOIL',
      description: data?.f5Desc || 'Multi-layered nutrient substratum optimized for root breathability and balanced moisture retention.',
      side: 'left',
      dotPos: { top: '75%', left: '43.5%' },
      cardPos: { top: '68%', left: '26%' },
    },
    {
      id: 'tool',
      label: data?.f6Label || 'LAYOUT &',
      subLabel: data?.f6Sub || 'MAINTENANCE TOOL',
      title: data?.f6Title || 'LAYOUT & MAINTENANCE TOOL',
      description: data?.f6Desc || 'Precision aquascaping tools for delicate planting, trimming, and pin-point maintenance.',
      side: 'right',
      dotPos: { top: '80%', left: '55%' },
      cardPos: { top: '72%', left: '58%' },
    },
  ];

  const [activeId, setActiveId] = useState('glass');
  const containerRef = useRef(null);

  const activeFeature = features.find((f) => f.id === activeId);

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
      className="w-full bg-[#fdfdfc] text-[#374151] py-16 sm:py-20 md:py-24 px-4 sm:px-8 overflow-hidden select-none font-kanit cursor-default"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Heading */}
        <h2
          style={{ fontFamily: "'Caveat', 'Architects Daughter', 'Patrick Hand', cursive" }}
          className="font-caveat text-4xl sm:text-5xl md:text-6xl lg:text-5xl text-[#7BA641] font-normal tracking-wide text-center mb-8 md:mb-14"
        >
          {data?.mainTitle || 'The Forest Is A Peculiar Organism'}
        </h2>

        {/* Main Diagram Area */}
        <div
          onClick={() => setActiveId(null)}
          className="relative w-full max-w-4xl mx-auto min-h-[550px] sm:min-h-[620px] md:min-h-[700px] flex items-center justify-center"
        >
          
          {/* Background Brush Splash */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img
              src={data?.brushImage || brush2}
              alt="Organic Green Brush Splash"
              className="w-[340px] sm:w-[480px] md:w-[580px] lg:w-[500px] h-auto object-contain opacity-85 transform translate-y-6 md:translate-y-10"
            />
          </div>

          {/* Central Glass Jar Assembly */}
          <div className="relative z-10 flex justify-center items-center py-8 mt-5 pointer-events-none">
            <img
              src={data?.jarImage || designJar}
              alt="Exploded Terrarium Design Jar"
              className="w-[180px] sm:w-[240px] md:w-[290px] lg:w-[240px] h-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Hotspot Dots on the Jar Diagram */}
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
                style={{ top: feature.dotPos.top, left: feature.dotPos.left }}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
              >
                <div className="relative flex items-center justify-center">
                  {isActive && (
                    <span className="absolute inline-flex h-6 w-6 rounded-full bg-[#7BA641]/60 animate-ping" />
                  )}
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-4 h-4 bg-[#7BA641] shadow-[0_0_12px_rgba(123,166,65,0.8)] border-2 border-white'
                        : 'w-3 h-3 bg-[#7BA641]/70 hover:bg-[#7BA641] hover:scale-125 border border-white/80'
                    }`}
                  />
                </div>
              </button>
            );
          })}

          {/* Active Tooltip Info Card (Desktop & Tablet) */}
          {activeFeature && (
            <div
              key={activeFeature.id}
              onClick={(e) => e.stopPropagation()}
              style={{
                top: activeFeature.cardPos.top,
                left: activeFeature.cardPos.left,
              }}
              className="hidden md:block absolute z-30 transform -translate-x-1/2 -translate-y-1/2 w-64 lg:w-72 bg-[#e4e7df]/85 backdrop-blur-md border border-white/60 rounded-sm p-4 sm:p-5 shadow-xl transition-all duration-400 ease-out"
            >
              <h4 className="text-xs sm:text-sm font-bold text-[#556349] tracking-wider uppercase mb-2">
                {activeFeature.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#525e49] leading-relaxed font-normal">
                {activeFeature.description}
              </p>
            </div>
          )}

          {/* Desktop Left Labels */}
          <div className="hidden md:flex flex-col justify-between absolute left-2 lg:left-8 xl:left-22 top-1/2 -translate-y-1/2 h-[460px] z-20 pointer-events-auto">
            {features
              .filter((f) => f.side === 'left')
              .map((item) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(isActive ? null : item.id);
                    }}
                    className={`text-left group cursor-pointer focus:outline-none transition-all duration-300 ${
                      isActive ? 'scale-105' : 'hover:opacity-90'
                    }`}
                  >
                    <span
                      className={`block font-kanit font-medium text-xl sm:text-2xl lg:text-[34px] xl:text-[33px] leading-tight lg:leading-[45px] tracking-normal uppercase transition-colors ${
                        isActive ? 'text-[#7BA641]' : 'text-[#6A6A6A]'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.subLabel && (
                      <span
                        className={`block font-kanit font-medium text-xl sm:text-2xl lg:text-[30px] xl:text-[35px] leading-tight lg:leading-[45px] tracking-normal uppercase transition-colors ${
                          isActive ? 'text-[#7BA641]' : 'text-[#6A6A6A]'
                        }`}
                      >
                        {item.subLabel}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Desktop Right Labels */}
          <div className="hidden md:flex flex-col justify-between absolute right-8 lg:right-8 xl:right-2 top-1/2 -translate-y-1/2 h-[460px] z-20 pointer-events-auto">
            {features
              .filter((f) => f.side === 'right')
              .map((item) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(isActive ? null : item.id);
                    }}
                    className={`text-right group cursor-pointer focus:outline-none transition-all duration-300 ${
                      isActive ? 'scale-105' : 'hover:opacity-90'
                    }`}
                  >
                    <span
                      className={`block font-kanit font-medium text-xl sm:text-2xl lg:text-[30px] xl:text-[33px] leading-tight lg:leading-[45px] tracking-normal uppercase transition-colors ${
                        isActive ? 'text-[#7BA641]' : 'text-[#6A6A6A]'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.subLabel && (
                      <span
                        className={`block font-kanit font-medium text-xl sm:text-2xl lg:text-[34px] xl:text-[32px] leading-tight lg:leading-[45px] tracking-normal uppercase transition-colors ${
                          isActive ? 'text-[#7BA641]' : 'text-[#6A6A6A]'
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
            className="block md:hidden mt-8 space-y-6 z-30 relative"
          >
            <div className="bg-[#e4e7df]/90 backdrop-blur-md border border-white/60 rounded-lg p-5 shadow-lg max-w-md mx-auto">
              <h4 className="text-sm font-bold text-[#556349] tracking-wider uppercase mb-2">
                {activeFeature.title}
              </h4>
              <p className="text-xs text-[#525e49] leading-relaxed font-normal">
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
                      : 'bg-gray-100 text-[#6A6A6A] hover:bg-gray-200'
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