import React from 'react';
import DOMPurify from 'dompurify';
import Reveal from '../../animations/Reveal';
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
  'h-[440px] sm:h-[500px] lg:h-[min(560px,calc(100svh-152px))]',
  'h-[390px] sm:h-[440px] lg:h-[min(520px,calc(100svh-192px))]',
  'h-[340px] sm:h-[380px] lg:h-[min(460px,calc(100svh-232px))]',
];

const PrakritiEducationSection = ({ data }) => {
  const headlineText = data?.headline || "Welcome to Prakriti Lab, our classroom without walls.";
  const descriptionText = data?.description || "<p>At Naturecube, we take students from schools and colleges on extensive field tours to natural surroundings and nature reserves, teaching them about nature, conservation, and ecosystem functions. Using both outdoor environments and our gallery's aquariums and terrariums as models, we expose students to basic scientific techniques and E-STEM teachings that complement their curriculum. Conducted year-round by multidisciplinary teachers, these workshops provide practical, hands-on learning experiences, and students receive certificates upon completion.</p>";

  const cardsToRender = (data?.cards && data.cards.length > 0) ? data.cards : defaultCards;
  const brushBottom = data?.brushBottomImage ? getAssetUrl(data.brushBottomImage) : brush2Img;

  return (
    <>
      <section data-prakriti-step="welcome" data-nav-theme="light" className="relative w-full min-h-[100svh] bg-[#FAFAF7] text-zinc-900 pt-28 pb-10 px-6 sm:px-12 lg:px-20 xl:px-24 flex items-center font-kanit">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 xl:gap-24 items-start">
          <Reveal amount={0.3} duration={1.2} className="md:col-span-6">
            <h2 className="font-kanit font-medium text-3xl sm:text-4xl lg:text-[40px] xl:text-[30px] text-[#6A6A6A] leading-[1.18] tracking-tight max-w-xl">
              {headlineText}
            </h2>
          </Reveal>
          <Reveal amount={0.3} duration={1.2} delay={0.15} className="md:col-span-6 md:pt-2 md:ml-4 lg:ml-10">
            <div
              className="font-kanit text-sm sm:text-base lg:text-[18px] text-[#6A6A6A] font-normal max-w-[420px] tiptap-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(descriptionText) }}
            />
          </Reveal>
        </div>
      </section>

      <section data-prakriti-step="activities" data-nav-theme="light" aria-label="Prakriti Lab activities" className="relative w-full min-h-[100svh] bg-[#FAFAF7] pt-28 pb-10 px-6 sm:px-12 lg:px-20 xl:px-24 overflow-hidden flex items-center font-kanit">
        <div className="absolute -bottom-36 -left-28 sm:-bottom-40 sm:-left-32 md:-bottom-48 md:-left-36 w-[450px] sm:w-[550px] md:w-[600px] aspect-square pointer-events-none">
          <img src={brushBottom} alt="" className="w-full h-full object-contain opacity-90 rotate-12" />
        </div>
        <div className="w-full max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
          {cardsToRender.map((card, index) => {
            const imgSrc = card.image ? getAssetUrl(card.image) : '';
            return (
              <Reveal key={card.id || index} direction="right" amount={0.2} duration={1.2} delay={index * 0.12} className={heightClasses[index % heightClasses.length]} contentClassName="h-full">
                <article className="relative w-full h-full rounded-xs overflow-hidden group shadow-md">
                  {imgSrc && <img src={imgSrc} alt={card.alt || card.title || 'Education Card'} className="w-full h-full object-cover object-center motion-safe:group-hover:scale-105 motion-safe:transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 lg:p-8">
                    <h3 className="font-kanit font-bold text-2xl sm:text-3xl lg:text-[30px] text-white leading-[1.15] tracking-tight whitespace-pre-line">
                      {card.title}
                    </h3>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default PrakritiEducationSection;
