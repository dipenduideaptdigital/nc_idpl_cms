import React, { useState, useEffect } from 'react';
import brush2Img from '../../assets/nc_logo/bush3.png';
import defaultConsultationImg from '../../assets/nc_home/consultation.png';
import card1Img from '../../assets/nc_home/card1.png';
import card2Img from '../../assets/nc_home/card2.png';
import card3Img from '../../assets/nc_home/card3.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (typeof path === 'object' && path.url) return getAssetUrl(path.url);
  const pathStr = String(path);
  if (
    pathStr.startsWith('http') || 
    pathStr.startsWith('data:') || 
    pathStr.startsWith('blob:') || 
    pathStr.startsWith('/src/') || 
    pathStr.startsWith('/assets/') ||
    pathStr.startsWith('/@fs/')
  ) {
    return pathStr;
  }
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${pathStr.startsWith('/') ? pathStr : `/${pathStr}`}`;
};

const defaultServices = [
  {
    number: '01',
    title: 'DESIGN CONSULTATION',
    description: "Every project starts as a question no one has asked yet. We go in deep, past the surface, past the expected and come back with something that didn't exist before.",
    image: defaultConsultationImg
  },
  {
    number: '02',
    title: 'SYSTEM PLANNING & 3D LAYOUT',
    description: "We map equipment, hydraulic flow, filtration systems and calculate lighting spectrums to create balanced, self-sustaining aquatic bio-ecosystems.",
    image: card1Img
  },
  {
    number: '03',
    title: 'TECHNICAL DRAWINGS & HARDSCAPE',
    description: "Precision architectural blueprints defining proportions, Seiryu stone structures, and driftwood arrangements before water is introduced.",
    image: card2Img
  },
  {
    number: '04',
    title: 'INSTALLATION & MAINTENANCE',
    description: "White-glove installation, aquascaping execution, and long-term care programs ensuring crystal clarity and ecological longevity.",
    image: card3Img
  }
];

const ServicesSection = ({ data }) => {
  const tagline = data?.tagline || "our services";
  const headline = data?.headline || "Every project starts as a question no one has asked yet. We go in deep, past the surface, past the expected and come back with something that didn't exist before.";
  const subtext = data?.subtext || "Every project starts as a question no one has asked yet. We go in deep, past the surface, past the expected and come back with something that didn't exist before.";
  
  // Build service list for auto rotation
  let servicesToRender = [];
  if (data?.services && Array.isArray(data.services) && data.services.length > 0) {
    servicesToRender = data.services.map((svc, idx) => {
      const fallback = defaultServices[idx % defaultServices.length] || defaultServices[0];
      return {
        number: svc.number || fallback.number,
        title: svc.title || fallback.title,
        description: svc.description || fallback.description,
        image: (svc.image && typeof svc.image === 'string' && svc.image.trim() !== '') 
          ? svc.image 
          : fallback.image
      };
    });

    // If only 1 card is provided from backend/CMS, append default cards to enable card rotation
    if (servicesToRender.length === 1 && defaultServices.length > 1) {
      servicesToRender = [
        ...servicesToRender,
        ...defaultServices.slice(1)
      ];
    }
  } else {
    servicesToRender = defaultServices;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Auto slide interval every 4 seconds (4000ms)
  useEffect(() => {
    if (servicesToRender.length <= 1) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % servicesToRender.length);
        setIsFading(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [servicesToRender.length]);

  const safeIndex = currentIndex % Math.max(1, servicesToRender.length);
  const currentService = servicesToRender[safeIndex] || servicesToRender[0];
  if (data?.isVisible === false) return null;
  return (
    <section className="relative w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 overflow-hidden select-none">
      
      <div className="absolute top-[5%] right-0 w-[350px] sm:w-[500px] lg:w-[450px] h-auto pointer-events-none z-0 opacity-100 translate-x-[30%]">
        <img src={brush2Img} alt="" className="w-full h-auto object-contain transform rotate-150" />
      </div>

      <div className="w-full mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-[820px] mb-12 sm:mb-16">
          <span className="font-kanit text-[20px] sm:text-[30px] font-medium text-[#6CAB44] leading-[100%] tracking-[0%] align-middle block lowercase mb-8 sm:mb-10" style={{ fontWeight: 500, verticalAlign: 'middle' }}>
            {tagline}
          </span>
          <div 
            className="font-kanit text-2xl sm:text-4xl lg:text-[36px] font-light text-zinc-900 leading-[32px] sm:leading-[38px] lg:leading-[42px] tracking-[0%] align-middle max-w-4xl mb-6 sm:mb-8 [&>p]:m-0" 
            style={{ fontWeight: 300, verticalAlign: 'middle' }}
            dangerouslySetInnerHTML={{ __html: headline }}
          />
          <div 
            className="font-kanit text-base sm:text-lg text-zinc-500 font-light leading-[26px] sm:leading-[30px] tracking-[0%] align-middle max-w-[500px] [&>p]:m-0" 
            style={{ fontWeight: 300, verticalAlign: 'middle' }}
            dangerouslySetInnerHTML={{ __html: subtext }}
          />
        </div>

        {/* Dynamic Card Container - Automatically rotates every 4 seconds */}
        <div className="relative w-full mx-auto">
          {/* Main Card */}
          <div className="relative rounded-xs overflow-hidden shadow-2xl bg-[#08171d] min-h-[500px] lg:h-[680px] xl:h-[760px] grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Image Side (8 Columns) */}
            <div className="lg:col-span-8 relative h-[240px] sm:h-[300px] lg:h-full overflow-hidden">
              <img
                src={getAssetUrl(currentService.image)}
                alt={currentService.title || 'Service'}
                className={`absolute inset-0 w-full h-full object-cover object-left-top filter brightness-105 contrast-105 transition-all duration-700 ease-out transform ${
                  isFading ? 'opacity-40 scale-105 blur-xs' : 'opacity-100 scale-100'
                }`}
              />
              {/* Soft gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-[#08171d]/30 via-65% to-[#08171d] pointer-events-none z-10" />
            </div>

            {/* Right Dark Content Side (4 Columns) */}
            <div className={`lg:col-span-4 bg-[#08171d] p-6 sm:p-8 lg:p-12 flex flex-col justify-between space-y-4 lg:space-y-6 text-white relative z-10 lg:-ml-8 min-h-[260px] lg:h-full transition-all duration-500 ${
              isFading ? 'opacity-30 translate-x-2' : 'opacity-100 translate-x-0'
            }`}>
              <div className="space-y-4 sm:space-y-6">
                <div className="font-kanit text-4xl sm:text-5xl lg:text-6xl font-normal text-[#6CAB44] tracking-wider">
                  {currentService.number || `0${currentIndex + 1}`}
                </div>
                <h3 className="font-kanit text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide uppercase">
                  {currentService.title}
                </h3>
                <div 
                  className="font-kanit text-sm sm:text-base text-zinc-200/90 font-light leading-[26px] sm:leading-[30px] lg:leading-[34px] tracking-[0%] align-middle [&>p]:m-0" 
                  dangerouslySetInnerHTML={{ __html: currentService.description }}
                />
              </div>

              {/* Minimal Card Indicators */}
              {servicesToRender.length > 1 && (
                <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {servicesToRender.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          idx === currentIndex 
                            ? 'w-8 bg-[#6CAB44]' 
                            : 'w-2 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="font-kanit text-xs text-zinc-400 tracking-widest font-mono">
                    0{currentIndex + 1} / 0{servicesToRender.length}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Stacked Cards visual lower layers */}
          <div className="h-4 bg-[#23353d] mx-6 rounded-b-sm shadow-md" />
          <div className="h-4 bg-[#142329] mx-12 rounded-b-sm shadow-sm" />
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;