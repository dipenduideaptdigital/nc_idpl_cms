import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import Reveal from '../../animations/Reveal';
import card1Img from '../../assets/nc_home/card1.png';
import card2Img from '../../assets/nc_home/card2.png';
import card3Img from '../../assets/nc_home/card3.png';
import card4Img from '../../assets/nc_home/card4.png';

// Helper to resolve the correct image URL from your backend
const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const defaultCards = [
  { title: '01. Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: card1Img },
  { title: '02. Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: card2Img },
  { title: '03. Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: card3Img },
  { title: '04. Project Handover', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: card4Img },
];

const stepClasses = ['lg:mt-45', 'lg:mt-30', 'lg:mt-15', 'lg:mt-0'];

const OurBlogsSection = ({ data }) => {
  const sectionTriggerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const updateLayout = () => setIsDesktop(media.matches);
    media.addEventListener('change', updateLayout);
    return () => media.removeEventListener('change', updateLayout);
  }, []);

  // Dynamic Data Bindings
  const tagline = data?.tagline || "knowledge";
  const mainTitle = data?.mainTitle || "OUR";
  const italicTitle = data?.italicTitle || "blogs";
  const subText = data?.subText || "It is a long established fact that a reader will be distracted.";
  const headline = data?.headline || "It is a long established fact that a reader will be distracted.";
  const cardsToRender = (data?.cards && data.cards.length > 0) ? data.cards : defaultCards;
  if (data?.isVisible === false) return null;
  return (
    <section className="relative w-full bg-white py-8 sm:py-12 lg:py-10 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      {/* Cap the stationary trigger on short screens so 50% is always reachable. */}
      <div ref={sectionTriggerRef} aria-hidden="true" className="absolute inset-0 max-h-[150svh] pointer-events-none" />
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Block */}
        <Reveal amount={0.3} triggerRef={isDesktop ? sectionTriggerRef : undefined} className="max-w-[400px]">
          {/* Tag */}
          <span className="font-kanit text-[18px] sm:text-[20px] font-medium text-[#7BA641] tracking-wide block lowercase mb-2">
            {tagline}
          </span>

          {/* Section Title */}
          <h2 className="mb-4 flex items-baseline">
            <span 
              className="font-reem font-bold text-3xl sm:text-4xl lg:text-[48px] text-black leading-[100%] tracking-[0%] uppercase align-middle"
              style={{ fontWeight: 700, verticalAlign: 'middle' }}
            >
              {mainTitle}
            </span>
            <span 
              className="font-reem font-bold text-3xl sm:text-4xl lg:text-[48px] leading-[100%] tracking-[0%] align-middle"
              style={{ fontWeight: 700, verticalAlign: 'middle' }}
            >
              &nbsp;
            </span>
            <span 
              className="font-larken font-normal italic text-4xl sm:text-6xl lg:text-[64px] text-[#6CA844] leading-[100%] tracking-[0%] lowercase align-middle"
              style={{ fontWeight: 700, verticalAlign: 'middle' }}
            >
              {italicTitle}
            </span>
          </h2>

          <div 
            className="font-kanit font-light text-base sm:text-xl text-[#6A6A6A] leading-relaxed mb-4 pt-2 [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subText) }}
          />

          <div 
            className="font-kanit font-medium text-xl sm:text-2xl lg:text-[28px] text-zinc-900 leading-snug [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(headline) }}
          />
        </Reveal>

        {/* Restore the reference's staircase, lifting the row to keep the intro gap compact. */}
        <div className="mt-6 lg:-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {cardsToRender.map((card, index) => {
            const cardImg = typeof card.image === 'string' ? getAssetUrl(card.image) : card.image;
              
            return (
              <Reveal
                key={index}
                amount={0.5}
                triggerRef={isDesktop ? sectionTriggerRef : undefined}
                duration={1.6}
                delay={isDesktop ? index * 0.25 : 0}
                className={`p-3 -mx-3 ${stepClasses[index] || 'lg:mt-0'}`}
              >
                <div className="bg-white p-5 sm:p-3 lg:min-h-[336px] border border-zinc-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex flex-col motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-2">
                  <div className="w-full h-[150px] sm:h-[180px] lg:h-[180px] overflow-hidden mb-4 bg-zinc-100">
                    <img
                      src={cardImg}
                      alt={card.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:scale-105"
                    />
                  </div>

                  <h3 className="font-reem-fun font-bold text-lg sm:text-xl text-zinc-900 mb-2.5 px-4">
                    {card.title}
                  </h3>

                  <div
                    className="font-kanit font-light text-sm sm:text-base text-zinc-900 leading-relaxed [&>p]:m-0 px-4"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card.description || '') }}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default OurBlogsSection;
