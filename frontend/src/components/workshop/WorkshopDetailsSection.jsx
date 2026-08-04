import React from 'react';
import knowledgeIcon from '../../assets/nc_logo/knowledge.png';
import demoIcon from '../../assets/nc_logo/demo.png';
import handsIcon from '../../assets/nc_logo/hands.png';

const WorkshopDetailsSection = ({ data }) => {
  const handleBookNow = () => {
    window.dispatchEvent(new CustomEvent('open-consultation-modal'));
  };

  const title = data?.title || "TERRARIUM WORKSHOP";
  const mentor = data?.mentor || "GAUTAM GUPTA";
  const date = data?.date || "22nd March, 2026";
  const fee = data?.fee || "₹ 8500.00";
  const feeSubtext = data?.feeSubtext || "inclusive of all taxes";
  const buttonText = data?.buttonText || "BOOK NOW";

  const detailsSubtitle = data?.detailsSubtitle || "AN ALL-INCLUSIVE WORKSHOP EXPERIENCE";
  const detailsDescription = data?.detailsDescription || "At Naturecube, we take students from schools and colleges on extensive field tours to natural surroundings and nature reserves, teaching them about nature, conservation, and ecosystem functions. Using both outdoor environments and our gallery’s aquariums and terrariums as models.";

  const option1Title = data?.option1Title || "DOOA GLASS POT MARU 95";
  const option1Items = data?.option1Items || [
    "DOOA GLASS POT MARU 95",
    "DOOA JUNGLE SOIL 700ML",
    "DOOA JUNGLE BASE 200ML",
    "DOOA WABI KUSA MIST 200ML",
    "PLANTS & MOSS",
    "WORKSHOP BASIC CHARGE",
    "TERRARIUM HUMIDIFIER BOTTLE",
    "TWEEZER"
  ];

  const option2Title = data?.option2Title || "EXTRA CLEAR CUSTOM TANK";
  const option2Items = data?.option2Items || [
    "EXTRA CLEAR CUSTOM TANK",
    "DOOA JUNGLE SOIL 700ML",
    "DOOA JUNGLE BASE 200ML",
    "DOOA WABI KUSA MIST 200ML",
    "PLANTS & MOSS",
    "WORKSHOP BASIC CHARGE",
    "TERRARIUM HUMIDIFIER BOTTLE",
    "TWEEZER"
  ];

  return (
    <section className="w-full bg-[#FAFAF7] text-zinc-900 py-16 sm:py-24 px-6 sm:px-12 lg:px-20 xl:px-24 select-none font-kanit">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 uppercase mb-12 sm:mb-16">
          {title}
        </h1>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Meta & Pricing Info */}
          <div className="lg:col-span-5 flex flex-col space-y-8 pr-0 lg:pr-6">
            
            {/* Workshop Mentor */}
            <div>
              <p className="text-[#6A6A6A] font-semibold text-base sm:text-lg mb-1">
                Workshop Mentor
              </p>
              <p className="text-[#7BA641] font-bold text-2xl sm:text-3xl tracking-wide uppercase">
                {mentor}
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="text-[#6A6A6A] font-semibold text-base sm:text-lg mb-1">
                Date
              </p>
              <p className="text-[#0C1A22] font-bold text-xl sm:text-2xl">
                {date}
              </p>
            </div>

            {/* Workshop Fee */}
            <div>
              <p className="text-[#6A6A6A] font-semibold text-base sm:text-lg mb-1">
                Workshop Fee
              </p>
              <p className="text-[#0C1A22] font-extrabold text-3xl sm:text-4xl tracking-tight">
                {fee}
              </p>
              <p className="text-[#6A6A6A] italic text-sm mt-1">
                {feeSubtext}
              </p>
            </div>

            {/* Book Now CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleBookNow}
                className="bg-[#7BA641] hover:bg-[#6b9337] text-white font-bold text-base sm:text-lg tracking-wider px-8 py-3.5 rounded-none shadow-md transition-all duration-300 hover:shadow-lg uppercase cursor-pointer"
              >
                {buttonText}
              </button>
            </div>

          </div>

          {/* Right Column: Workshop Details, Highlights & Packages */}
          <div className="lg:col-span-7 flex flex-col space-y-12">
            
            {/* Workshop Details Section */}
            <div>
              <h2 className="text-[#6A6A6A] font-bold text-sm sm:text-base tracking-wider uppercase mb-2">
                WORKSHOP DETAILS
              </h2>
              <h3 className="text-[#0C1A22] font-bold text-xl sm:text-2xl tracking-tight uppercase leading-snug mb-4">
                {detailsSubtitle}
              </h3>
              <p className="text-[#6A6A6A] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                {detailsDescription}
              </p>
            </div>

            {/* Highlights Section */}
            <div>
              <h2 className="text-[#6A6A6A] font-bold text-sm sm:text-base tracking-wider uppercase mb-6">
                HIGHLIGHTS
              </h2>

              <div className="space-y-6">
                {/* Highlight 1: Knowledge Session */}
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={knowledgeIcon}
                      alt="Knowledge Session"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[#0C1A22] font-bold text-lg sm:text-xl tracking-wide">
                    Knowledge Session
                  </span>
                </div>

                {/* Highlight 2: Demo Session */}
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={demoIcon}
                      alt="Demo Session"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[#0C1A22] font-bold text-lg sm:text-xl tracking-wide">
                    Demo Session
                  </span>
                </div>

                {/* Highlight 3: Hands-on-Experience */}
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={handsIcon}
                      alt="Hands-on-Experience"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[#0C1A22] font-bold text-lg sm:text-xl tracking-wide">
                    Hands-on-Experience
                  </span>
                </div>
              </div>
            </div>

            {/* Packages / Options Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              
              {/* Option 01 */}
              <div>
                <p className="text-[#6A6A6A] font-semibold text-xs tracking-wider uppercase mb-1">
                  OPTION 01
                </p>
                <h4 className="text-[#0C1A22] font-bold text-sm sm:text-base tracking-tight uppercase mb-4">
                  {option1Title}
                </h4>
                <ul className="space-y-1.5 text-[#6A6A6A] text-xs sm:text-sm font-medium tracking-wide uppercase">
                  {option1Items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <span className="text-[#6A6A6A]/70 italic text-[11px] sm:text-xs mt-3 block">
                  *LIGHT NOT INCLUDED
                </span>
              </div>

              {/* Option 02 */}
              <div>
                <p className="text-[#6A6A6A] font-semibold text-xs tracking-wider uppercase mb-1">
                  OPTION 02
                </p>
                <h4 className="text-[#0C1A22] font-bold text-sm sm:text-base tracking-tight uppercase mb-4">
                  {option2Title}
                </h4>
                <ul className="space-y-1.5 text-[#6A6A6A] text-xs sm:text-sm font-medium tracking-wide uppercase">
                  {option2Items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <span className="text-[#6A6A6A]/70 italic text-[11px] sm:text-xs mt-3 block">
                  *LIGHT NOT INCLUDED
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default WorkshopDetailsSection;