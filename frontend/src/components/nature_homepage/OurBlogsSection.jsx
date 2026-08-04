import React from 'react';

// Fallback Default Images
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

// Keep the step classes static for the UI structure
const stepClasses = ['lg:mt-36', 'lg:mt-24', 'lg:mt-12', 'lg:mt-0'];

const OurBlogsSection = ({ data }) => {
  
  // Dynamic Data Bindings
  const tagline = data?.tagline || "knowledge";
  const mainTitle = data?.mainTitle || "OUR";
  const italicTitle = data?.italicTitle || "blogs";
  const subText = data?.subText || "It is a long established fact that a reader will be distracted.";
  const headline = data?.headline || "It is a long established fact that a reader will be distracted.";
  
  // Use admin cards if available, otherwise use default
  const cardsToRender = (data?.cards && data.cards.length > 0) ? data.cards : defaultCards;

  return (
    <section className="relative w-full bg-white py-20 sm:py-28 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Block */}
        <div className="mb-16 max-w-[400px]">
          {/* Tag */}
          <span className="font-kanit text-[20px] font-medium text-[#7BA641] tracking-wide block lowercase mb-3">
            {tagline}
          </span>

          {/* Section Title */}
          <div className="mb-6 flex items-baseline">
            <span 
              className="font-reem font-bold text-4xl sm:text-5xl lg:text-[64px] text-black leading-[100%] tracking-[0%] uppercase align-middle"
              style={{ fontWeight: 700, verticalAlign: 'middle' }}
            >
              {mainTitle}
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
              {italicTitle}
            </span>
          </div>

          {/* Light Subtext */}
          <div 
            className="font-kanit font-light text-lg sm:text-2xl text-[#6A6A6A] leading-relaxed mb-6 pt-4 [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: subText }}
          />

          {/* Bold Headline */}
          <div 
            className="font-kanit font-bold text-2xl sm:text-3xl lg:text-[36px] text-zinc-900 leading-snug [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
        </div>

        {/* Stepped Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {cardsToRender.map((card, index) => {
            const cardImg = card.image?.startsWith('http') || card.image?.startsWith('/') 
              ? getAssetUrl(card.image) 
              : card.image;
              
            return (
              <div
                key={index}
                className={`bg-white rounded-[10px] p-3.5 sm:p-4 border border-zinc-100 shadow-[4px_4px_14.5px_-3px_#00000026] flex flex-col transition-transform duration-300 hover:-translate-y-1 ${stepClasses[index] || 'lg:mt-0'}`}
                style={{ boxShadow: '4px 4px 14.5px -3px #00000026' }}
              >
                {/* Card Image */}
                <div className="w-full h-[150px] sm:h-[170px] rounded-[6px] overflow-hidden mb-4 bg-zinc-100">
                  <img
                    src={cardImg}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Title */}
                <h3 className="font-kanit font-bold text-base sm:text-lg text-zinc-900 mb-2">
                  {card.title}
                </h3>

                {/* Card Description */}
                <div 
                  className="font-kanit font-light text-xs sm:text-sm text-zinc-500 leading-relaxed [&>p]:m-0"
                  dangerouslySetInnerHTML={{ __html: card.description }}
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default OurBlogsSection;