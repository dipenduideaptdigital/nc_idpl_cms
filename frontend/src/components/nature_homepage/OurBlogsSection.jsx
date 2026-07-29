import React from 'react';

// Card Images from nc_home
import card1Img from '../../assets/nc_home/card1.png';
import card2Img from '../../assets/nc_home/card2.png';
import card3Img from '../../assets/nc_home/card3.png';
import card4Img from '../../assets/nc_home/card4.png';

const OurBlogsSection = () => {
  const blogCards = [
    {
      id: '01',
      title: '01. Initial Consultation',
      description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
      image: card1Img,
      stepClass: 'lg:mt-36', // Lowest step
    },
    {
      id: '02',
      title: '02. Design & Planning',
      description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
      image: card2Img,
      stepClass: 'lg:mt-24',
    },
    {
      id: '03',
      title: '03. Implementation',
      description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
      image: card3Img,
      stepClass: 'lg:mt-12',
    },
    {
      id: '04',
      title: '04. Project Handover',
      description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
      image: card4Img,
      stepClass: 'lg:mt-0', // Highest step
    },
  ];

  return (
    <section className="relative w-full bg-white py-20 sm:py-28 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Block */}
        <div className="mb-16 max-w-[400px]">
          {/* Tag */}
          <span className="font-kanit text-[20px] font-medium text-[#7BA641] tracking-wide block lowercase mb-3">
            knowledge
          </span>

          {/* Section Title: OUR blogs */}
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
              blogs
            </span>
          </div>

          {/* Light Subtext */}
          <p className="font-kanit font-light text-lg sm:text-2xl text-[#6A6A6A] leading-relaxed mb-6 pt-4">
            It is a long established fact that a reader will be distracted.
          </p>

          {/* Bold Headline */}
          <h2 className="font-kanit font-bold text-2xl sm:text-3xl lg:text-[36px] text-zinc-900 leading-snug">
            It is a long established fact that a reader will be distracted.
          </h2>
        </div>

        {/* Stepped Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {blogCards.map((card) => (
            <div
              key={card.id}
              className={`bg-white rounded-[10px] p-3.5 sm:p-4 border border-zinc-100 shadow-[4px_4px_14.5px_-3px_#00000026] flex flex-col transition-transform duration-300 hover:-translate-y-1 ${card.stepClass}`}
              style={{ boxShadow: '4px 4px 14.5px -3px #00000026' }}
            >
              {/* Card Image */}
              <div className="w-full h-[150px] sm:h-[170px] rounded-[6px] overflow-hidden mb-4 bg-zinc-100">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Title */}
              <h3 className="font-kanit font-bold text-base sm:text-lg text-zinc-900 mb-2">
                {card.title}
              </h3>

              {/* Card Description */}
              <p className="font-kanit font-light text-xs sm:text-sm text-zinc-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurBlogsSection;
