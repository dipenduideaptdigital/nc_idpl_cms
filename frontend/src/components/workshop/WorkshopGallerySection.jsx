import React, { useState, useRef, useEffect } from 'react';
import wgallery1 from '../../assets/nc_logo/wgallery1.png';
import wgallery2 from '../../assets/nc_logo/wgallery2.png';
import wgallery3 from '../../assets/nc_logo/wgallery3.png';
import wgallery4 from '../../assets/nc_logo/wgallery4.png';
import wgallery5 from '../../assets/nc_logo/wgallery5.png';
import brushAccent from '../../assets/nc_logo/brush2.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (typeof path === 'object' && path.url) return getAssetUrl(path.url);
  if (typeof path !== 'string') return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/src/') || path.startsWith('/assets/') || path.startsWith('/@fs/')) return path;

  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';

  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${cleanBaseUrl}${cleanPath}`;
};

const WorkshopGallerySection = ({ data }) => {
  const images = [
    data?.image1 ? getAssetUrl(data.image1) : wgallery1,
    data?.image2 ? getAssetUrl(data.image2) : wgallery2,
    data?.image3 ? getAssetUrl(data.image3) : wgallery3,
    data?.image4 ? getAssetUrl(data.image4) : wgallery4,
    data?.image5 ? getAssetUrl(data.image5) : wgallery5,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  // Auto-shift slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        if (scrollRef.current) {
          const slideWidth = scrollRef.current.clientWidth * 0.82;
          scrollRef.current.scrollTo({
            left: nextIndex * slideWidth,
            behavior: 'smooth'
          });
        }
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const newIndex = Math.round(scrollLeft / (clientWidth * 0.82));
    if (newIndex >= 0 && newIndex < images.length) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const slideWidth = scrollRef.current.clientWidth * 0.82;
    scrollRef.current.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    const prev = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    scrollToIndex(prev);
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % images.length;
    scrollToIndex(next);
  };

  return (
    <section className="relative w-full bg-[#FAFAF7] py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden select-none font-kanit">

      {/* Brush Accent Background */}
      <div className="absolute -bottom-12 -left-12 sm:-bottom-16 sm:-left-16 w-64 sm:w-80 aspect-square pointer-events-none z-0 opacity-35">
        <img
          src={brushAccent}
          alt=""
          className="w-full h-full object-contain filter brightness-110 contrast-105 transform -rotate-45"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="block md:hidden">

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 -mx-4 px-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((imgSrc, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-[82vw] xs:w-[85vw] sm:w-[440px] relative rounded-2xl overflow-hidden bg-zinc-100 shadow-md border border-zinc-200/80 group"
              >
                <img
                  src={imgSrc}
                  alt={`Workshop Gallery ${idx + 1}`}
                  className="w-full h-[250px] xs:h-[290px] sm:h-[320px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Counter Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-kanit font-medium px-2.5 py-1 rounded-full shadow-xs">
                  0{idx + 1} / 0{images.length}
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation & Indicators */}
          <div className="flex items-center justify-between mt-4 px-2">
            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="w-9 h-9 rounded-full bg-white shadow-xs border border-zinc-200/80 flex items-center justify-center text-zinc-800 disabled:opacity-40 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous Slide"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                disabled={activeIndex === images.length - 1}
                className="w-9 h-9 rounded-full bg-white shadow-xs border border-zinc-200/80 flex items-center justify-center text-zinc-800 disabled:opacity-40 active:scale-95 transition-all cursor-pointer"
                aria-label="Next Slide"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Pill Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx
                      ? 'w-7 bg-[#7BA641]'
                      : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

        <div className="hidden md:flex flex-col space-y-5 sm:space-y-6">
          <div className="grid grid-cols-12 gap-4 sm:gap-5 items-start">
            <div className="col-span-4 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
              <img src={images[0]} alt="Workshop Gallery 1" className="w-full h-[285px] object-cover object-center" />
            </div>
            <div className="col-span-5 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
              <img src={images[1]} alt="Workshop Gallery 2" className="w-full h-[310px] object-cover object-center" />
            </div>
            <div className="col-span-3 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
              <img src={images[2]} alt="Workshop Gallery 3" className="w-full h-[265px] object-cover object-center" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 sm:gap-5 items-start">
            <div className="col-start-2 col-span-6 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
              <img src={images[3]} alt="Workshop Gallery 4" className="w-full h-[420px] object-cover object-center" />
            </div>
            <div className="col-span-4 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
              <img src={images[4]} alt="Workshop Gallery 5" className="w-full h-[305px] object-cover object-center" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WorkshopGallerySection;