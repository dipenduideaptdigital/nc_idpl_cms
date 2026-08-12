import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import partner1Img from '../../assets/nc_home/partner1.jpg';
import partner2Img from '../../assets/nc_home/partner2.jpg';
import brushBg from '../../assets/nc_logo/bush3.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
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
  
  // Use admin testimonials if available, otherwise default
  const testimonials = (data?.testimonials && data.testimonials.length > 0) 
    ? data.testimonials 
    : defaultTestimonials;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeItem = testimonials[currentIndex];
  const secondaryItem = testimonials[(currentIndex + 1) % testimonials.length];

  const getImageUrl = (img) => img?.startsWith('http') || img?.startsWith('/') ? getAssetUrl(img) : img;

  if (testimonials.length === 0) return null;

  return (
    <section className="relative w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-20 overflow-hidden select-none">
      
      <div className="absolute -top-10 -left-10 w-[320px] sm:w-[480px] lg:w-[600px] h-auto pointer-events-none z-0 opacity-35">
        <img src={brushBg} alt="" className="w-full h-auto object-contain object-left-top" />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <div className="lg:col-span-5 flex flex-col items-start pt-0 lg:pt-4">
          <span className="font-kanit text-[18px] sm:text-[20px] font-medium text-[#7BA641] tracking-wide block lowercase mb-3">
            {tagline}
          </span>

          <div className="mb-6 flex items-baseline flex-wrap">
            <span className="font-reem font-bold text-3xl sm:text-5xl lg:text-[64px] text-black leading-[100%] uppercase align-middle" style={{ fontWeight: 700, verticalAlign: 'middle' }}>
              {titlePrefix}
            </span>
            <span className="font-reem font-bold text-3xl sm:text-5xl lg:text-[64px] leading-[100%] align-middle" style={{ fontWeight: 700, verticalAlign: 'middle' }}>
              &nbsp;
            </span>
            <span className="font-larken font-normal italic text-4xl sm:text-6xl lg:text-[88px] text-[#7BA641] leading-[100%] lowercase align-middle" style={{ fontWeight: 400, verticalAlign: 'middle' }}>
              {italicTitle}
            </span>
          </div>

          <h2 
            className="font-kanit font-bold text-2xl sm:text-4xl lg:text-[40px] text-zinc-900 leading-[1.2] max-w-sm mb-6 lg:mb-12"
            dangerouslySetInnerHTML={{ __html: headline }}
          />

          {testimonials.length > 1 && (
            <div className="hidden lg:block w-full max-w-[360px] relative rounded-xs overflow-hidden shadow-lg group mt-16 lg:mt-24">
              <div className="aspect-[4/4.5] w-full relative">
                <img src={getImageUrl(secondaryItem.image)} alt={secondaryItem.name} className="w-full h-full object-cover object-left" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
                  <h4 className="font-kanit font-bold text-base sm:text-lg mb-0.5">{secondaryItem.name}</h4>
                  <p className="font-kanit text-xs text-zinc-300 mb-3">{secondaryItem.location}</p>
                  <p className="font-kanit font-light text-xs leading-relaxed text-zinc-200/90 line-clamp-3">{secondaryItem.comment}</p>
                </div>
              </div>
            </div>
          )}

          {testimonials.length > 1 && (
            <div className="hidden lg:flex items-center justify-center gap-3 mt-6 w-full max-w-[360px]">
              <button 
                onClick={handlePrev} 
                className="w-10 h-10 rounded-full bg-[#f0f4ec] hover:bg-[#7BA641] text-zinc-700 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group" 
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button 
                onClick={handleNext} 
                className="w-10 h-10 rounded-full bg-[#f0f4ec] hover:bg-[#7BA641] text-zinc-700 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group" 
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Featured Large Card */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start w-full">
          <div className="w-full max-w-[600px] relative rounded-xs overflow-hidden shadow-2xl mt-4 lg:mt-48 ml-0 lg:ml-10 mx-auto lg:mx-0">
            <div className="w-full aspect-[4/5] sm:aspect-[768/850] min-h-[380px] sm:min-h-[500px] lg:min-h-[640px] relative">
              <img src={getImageUrl(activeItem.image)} alt={activeItem.name} className="w-full h-full object-cover object-left" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-55% to-transparent p-6 sm:p-10 flex flex-col justify-end text-white">
                <h3 className="font-kanit font-bold text-xl sm:text-2xl mb-1">{activeItem.name}</h3>
                <p className="font-kanit text-sm text-zinc-300 mb-3 font-medium">{activeItem.location}</p>
                <p className="font-kanit font-light text-xs sm:text-sm leading-relaxed text-zinc-200/90 max-w-lg">{activeItem.comment}</p>
              </div>
            </div>
          </div>

          {/* Mobile / Tablet Arrow Controls */}
          {testimonials.length > 1 && (
            <div className="flex lg:hidden items-center justify-center gap-4 mt-6">
              <button 
                onClick={handlePrev} 
                className="w-10 h-10 rounded-full bg-[#f0f4ec] hover:bg-[#7BA641] text-zinc-700 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer group" 
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button 
                onClick={handleNext} 
                className="w-10 h-10 rounded-full bg-[#f0f4ec] hover:bg-[#7BA641] text-zinc-700 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer group" 
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default WhatTheySaySection;