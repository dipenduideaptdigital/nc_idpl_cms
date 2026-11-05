import React, { useState } from 'react';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';
import gallery3 from '../../assets/nc_home/gallery3.png';
import aqua1 from '../../assets/nc_home/aqua1.png';
import aqua2 from '../../assets/nc_home/aqua2.png';
import team1 from '../../assets/nc_home/team1.png';
import PrakritiTestimonialCarousel from './PrakritiTestimonialCarousel';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (/^(https?:|data:|blob:|\/assets\/|\/src\/|\/@fs\/)/.test(path)) return path;
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
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const title = data?.title || "PRAKRITI LAB EXPERIENCE";
  const carouselImages = (data?.galleryImages && data.galleryImages.length > 0) ? data.galleryImages : defaultGalleryImages;
  const testimonials = (data?.testimonials && data.testimonials.length > 0) ? data.testimonials : defaultTestimonials;

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


        <PrakritiTestimonialCarousel testimonials={testimonials} getAssetUrl={getAssetUrl} />
      </div>
    </section>
  );
};

export default PrakritiLabExperienceSection;
