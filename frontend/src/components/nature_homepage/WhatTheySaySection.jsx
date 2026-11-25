import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import partner1Img from '../../assets/nc_home/partner1.jpg';
import partner2Img from '../../assets/nc_home/partner2.jpg';
import brushBg from '../../assets/nc_logo/bush3.png';

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

const defaultTestimonials = [
  { id: 1, name: 'Mr. Dhiraj Basin', location: 'Kolkata', comment: 'Recently Visit the store Awesome experience so many options available like planted aquarium, aquatic plants, terrarium, paludarium, and many related accessories.', image: partner1Img },
  { id: 2, name: 'Mr. Dhiraj Basin', location: 'Kolkata', comment: 'Recently Visit the store Awesome experience so many options available like planted aquarium, aquatic plants, terrarium, paludarium, and many related accessories.', image: partner2Img },
];

const WhatTheySaySection = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamic Data Bindings
  const tagline = data?.tagline || "what they say";
  const titlePrefix = data?.titlePrefix || "OUR";
  const italicTitle = data?.italicTitle || "partners";
  const headline = data?.headline || "Real people with<br />life-changing results";
  
  let testimonials = (data?.testimonials && Array.isArray(data.testimonials) && data.testimonials.length > 0) 
    ? data.testimonials 
    : defaultTestimonials;

  if (testimonials.length === 1 && defaultTestimonials.length > 1) {
    testimonials = [...testimonials, defaultTestimonials[1]];
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeItem = testimonials[currentIndex] || testimonials[0];
  const secondaryItem = testimonials[(currentIndex + 1) % testimonials.length] || testimonials[0];

  const getImageUrl = (img) => {
    if (!img) return partner1Img;
    return getAssetUrl(img);
  };
  if (data?.isVisible === false) return null;
  return (
    <section className="relative w-full min-w-0 overflow-hidden bg-white px-4 py-12 select-none min-[360px]:px-5 sm:px-8 sm:py-16 lg:px-20 lg:py-20">
      
      <div className="absolute -top-10 -left-10 w-[320px] sm:w-[480px] lg:w-[600px] h-auto pointer-events-none z-0 opacity-35">
        <img src={brushBg} alt="" className="w-full h-auto object-contain object-left-top" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1200px] min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        
        {/* Left Column */}
        <div className="flex min-w-0 flex-col items-start pt-0 lg:col-span-5 lg:pt-4">
          <span className="font-kanit text-[18px] sm:text-[20px] font-medium text-[#6CA844] tracking-wide block lowercase mb-3">
            {tagline}
          </span>

          <div className="mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-reem text-[28px] font-bold uppercase leading-[100%] text-black min-[360px]:text-3xl sm:text-5xl lg:text-[55px]" style={{ fontWeight: 700, verticalAlign: 'middle' }}>
              {titlePrefix}
            </span>
            <span className="font-larken text-[34px] font-normal italic lowercase leading-[100%] text-[#6CA844] min-[360px]:text-4xl sm:text-6xl lg:text-[88px]" style={{ fontWeight: 550, verticalAlign: 'middle' }}>
              {italicTitle}
            </span>
          </div>

          <h2 
            className="mb-4 max-w-md break-words font-kanit text-[26px] font-medium leading-[1.2] text-zinc-900 min-[360px]:text-[28px] sm:text-4xl lg:mb-12 lg:max-w-lg lg:text-[40px]"
            dangerouslySetInnerHTML={{ __html: headline }}
          />

          {/* Secondary Card Container - Hidden on smaller screens (`lg:block`) */}
          {testimonials.length > 1 && (
            <div className="hidden lg:block w-full max-w-[360px] relative rounded-xs overflow-hidden shadow-lg group mt-4 sm:mt-6 lg:-mt-4 ml-auto lg:mr-0 z-20">
              <div className="aspect-[4/5] w-full relative">
                <img src={getImageUrl(secondaryItem.image)} alt={secondaryItem.name || 'Testimonial'} className="w-full h-full object-cover object-left" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-40% to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                  <h4 className="font-kanit font-medium text-lg sm:text-xl text-white mb-1">{secondaryItem.name}</h4>
                  <p className="font-kanit font-medium text-sm sm:text-base text-white/90 mb-2">{secondaryItem.location}</p>
                  <p className="font-kanit font-light text-sm sm:text-[15px] leading-relaxed text-white/95 line-clamp-4">{secondaryItem.comment}</p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Navigation Buttons */}
          {testimonials.length > 1 && (
            <div className="hidden lg:flex items-center justify-end gap-5 mt-6 w-full max-w-[360px] ml-auto lg:mr-0 z-20">
              <button 
                onClick={handlePrev} 
                className="w-10 h-10 rounded-full bg-[#f0f4ec] hover:bg-[#6CA844] text-zinc-700 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group" 
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button 
                onClick={handleNext} 
                className="w-10 h-10 rounded-full bg-[#f0f4ec] hover:bg-[#6CA844] text-zinc-700 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group" 
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Featured Single Primary Card for Mobile/Tablet & Desktop */}
        <div className="mt-4 flex w-full min-w-0 max-w-[600px] flex-col items-center lg:col-span-6 lg:mt-60 lg:items-start">
          <div className="relative mx-auto mt-0 ml-0 w-full overflow-hidden rounded-xs shadow-2xl lg:mx-0">
            <div className="w-full aspect-[4/5] max-h-[360px] xs:max-h-[420px] sm:max-h-[500px] lg:max-h-[630px] relative">
              <img src={getImageUrl(activeItem.image)} alt={activeItem.name || 'Testimonial'} className="w-full h-full object-cover object-left" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-40% to-transparent p-6 sm:p-8 lg:p-10 flex flex-col justify-end text-white">
                <h3 className="font-kanit font-medium text-2xl sm:text-3xl lg:text-[32px] text-white mb-1 tracking-tight">{activeItem.name}</h3>
                <p className="font-kanit font-medium text-sm sm:text-base lg:text-[17px] text-white mb-3 sm:mb-5">{activeItem.location}</p>
                <p className="font-kanit font-light text-base sm:text-lg lg:text-[19px] leading-snug sm:leading-normal lg:leading-[1.4] text-white/95 max-w-xl">{activeItem.comment}</p>
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex lg:hidden items-center justify-center gap-3 mt-5 w-full max-w-[600px]">
              <button 
                onClick={handlePrev} 
                className="w-10 h-10 rounded-full bg-[#f0f4ec] active:scale-95 hover:bg-[#7BA641] text-zinc-700 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer" 
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-kanit text-xs text-zinc-500 font-medium px-2">
                {currentIndex + 1} / {testimonials.length}
              </span>
              <button 
                onClick={handleNext} 
                className="w-10 h-10 rounded-full bg-[#f0f4ec] active:scale-95 hover:bg-[#7BA641] text-zinc-700 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer" 
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default WhatTheySaySection;
