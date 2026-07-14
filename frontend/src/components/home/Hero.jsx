import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client'; 
import defaultHeroback from '../../assets/homepage/banner_back.png';
import defaultHerofront from '../../assets/homepage/banner_front.png';
import defaultOfficeBg from '../../assets/homepage/landing_page.png';
import defaultArchBg from '../../assets/homepage/archietect.png';
import { renderTitle } from '../../utils/titleRenderer';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const Hero = ({ data: externalData }) => {
  const [homeData, setHomeData] = useState(externalData || null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);

      try {
        if (externalData) {
          setHomeData(externalData);
        } else {
          const res = await apiClient.get('/cms/section/homepage_hero');
          if (res.data?.success && res.data?.data?.content) {
            setHomeData(res.data.data.content);
          }
        }
      } catch (err) {
        console.error('Failed to fetch home hero CMS:', err);
      }

      const slide1Data = homeData?.slide1 || {};
      const slide2Data = homeData?.slide2 || {};
      const slide3Data = homeData?.slide3 || {};

      const imagesToPreload = [
        slide1Data.backgroundImage ? getAssetUrl(slide1Data.backgroundImage) : defaultHeroback,
        slide1Data.frontImage ? getAssetUrl(slide1Data.frontImage) : defaultHerofront,
        slide2Data.backgroundImage ? getAssetUrl(slide2Data.backgroundImage) : defaultOfficeBg,
        slide3Data.backgroundImage ? getAssetUrl(slide3Data.backgroundImage) : defaultArchBg
      ];

      try {
        await Promise.all(imagesToPreload.filter(Boolean).map(url => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }));
      } catch (preloadErr) {
        console.error('Error preloading slider images:', preloadErr);
      }

      setIsLoading(false);
    };

    fetchAllData();
  }, [externalData]);

  useEffect(() => {
    if (isLoading || isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLoading, isPaused]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('services-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="relative h-[650px] lg:h-[750px] xl:h-[800px] w-full flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
        <div className="z-10 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-white/70 tracking-widest text-sm uppercase">Loading Slider...</p>
        </div>
      </div>
    );
  }

  const slides = [
    {
      type: 'residential',
      data: homeData?.slide1 || {},
      fallback: {
        badgeText: "Fast and Reliable",
        titleLine1: "End-to-end",
        titleLine2: "Residential Interiors",
        subtitle: "<p>We specialize in transforming visions into reality. Explore our interior design projects crafted with precision.</p>",
        buttonText: "BOOK A FREE CONSULTATION",
        backgroundImage: defaultHeroback,
        frontImage: defaultHerofront,
        glassCardNumber: "250+",
        glassCardText1: "Lorem Ipsum Is Simply Dummy Text",
        glassCardText2: "There Is No One Who Loves Pain Itself",
      }
    },
    {
      type: 'office',
      data: homeData?.slide2 || {},
      fallback: {
        badgeText: "FAST AND RELIABLE",
        title: "Find Your [Inspired]\n[Interior] Design",
        description: "<p>Transform your vision into reality with our innovative designs, creating modern spaces that blend functionality, aesthetics, and sustainability.</p>",
        watermarkText: "Interior",
        backgroundImage: defaultOfficeBg,
      }
    },
    {
      type: 'architecture',
      data: homeData?.slide3 || {},
      fallback: {
        titleLine1: "End-To-End",
        titleLine2: "Office Interiors",
        subtitle: "For Every Test & Budget",
        description: "<p>Simply dummy text of the printing and typesetting. Lorem Ipsum has been the industry's standard,</p>",
        buttonText: "Book A Free Consultation",
        backgroundImage: defaultArchBg,
      }
    }
  ];

  return (
    <div 
      className="relative w-full h-[650px] lg:h-[750px] xl:h-[800px] bg-zinc-900 overflow-hidden group select-none animate-in fade-in duration-700"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeSlide;
        const bgImage = slide.data?.backgroundImage ? getAssetUrl(slide.data.backgroundImage) : slide.fallback.backgroundImage;

        return (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none'
            }`}
          >
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[5000ms] ease-out"
              style={{ 
                backgroundImage: `url(${bgImage})`,
                transform: isActive && !isPaused ? 'scale(1.05)' : 'scale(1.00)'
              }}
            >
              {slide.type === 'residential' && (
                <>
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
                </>
              )}
              {slide.type === 'office' && <div className="absolute inset-0 bg-black/35 z-0"></div>}
              {slide.type === 'architecture' && <div className="absolute inset-0 bg-black/30 md:bg-black/10"></div>}
            </div>

            {/* SLIDE 1: RESIDENTIAL DESIGN */}
            {slide.type === 'residential' && (
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 pt-16 lg:pt-0 pb-16 lg:pb-0">
                  <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-12 lg:gap-8 pt-8 lg:pt-0">
                    
                    <div className="text-white max-w-xl lg:max-w-2xl xl:max-w-3xl flex flex-col items-start text-left w-full lg:w-auto">
                      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-sm mb-6 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                        <span className="text-[10px] uppercase tracking-wider font-medium text-white/90">
                          {slide.data?.badgeText || slide.fallback.badgeText}
                        </span>
                      </div>
                      
                      <h1 className="text-3xl md:text-4xl lg:text-[48px] xl:text-[62px] 2xl:text-[76px] font-bold leading-tight lg:leading-[54px] xl:leading-[68px] 2xl:leading-[82px] mb-4 md:mb-6 drop-shadow-lg font-helvetica">
                        <span className="tracking-normal block whitespace-nowrap">{slide.data?.titleLine1 || slide.fallback.titleLine1}</span>
                        <span className="tracking-[0.1em] block whitespace-nowrap">{slide.data?.titleLine2 || slide.fallback.titleLine2}</span>
                      </h1>
                      
                      {/* 👉 TipTap Editor HTML Rendering */}
                      <div 
                        className="text-sm md:text-lg text-gray-200 mb-8 md:mb-10 lg:max-w-[430px] font-light leading-relaxed ml-2 [&_p]:m-0 [&_a]:text-blue-400 hover:[&_a]:text-blue-300 [&_strong]:text-white [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                        dangerouslySetInnerHTML={{ __html: slide.data?.subtitle || slide.fallback.subtitle }}
                      />
                      
                      <Link to="/contact" className="group inline-flex items-center space-x-4 md:space-x-6 rounded-full border border-white/40 hover:border-white transition-all pl-5 md:pl-6 pr-2 py-2 ml-2">
                        <span className="text-xs md:text-sm font-medium tracking-wide">{slide.data?.buttonText || slide.fallback.buttonText}</span>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105">
                          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                      </Link>
                    </div>

                    <div className="flex flex-row items-end justify-center lg:justify-end gap-6 shrink-0 w-full lg:w-auto mt-10 lg:mt-10 pb-1">
                      <div className="w-[160px] h-[220px] md:w-[215px] md:h-[270px] bg-[#3a3532]/40 glass-dark rounded-[24px] p-6 shadow-2xl z-20 flex flex-col justify-between shrink-0">
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{slide.data?.glassCardNumber || slide.fallback.glassCardNumber}</h2>
                          <p className="text-xs text-gray-200 font-normal leading-relaxed">{slide.data?.glassCardText1 || slide.fallback.glassCardText1}</p>
                        </div>
                        <p className="text-sm text-white font-medium">{slide.data?.glassCardText2 || slide.fallback.glassCardText2}</p>
                      </div>

                      <div className="w-[160px] h-[220px] md:w-[215px] md:h-[270px] rounded-[24px] overflow-hidden shadow-2xl z-10 border-2 border-white/10 shrink-0">
                        <img 
                          src={slide.data?.frontImage ? getAssetUrl(slide.data.frontImage) : slide.fallback.frontImage} 
                          alt="Hero Foreground" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (e.currentTarget.src !== defaultHerofront) e.currentTarget.src = defaultHerofront;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 2: OFFICE DESIGN */}
            {slide.type === 'office' && (
              <div className="w-full h-full flex flex-col justify-between relative z-10 font-helvetica">
                <div className="relative z-10 flex-grow container mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center pt-32 pb-4">
                  <div className="max-w-3xl text-left">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6 animate-fade-in-down">
                      <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
                      <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-white/90">
                        {slide.data?.badgeText || slide.fallback.badgeText}
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-[70px] font-bold text-white tracking-tight leading-[1.08] mb-6 font-helvetica">
                      {renderTitle(slide.data?.title || slide.fallback.title)}
                    </h1>

                    {/* 👉 TipTap Editor HTML Rendering */}
                    <div 
                      className="text-white/85 text-sm md:text-base lg:text-lg max-w-[460px] font-normal leading-relaxed mb-8 md:mb-12 [&_p]:m-0 [&_a]:text-blue-400 hover:[&_a]:text-blue-300 [&_strong]:text-white [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                      dangerouslySetInnerHTML={{ __html: slide.data?.description || slide.fallback.description }}
                    />
                  </div>
                </div>

                <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-20">
                  <div className="w-full h-[1px] bg-white/15 mb-6"></div>

                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                    <div className="relative z-20">
                      <div 
                        className="w-32 h-32 md:w-36 md:h-36 lg:w-[150px] lg:h-[150px] rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center text-white cursor-pointer hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
                        onClick={handleScrollDown}
                      >
                        <div className="font-['Outfit'] text-[24px] md:text-[30px] lg:text-[27px] font-semibold leading-[30px] md:leading-[34px] lg:leading-[39px] text-white text-center tracking-normal select-none">
                          Start<br />Project
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 md:right-12 z-20">
                  <button 
                    onClick={handleScrollDown}
                    className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    aria-label="Scroll Down"
                  >
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </button>
                </div>

                <div className="absolute -bottom-6 md:-bottom-10 lg:-bottom-12 left-1/2 -translate-x-1/2 select-none pointer-events-none z-[1] overflow-hidden w-full text-right max-w-[1440px] pl-6 mb-12 ml-0 md:ml-10">
                  <h2 className="whitespace-nowrap text-[50px] sm:text-[100px] md:text-[150px] lg:text-[160px] xl:text-[230px] font-bold text-white/20 tracking-[0.08em] font-serif leading-none uppercase">
                    {slide.data?.watermarkText || slide.fallback.watermarkText}
                  </h2>
                </div>
              </div>
            )}

            {/* SLIDE 3: ARCHITECTURE DESIGN */}
            {slide.type === 'architecture' && (
              <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 h-full flex flex-col justify-center font-sans">
                <div className="max-w-2xl mt-16 md:mt-24">
                  <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4 tracking-tight">
                    {slide.data?.titleLine1 || slide.fallback.titleLine1}<br />
                    {slide.data?.titleLine2 || slide.fallback.titleLine2}
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                    {slide.data?.subtitle || slide.fallback.subtitle}
                  </h2>
                  
                  <div 
                    className="text-base md:text-lg text-gray-200 mb-10 max-w-lg font-light leading-relaxed [&_p]:m-0 [&_a]:text-blue-400 hover:[&_a]:text-blue-300 [&_strong]:text-white [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: slide.data?.description || slide.fallback.description }}
                  />
                  
                  <button 
                    onClick={handleScrollDown}
                    className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-3.5 rounded-md text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-orange-500/30 uppercase cursor-pointer"
                  >
                    {slide.data?.buttonText || slide.fallback.buttonText}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        );
      })}

      {/* Manual Navigation */}
      <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-black/45 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 cursor-pointer scale-90 hover:scale-100">
        <ArrowLeft className="w-5 h-5" />
      </button>

      <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-black/45 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 cursor-pointer scale-90 hover:scale-100">
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex space-x-3 bg-black/10 backdrop-blur-md px-4 py-1 mt-2 rounded-full border border-white/10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeSlide === idx ? 'w-8 bg-secondary' : 'w-2.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Arrow Indicator (Only Slide 1) */}
      {activeSlide === 0 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 mt-5">
          <button 
            onClick={handleScrollDown}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer animate-bounce"
          >
            <ArrowDown className="w-6 h-6 text-primary" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Hero;