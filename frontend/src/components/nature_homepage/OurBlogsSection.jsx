import React from 'react';
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

const stepClasses = ['lg:mt-36', 'lg:mt-24', 'lg:mt-12', 'lg:mt-0'];

const OurBlogsSection = ({ data }) => {
  
  // Dynamic Data Bindings
  const tagline = data?.tagline || "knowledge";
  const mainTitle = data?.mainTitle || "OUR";
  const italicTitle = data?.italicTitle || "blogs";
  const subText = data?.subText || "It is a long established fact that a reader will be distracted.";
  const headline = data?.headline || "It is a long established fact that a reader will be distracted.";
  const cardsToRender = (data?.cards && data.cards.length > 0) ? data.cards : defaultCards;

  return (
    <section className="relative w-full bg-white py-12 sm:py-16 lg:py-20 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
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

          <div 
            className="font-kanit font-light text-lg sm:text-2xl text-[#6A6A6A] leading-relaxed mb-6 pt-4 [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: subText }}
          />

          <div 
            className="font-kanit font-bold text-2xl sm:text-3xl lg:text-[36px] text-zinc-900 leading-snug [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          {cardsToRender.map((card, index) => {
            const cardImg = card.image?.startsWith('http') || card.image?.startsWith('/') 
              ? getAssetUrl(card.image) 
              : card.image;
              
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-5 sm:p-6 border border-zinc-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_36px_rgba(0,0,0,0.12)] ${stepClasses[index] || 'lg:mt-0'}`}
              >
                <div className="w-full h-[200px] sm:h-[220px] lg:h-[230px] rounded-xl overflow-hidden mb-5 bg-zinc-100">
                  <img
                    src={cardImg}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <h3 className="font-kanit font-bold text-lg sm:text-xl text-zinc-900 mb-2.5">
                  {card.title}
                </h3>

                <div 
                  className="font-kanit font-light text-sm sm:text-base text-zinc-600 leading-relaxed [&>p]:m-0"
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