import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import bigImg from '../../assets/aboutUs/big.png';
import sm1 from '../../assets/aboutUs/sm1.png';
import sm2 from '../../assets/aboutUs/sm2.png';
import sm3 from '../../assets/aboutUs/sm3.png';
import sm4 from '../../assets/aboutUs/sm4.png';

const GALLERY_DATA = [
  { id: 1, src: sm1, title: 'Title' },
  { id: 2, src: sm2, title: 'Title' },
  { id: 3, src: sm3, title: 'Title' },
  { id: 4, src: sm4, title: 'Title' },
];

const AboutGallery = () => {
  const [visibleCards, setVisibleCards] = useState(3.2);
  const [currentIndex, setCurrentIndex] = useState(4); // Start at first item of the middle set
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Triple the data to enable seamless loop wrapping
  const tripledData = [...GALLERY_DATA, ...GALLERY_DATA, ...GALLERY_DATA];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1.2);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2.2);
      } else {
        setVisibleCards(3.2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    const total = GALLERY_DATA.length;
    // When we transition past the boundaries, reset position instantly
    if (currentIndex >= total * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex - total);
      }, 700); // must match the transition duration
      return () => clearTimeout(timer);
    } else if (currentIndex < total) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex + total);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  const isMobileOrTablet = visibleCards < 3.2;
  const translateXValue = isMobileOrTablet 
    ? `translateX(calc(50% - 110px - ${currentIndex * 244}px))` 
    : `translateX(-${currentIndex * 244}px)`;

  return (
    <section className="relative w-full py-20 font-helvetica overflow-hidden flex flex-col justify-center min-h-[650px] lg:min-h-[750px]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={bigImg}
          alt="Gallery Background"
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay darkening to keep white text readable */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full">

          {/* LEFT COLUMN: TEXT */}
          <div className="w-full lg:w-[38%] flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:ml-12 mx-auto shrink-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-1.5 mb-6 w-fit bg-white/5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white">
                Our Approach
              </span>
            </div>

            <h2 className="text-[36px] xs:text-[44px] md:text-[60px] lg:text-[90px] font-black text-white font-['Outfit'] leading-[1.15] tracking-tight mb-6">
              Designing Beyond the<br />
              Expected
            </h2>

            <p className="text-[14px] lg:text-[15px] text-white leading-relaxed max-w-[360px] font-normal">
              At subhAAkritee, our process is deeply collaborative and precision-driven. From initial concept to final execution, we focus on thoughtful detailing, seamless coordination, and uncompromised quality—delivering refined residential, corporate, and architectural spaces that are both functional and distinctive.
            </p>
          </div>

          {/* RIGHT COLUMN: SLIDER */}
          <div className="w-full lg:w-[70%] overflow-hidden mt-8">
            <div 
              className="flex gap-6"
              style={{ 
                transform: translateXValue,
                transition: isTransitioning ? 'transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
              }}
            >
              {tripledData.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex-shrink-0 flex flex-col group cursor-pointer w-[220px]"
                >
                  {/* Card Container */}
                  <div className="overflow-hidden rounded-[32px] w-full h-[300px] relative shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-white/10 group-hover:border-white/20">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Title */}
                  <h4 className="text-center text-white font-bold text-[16px] lg:text-[18px] mt-4">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CENTERED BUTTONS BELOW THE COLUMNS */}
        <div className="flex items-center justify-center gap-4 mt-12 lg:mt-16 z-20 lg:ml-12">
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer active:scale-95 bg-black/10 backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next"
            className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer active:scale-95 bg-black/10 backdrop-blur-sm"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutGallery;