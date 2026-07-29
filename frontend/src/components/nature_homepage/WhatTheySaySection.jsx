import React, { useState } from 'react';
import partner1Img from '../../assets/nc_home/partner1.jpg';
import partner2Img from '../../assets/nc_home/partner2.jpg';
import brushBg from '../../assets/nc_logo/bush3.png';

const WhatTheySaySection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Mr. Dhiraj Basin',
      location: 'Kolkata',
      comment: 'Recently Visit the store Awesome experience so many options available like planted aquarium, aquatic plants, terrarium, paludarium, and many related accessories.',
      image: partner1Img,
    },
    {
      id: 2,
      name: 'Mr. Dhiraj Basin',
      location: 'Kolkata',
      comment: 'Recently Visit the store Awesome experience so many options available like planted aquarium, aquatic plants, terrarium, paludarium, and many related accessories.',
      image: partner2Img,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeItem = testimonials[currentIndex];
  const secondaryItem = testimonials[(currentIndex + 1) % testimonials.length];

  return (
    <section className="relative w-full bg-white py-20 sm:py-28 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      
      {/* Soft Green Watercolor Splash Top-Left */}
      <div className="absolute -top-10 -left-10 w-[350px] sm:w-[500px] lg:w-[600px] h-auto pointer-events-none z-0 opacity-35">
        <img
          src={brushBg}
          alt=""
          className="w-full h-auto object-contain object-left-top"
        />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Title & Text Block */}
        <div className="lg:col-span-5 flex flex-col items-start pt-0 lg:pt-4">
          {/* Tag */}
          <span className="font-kanit text-[20px] font-medium text-[#7BA641] tracking-wide block lowercase mb-3">
            what they say
          </span>

          {/* Section Title: OUR partners */}
          <div className="mb-6 flex items-baseline">
            <span 
              className="font-reem font-bold text-4xl sm:text-5xl lg:text-[64px] text-black leading-[100%] tracking-[0%] uppercase align-middle"
              style={{ fontWeight: 700, verticalAlign: 'middle' }}
            >
              OUR
            </span>
            <span 
              className="font-reem font-bold text-4xl sm:text-5xl lg:text-[64px] leading-[100%] tracking-[0%] align-middle"
              style={{ fontWeight: 700, verticalAlign: 'middle' }}
            >
              &nbsp;
            </span>
            <span 
              className="font-larken font-normal italic text-5xl sm:text-7xl lg:text-[88px] text-[#7BA641] leading-[100%] tracking-[0%] lowercase align-middle"
              style={{ fontWeight: 400, verticalAlign: 'middle' }}
            >
              partners
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-kanit font-bold text-2xl sm:text-4xl lg:text-[40px] text-zinc-900 leading-[1.2] max-w-sm mb-12">
            Real people with<br />life-changing results
          </h2>

          {/* Left Smaller Card (Secondary Item) */}
          <div className="hidden lg:block w-full max-w-[360px] relative rounded-xs overflow-hidden shadow-lg group mt-25">
            <div className="aspect-[4/4.5] w-full relative">
              <img
                src={secondaryItem.image}
                alt={secondaryItem.name}
                className="w-full h-full object-cover object-left"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end text-white">
                <h4 className="font-kanit font-bold text-base sm:text-lg mb-0.5">
                  {secondaryItem.name}
                </h4>
                <p className="font-kanit text-xs text-zinc-300 mb-3">
                  {secondaryItem.location}
                </p>
                <p className="font-kanit font-light text-xs leading-relaxed text-zinc-200/90 line-clamp-3">
                  {secondaryItem.comment}
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="hidden lg:flex items-center gap-3 mt-6 ml-auto mr-12">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Right Column: Featured Large Card */}
        <div className="lg:col-span-7 flex flex-col lg:flex-row items-center lg:items-start gap-8">
          
          {/* Main Active Large Card */}
          <div className="w-full max-w-[600px] relative rounded-xs overflow-hidden shadow-2xl mt-60 ml-12">
            <div className="w-full aspect-[768/850] min-h-[480px] sm:min-h-[600px] lg:min-h-[700px] relative">
              <img
                src={activeItem.image}
                alt={activeItem.name}
                className="w-full h-full object-cover object-left"
              />
              {/* Bottom Overlay text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-55% to-transparent p-8 sm:p-10 flex flex-col justify-end text-white">
                <h3 className="font-kanit font-bold text-xl sm:text-2xl mb-1">
                  {activeItem.name}
                </h3>
                <p className="font-kanit text-sm text-zinc-300 mb-4 font-medium">
                  {activeItem.location}
                </p>
                <p className="font-kanit font-light text-xs sm:text-sm leading-relaxed text-zinc-200/90 max-w-lg">
                  {activeItem.comment}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile / Tablet Arrow Controls */}
          <div className="flex lg:hidden items-center gap-4 mt-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors"
            >
              &gt;
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhatTheySaySection;
