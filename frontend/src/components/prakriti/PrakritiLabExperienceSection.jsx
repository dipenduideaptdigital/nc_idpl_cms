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
  const [isTransitioning, setIsTransitioning] = useState(true);

  const title = data?.title || "PRAKRITI LAB EXPERIENCE";
  const carouselImages = (data?.galleryImages && data.galleryImages.length > 0) ? data.galleryImages : defaultGalleryImages;
  const testimonials = (data?.testimonials && data.testimonials.length > 0) ? data.testimonials : defaultTestimonials;
  const currentTestimonial = testimonials[activeSlide] || testimonials[0];

  const totalImages = carouselImages.length;
  // Extended array with cloned first image at the end for endless forward circular sliding
  const extendedMobileImages = [...carouselImages, carouselImages[0]];

  // Auto-play carousel timer: moves forward every 4 seconds (4000ms)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCarouselOffset((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalImages]);

  // Infinite circular snap-back trick: when reaching the cloned slide, reset offset silently after 700ms transition
  React.useEffect(() => {
    if (carouselOffset === totalImages) {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCarouselOffset(0);
      }, 700);
      return () => clearTimeout(resetTimer);
    }
  }, [carouselOffset, totalImages]);

  const handleNextCarousel = () => {
    setIsTransitioning(true);
    setCarouselOffset((prev) => (prev >= totalImages ? 1 : prev + 1));
  };

  const handlePrevCarousel = () => {
    setIsTransitioning(true);
    if (carouselOffset === 0) {
      setIsTransitioning(false);
      setCarouselOffset(totalImages);
      setTimeout(() => {
        setIsTransitioning(true);
        setCarouselOffset(totalImages - 1);
      }, 20);
    } else {
      setCarouselOffset((prev) => prev - 1);
    }
  };

  const alternateStyles = [
    "transform translate-y-0",
    "transform translate-y-8 sm:translate-y-12 lg:translate-y-16",
    "transform -translate-y-4 sm:-translate-y-6 lg:-translate-y-8"
  ];

  return (
    <section className="relative w-full bg-[#FAFAF7] text-zinc-900 py-16 sm:py-28 lg:py-36 px-4 sm:px-12 lg:px-20 xl:px-24 overflow-hidden select-none font-kanit">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <h2 className="font-kanit font-bold text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] text-[#1E293B] tracking-wider text-center uppercase mb-8 sm:mb-16">
          {title}
        </h2>

        {/* Top Carousel Section */}
        <div className="relative mb-16 sm:mb-28 md:mb-36">
          
          {/* Smaller Screens Carousel (< md): Seamless infinite circular horizontal sliding track */}
          <div className="md:hidden relative w-full flex flex-col items-center justify-center min-h-[240px] sm:min-h-[300px]">
            <div className="w-full max-w-[340px] xs:max-w-[380px] aspect-[4/3] mx-auto rounded-xs overflow-hidden shadow-lg bg-white p-1 border border-zinc-200/60">
              <div 
                className={`flex w-full h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${carouselOffset * 100}%)` }}
              >
                {extendedMobileImages.map((img, idx) => (
                  <div key={idx} className="w-full h-full shrink-0 flex-none">
                    <img
                      src={img?.src ? getAssetUrl(img.src) : ''}
                      alt={img?.title || "Gallery Image"}
                      className="w-full h-full object-cover rounded-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>



          {/* Desktop Carousel (md+): Exact original 3-card staggered layout with ultra-smooth circular image crossfade */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 sm:gap-8 items-start min-h-[300px] sm:min-h-[360px]">
            {[0, 1, 2].map((slotIdx) => (
              <div
                key={slotIdx}
                className={`relative w-full aspect-[4/3] rounded-xs overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 ease-out group bg-white p-1 border border-zinc-200/60 ${alternateStyles[slotIdx]}`}
              >
                <div className="relative w-full h-full overflow-hidden rounded-xs">
                  {carouselImages.map((img, imgIdx) => {
                    const isCardActive = imgIdx === (((carouselOffset % totalImages) + slotIdx) % totalImages);
                    return (
                      <img
                        key={img?.id || imgIdx}
                        src={img?.src ? getAssetUrl(img.src) : ''}
                        alt={img?.title || "Gallery Image"}
                        className={`absolute inset-0 w-full h-full object-cover rounded-xs transition-all duration-1000 ease-in-out group-hover:scale-105 ${
                          isCardActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation Controls (Arrow Buttons & Indicator Dots) */}
          <div className="flex items-center justify-center gap-4 pt-8 sm:pt-12">
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
                  onClick={() => {
                    setIsTransitioning(true);
                    setCarouselOffset(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === (carouselOffset % totalImages)
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