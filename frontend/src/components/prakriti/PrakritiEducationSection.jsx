import React from 'react';
import plab1 from '../../assets/nc_home/plab1.png';
import plab2 from '../../assets/nc_home/plab2.png';
import plab3 from '../../assets/nc_home/card4.png';
import brush2Img from '../../assets/nc_logo/brush2.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  
  if (typeof path === 'object' && path.url) {
    return getAssetUrl(path.url);
  }
  
  if (typeof path !== 'string') return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  if (path.startsWith('/src/') || path.startsWith('/assets/') || path.startsWith('/@fs/')) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
    
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

const defaultCards = [
  {
    id: 1,
    title: "Field Trips",
    image: plab3,
    alt: "Field Trips with Students",
    heightClass: "h-[440px] sm:h-[500px] lg:h-[540px] xl:h-[560px]"
  },
  {
    id: 2,
    title: "Community\nInteraction",
    image: plab1,
    alt: "Community Interaction in Nature",
    heightClass: "h-[390px] sm:h-[440px] lg:h-[470px] xl:h-[520px]"
  },
  {
    id: 3,
    title: "Expert-Led\nNature Workshops",
    image: plab2,
    alt: "Expert-Led Nature Workshops",
    heightClass: "h-[340px] sm:h-[380px] lg:h-[400px] xl:h-[460px]"
  }
];

const heightClasses = [
  "h-[440px] sm:h-[500px] lg:h-[540px] xl:h-[560px]",
  "h-[390px] sm:h-[440px] lg:h-[470px] xl:h-[520px]",
  "h-[340px] sm:h-[380px] lg:h-[400px] xl:h-[460px]"
];

const PrakritiEducationSection = ({ data }) => {
  const headlineText = data?.headline || "It is a long established fact that a reader will be distracted.";
  const descriptionText = data?.description || "<p>At Naturecube, we take students from schools and colleges on extensive field tours to natural surroundings and nature reserves, teaching them about nature, conservation, and ecosystem functions. Using both outdoor environments and our gallery's aquariums and terrariums as models, we expose students to basic scientific techniques and E-STEM teachings that complement their curriculum. Conducted year-round by multidisciplinary teachers, these workshops provide practical, hands-on learning experiences, and students receive certificates upon completion.</p>";

  const cardsToRender = (data?.cards && data.cards.length > 0) ? data.cards : defaultCards;
  const brushBottom = data?.brushBottomImage ? getAssetUrl(data.brushBottomImage) : brush2Img;

  return (
    <section className="relative w-full bg-[#FAFAF7] text-zinc-900 py-24 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-20 xl:px-24 overflow-hidden select-none font-kanit">
      
      {/* Bottom-Left Watercolor Brush Accent */}
      <div className="absolute -bottom-36 -left-28 sm:-bottom-40 sm:-left-32 md:-bottom-48 md:-left-36 w-[450px] sm:w-[550px] md:w-[600px] aspect-square pointer-events-none z-0">
        <img 
          src={brushBottom} 
          alt="" 
          className="w-full h-full object-contain object-left-bottom opacity-90 filter brightness-105 transform rotate-12"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24 items-start mb-20 sm:mb-24 lg:mb-28">
          <div className="lg:col-span-6">
            <h2 className="font-kanit font-bold text-3xl sm:text-4xl lg:text-[42px] xl:text-[40px] text-[#6A6A6A] leading-[1.18] tracking-tight max-w-xl">
              {headlineText}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-2 ml-0 lg:ml-10">
            <div 
              className="font-sans text-sm sm:text-base lg:text-[18px] text-[#6A6A6A] font-normal leading-[1.8] max-w-[420px] tiptap-content"
              dangerouslySetInnerHTML={{ __html: descriptionText }}
            />
          </div>
        </div>

        {/* Bottom 3 Cards Grid - Staggered Heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
          {cardsToRender.map((card, index) => {
            const cardHeight = card.heightClass || heightClasses[index % heightClasses.length];
            const imgSrc = card.image ? getAssetUrl(card.image) : '';

            return (
              <div 
                key={card.id || index} 
                className={`relative w-full ${cardHeight} rounded-xs overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-500`}
              >
                {/* Background Card Image */}
                {imgSrc && (
                  <img 
                    src={imgSrc} 
                    alt={card.alt || card.title || 'Education Card'} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300" />
                
                {/* Text Title Overlay at Bottom-Left */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 lg:p-8 z-10">
                  <h3 className="font-kanit font-bold text-2xl sm:text-3xl lg:text-[30px] text-white leading-[1.15] tracking-tight whitespace-pre-line group-hover:translate-x-1 transition-transform duration-300">
                    {card.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PrakritiEducationSection;