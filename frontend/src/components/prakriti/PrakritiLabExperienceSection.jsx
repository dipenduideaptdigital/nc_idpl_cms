import React, { useState } from 'react';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';
import gallery3 from '../../assets/nc_home/gallery3.png';
import aqua1 from '../../assets/nc_home/aqua1.png';
import aqua2 from '../../assets/nc_home/aqua2.png';
import team1 from '../../assets/nc_home/team1.png';
import bush3 from '../../assets/nc_logo/bush3.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const defaultGalleryImages = [
  { id: 1, src: gallery1, title: "Nature Aquarium Tank 1" },
  { id: 2, src: gallery2, title: "Aquascape Terrarium 2" },
  { id: 3, src: gallery3, title: "Bio-Cube Installation 3" },
  { id: 4, src: aqua1, title: "Aquatic Ecosystem 4" },
  { id: 5, src: aqua2, title: "Living Landscape 5" },
];

const defaultTestimonials = [
  {
    id: 1,
    name: "Ayushman\nGhosh",
    location: "KOLKATA",
    batch: "Batch of Feb'26",
    image: team1,
    text: ", we take students from schools and cAt Naturecubeolleges on extensive field tours to natural surroundings and nature reserves, teaching them about nature, conservation, and ecosystem functions."
  },
  {
    id: 2,
    name: "Subham\nDas",
    location: "HOWRAH",
    batch: "Batch of Mar'26",
    image: team1,
    text: "Our gallery's aquariums and terrariums as models expose students to basic scientific techniques and E-STEM teachings that complement their curriculum seamlessly."
  },
  {
    id: 3,
    name: "Rohan\nSen",
    location: "KOLKATA",
    batch: "Batch of Apr'26",
    image: team1,
    text: "Conducted year-round by multidisciplinary teachers, these workshops provide practical, hands-on learning experiences, and students receive certificates upon completion."
  }
];

const PrakritiLabExperienceSection = ({ data }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselOffset, setCarouselOffset] = useState(0);

  const title = data?.title || "PRAKRITI LAB EXPERIENCE";
  const carouselImages = (data?.galleryImages && data.galleryImages.length > 0) ? data.galleryImages : defaultGalleryImages;
  const testimonials = (data?.testimonials && data.testimonials.length > 0) ? data.testimonials : defaultTestimonials;
  const currentTestimonial = testimonials[activeSlide] || testimonials[0];

  const handleNextCarousel = () => {
    setCarouselOffset((prev) => (prev + 1) % carouselImages.length);
  };
  const handlePrevCarousel = () => {
    setCarouselOffset((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const visibleCards = [
    carouselImages[carouselOffset % carouselImages.length],
    carouselImages[(carouselOffset + 1) % carouselImages.length],
    carouselImages[(carouselOffset + 2) % carouselImages.length],
  ];

  const alternateStyles = [
    "transform translate-y-0",
    "transform translate-y-8 sm:translate-y-12 lg:translate-y-16",
    "transform -translate-y-4 sm:-translate-y-6 lg:-translate-y-8"
  ];

  return (
    <section className="relative w-full bg-[#FAFAF7] text-zinc-900 py-20 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-20 xl:px-24 overflow-hidden select-none font-kanit">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <h2 className="font-kanit font-bold text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] text-[#1E293B] tracking-wider text-center uppercase mb-12 sm:mb-16">
          {title}
        </h2>

        {/* Top Carousel with Alternate Staggered Style */}
        <div className="relative mb-28 sm:mb-36">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start min-h-[300px] sm:min-h-[360px]">
            {visibleCards.map((img, idx) => (
              <div
                key={`${img?.id}-${idx}`}
                className={`relative w-full aspect-[4/3] rounded-xs overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 ease-out group bg-white p-1 border border-zinc-200/60 ${alternateStyles[idx]}`}
              >
                <img
                  src={img?.src ? getAssetUrl(img.src) : ''}
                  alt={img?.title || "Gallery Image"}
                  className="w-full h-full object-cover rounded-xs group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 pt-12">
            <button
              onClick={handlePrevCarousel}
              aria-label="Previous Carousel Slide"
              className="w-10 h-10 rounded-full bg-white text-zinc-800 border border-zinc-200 shadow-md flex items-center justify-center hover:bg-[#7BA641] hover:text-white transition-colors cursor-pointer text-lg font-bold"
            >
              &larr;
            </button>
            <div className="flex items-center gap-2">
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselOffset(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === (carouselOffset % carouselImages.length)
                      ? 'bg-[#7BA641] w-6'
                      : 'bg-zinc-300 hover:bg-zinc-400'
                    }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextCarousel}
              aria-label="Next Carousel Slide"
              className="w-10 h-10 rounded-full bg-white text-zinc-800 border border-zinc-200 shadow-md flex items-center justify-center hover:bg-[#7BA641] hover:text-white transition-colors cursor-pointer text-lg font-bold"
            >
              &rarr;
            </button>
          </div>
        </div>

        {/* Bottom Spotlight Experience Card */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div className="bg-white p-4 sm:p-5 rounded-xs shadow-2xl border border-zinc-200/80 w-full max-w-[420px]">
              <div className="w-full aspect-[4/3] sm:aspect-square overflow-hidden rounded-xs bg-zinc-100 mb-3">
                <img
                  src={currentTestimonial?.image ? getAssetUrl(currentTestimonial.image) : ''}
                  alt={currentTestimonial?.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="font-caveat text-xl sm:text-2xl text-zinc-800 font-medium tracking-wide block px-1">
                {currentTestimonial?.batch}
              </span>
            </div>
          </div>

          {/* Right Column: Name, Description & Numeric Page Controls */}
          <div className="lg:col-span-6 relative flex flex-col justify-between space-y-6 pt-4 lg:pt-0">
            {/* Top-Left Paint Splash Accent (bush3) */}
            <div className="absolute -top-16 -left-12 sm:-top-20 sm:-left-16 w-[320px] sm:w-[400px] aspect-square pointer-events-none z-0">
              <img
                src={bush3}
                alt=""
                className="w-full h-full object-contain object-left-top opacity-50 filter brightness-105"
              />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <h3 className="font-kanit font-bold text-3xl sm:text-4xl text-[#1E293B] leading-tight whitespace-pre-line">
                  {currentTestimonial?.name}
                </h3>
                <span className="font-kanit text-xs font-semibold tracking-widest text-[#555555] uppercase block pt-1">
                  {currentTestimonial?.location}
                </span>
              </div>
              
              <div 
                className="font-sans text-sm sm:text-base text-zinc-500 font-normal leading-relaxed max-w-md tiptap-content"
                dangerouslySetInnerHTML={{ __html: currentTestimonial?.text || '' }}
              />
            </div>

            {/* Bottom-Right Number Indicators */}
            <div className="flex flex-col items-end gap-1 font-serif text-sm font-semibold tracking-widest pt-6 self-end">
              {testimonials.map((_, idx) => {
                const numStr = String(idx + 1).padStart(2, '0');
                const isActive = idx === activeSlide;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`transition-all duration-300 italic cursor-pointer ${isActive
                        ? 'text-[#7BA641] font-bold text-base scale-110'
                        : 'text-zinc-400 hover:text-zinc-600 text-sm'
                      }`}
                  >
                    {numStr}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrakritiLabExperienceSection;