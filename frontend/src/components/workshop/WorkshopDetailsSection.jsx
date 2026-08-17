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
  const detailsDescription = data?.detailsDescription || "<p>At Naturecube, we take students from schools and colleges on extensive field tours to natural surroundings and nature reserves, teaching them about nature, conservation, and ecosystem functions. Using both outdoor environments and our gallery's aquariums and terrariums as models.</p>";

  // SENIOR ENGINEER FIX: Foolproof extraction for Puck CMS array objects
  // This guarantees that React will always receive a valid string, preventing the white screen crash.
  const extractText = (val) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      // Safely extract the target string even if Puck injects hidden _id fields
      return val.item || val.name || val.title || Object.values(val)[0] || "";
    }
    return String(val);
  };

  const defaultOpt1 = [
    "DOOA GLASS POT MARU 95",
    "DOOA JUNGLE SOIL 700ML",
    "DOOA JUNGLE BASE 200ML",
    "DOOA WABI KUSA MIST 200ML",
    "PLANTS & MOSS",
    "WORKSHOP BASIC CHARGE",
    "TERRARIUM HUMIDIFIER BOTTLE",
    "TWEEZER"
  ];

  const option1Title = data?.option1Title || "DOOA GLASS POT MARU 95";
  const rawOpt1 = Array.isArray(data?.option1Items) && data.option1Items.length > 0 ? data.option1Items : defaultOpt1;
  // Apply the secure extraction
  const option1Items = rawOpt1.map(extractText);

  const defaultOpt2 = [
    "EXTRA CLEAR CUSTOM TANK",
    "DOOA JUNGLE SOIL 700ML",
    "DOOA JUNGLE BASE 200ML",
    "DOOA WABI KUSA MIST 200ML",
    "PLANTS & MOSS",
    "WORKSHOP BASIC CHARGE",
    "TERRARIUM HUMIDIFIER BOTTLE",
    "TWEEZER"
  ];

  const option2Title = data?.option2Title || "EXTRA CLEAR CUSTOM TANK";
  const rawOpt2 = Array.isArray(data?.option2Items) && data.option2Items.length > 0 ? data.option2Items : defaultOpt2;
  // Apply the secure extraction
  const option2Items = rawOpt2.map(extractText);

  return (
    <section className="w-full bg-[#FAFAF7] text-zinc-900 py-10 sm:py-16 lg:py-24 px-4 sm:px-8 lg:px-20 xl:px-24 select-none font-kanit">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-kanit font-medium tracking-tight text-zinc-900 uppercase mb-8 sm:mb-12 lg:mb-16">
          {title}
        </h1>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Meta & Pricing Info */}
          <div className="lg:col-span-5 bg-white lg:bg-transparent border border-zinc-200/80 lg:border-0 rounded-2xl lg:rounded-none p-6 sm:p-8 lg:p-0 shadow-xs lg:shadow-none flex flex-col space-y-6 sm:space-y-8 pr-0 lg:pr-6">
            
            {/* Workshop Mentor */}
            <div>
              <p className="text-[#6A6A6A] font-kanit font-medium text-xs xs:text-sm sm:text-lg mb-1 uppercase tracking-wider">
                Workshop Mentor
              </p>
              <p className="text-[#7BA641] font-kanit font-medium text-xl xs:text-2xl sm:text-3xl tracking-wide uppercase">
                {mentor}
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="text-[#6A6A6A] font-kanit font-medium text-xs xs:text-sm sm:text-lg mb-1 uppercase tracking-wider">
                Date
              </p>
              <p className="text-[#0C1A22] font-kanit font-medium text-lg xs:text-xl sm:text-2xl">
                {date}
              </p>
            </div>

            {/* Workshop Fee */}
            <div>
              <p className="text-[#6A6A6A] font-kanit font-medium text-xs xs:text-sm sm:text-lg mb-1 uppercase tracking-wider">
                Workshop Fee
              </p>
              <p className="text-[#0C1A22] font-kanit font-medium text-2xl xs:text-3xl sm:text-4xl tracking-tight">
                {fee}
              </p>
              <p className="text-[#6A6A6A] font-kanit font-normal italic text-xs sm:text-sm mt-1">
                {feeSubtext}
              </p>
            </div>

            {/* Book Now CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleBookNow}
                className="w-[350px]  xs:w-full sm:w-auto bg-[#7BA641] hover:bg-[#6b9337] active:scale-[0.98] lg:active:scale-100 text-white font-kanit font-medium text-base sm:text-lg tracking-wider px-8 py-3.5 rounded-xl lg:rounded-none shadow-md transition-all duration-300 hover:shadow-lg uppercase cursor-pointer text-center"
              >
                {buttonText}
              </button>
            </div>
          </div>

          {/* Right Column: Workshop Details, Highlights & Packages */}
          <div className="lg:col-span-7 flex flex-col space-y-10 sm:space-y-12">
            
            {/* Workshop Details Section */}
            <div>
              <h2 className="text-[#6A6A6A] font-kanit font-medium text-xs sm:text-base tracking-wider uppercase mb-2">
                WORKSHOP DETAILS
              </h2>
              <h3 className="text-[#0C1A22] font-kanit font-medium text-lg sm:text-2xl tracking-tight uppercase leading-snug mb-4">
                {detailsSubtitle}
              </h3>
              
              <div 
                className="text-[#6A6A6A] text-sm sm:text-base leading-relaxed max-w-2xl font-kanit font-normal tiptap-content"
                dangerouslySetInnerHTML={{ __html: detailsDescription }}
              />
            </div>

            {/* Highlights Section */}
            <div>
              <h2 className="text-[#6A6A6A] font-kanit font-medium text-xs sm:text-base tracking-wider uppercase mb-4 sm:mb-6">
                HIGHLIGHTS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-5 lg:gap-0 lg:space-y-6">
                {/* Knowledge Session */}
                <div className="flex items-center sm:flex-col lg:flex-row text-left sm:text-center lg:text-left gap-4 lg:gap-5 p-4 sm:p-5 lg:p-0 bg-white lg:bg-transparent rounded-xl lg:rounded-none border border-zinc-200/60 lg:border-0 shadow-2xs lg:shadow-none transition-all duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0 flex items-center justify-center">
                    <img src={knowledgeIcon} alt="Knowledge Session" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[#0C1A22] font-kanit font-medium text-base sm:text-lg lg:text-xl tracking-wide">Knowledge Session</span>
                </div>

                {/* Demo Session */}
                <div className="flex items-center sm:flex-col lg:flex-row text-left sm:text-center lg:text-left gap-4 lg:gap-5 p-4 sm:p-5 lg:p-0 bg-white lg:bg-transparent rounded-xl lg:rounded-none border border-zinc-200/60 lg:border-0 shadow-2xs lg:shadow-none transition-all duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0 flex items-center justify-center">
                    <img src={demoIcon} alt="Demo Session" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[#0C1A22] font-kanit font-medium text-base sm:text-lg lg:text-xl tracking-wide">Demo Session</span>
                </div>

                {/* Hands-on Experience */}
                <div className="flex items-center sm:flex-col lg:flex-row text-left sm:text-center lg:text-left gap-4 lg:gap-5 p-4 sm:p-5 lg:p-0 bg-white lg:bg-transparent rounded-xl lg:rounded-none border border-zinc-200/60 lg:border-0 shadow-2xs lg:shadow-none transition-all duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0 flex items-center justify-center">
                    <img src={handsIcon} alt="Hands-on-Experience" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[#0C1A22] font-kanit font-medium text-base sm:text-lg lg:text-xl tracking-wide">Hands-on-Experience</span>
                </div>
              </div>
            </div>

            {/* Packages / Options Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2 lg:pt-4">
              {/* Option 01 */}
              <div className="bg-white lg:bg-transparent border border-zinc-200/80 lg:border-0 rounded-2xl lg:rounded-none p-5 sm:p-6 lg:p-0 shadow-xs lg:shadow-none flex flex-col justify-between hover:border-[#7BA641]/50 lg:hover:border-transparent transition-colors duration-300">
                <div>
                  {/* Mobile Badge */}
                  <span className="inline-block lg:hidden text-[#7BA641] bg-[#7BA641]/10 font-kanit font-medium text-[11px] sm:text-xs tracking-wider uppercase px-3 py-1 rounded-md mb-3">
                    OPTION 01
                  </span>
                  {/* Desktop Subtitle */}
                  <p className="hidden lg:block text-[#6A6A6A] font-kanit font-medium text-xs tracking-wider uppercase mb-1">
                    OPTION 01
                  </p>
                  
                  <h4 className="text-[#0C1A22] font-kanit font-medium text-sm sm:text-base tracking-tight uppercase mb-4">
                    {option1Title}
                  </h4>
                  
                  {/* Mobile List with checkmarks */}
                  <ul className="lg:hidden space-y-2 text-[#4A4A4A] text-xs sm:text-sm font-kanit font-normal tracking-wide list-none pl-0">
                    {option1Items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-[#7BA641] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Desktop Original Clean List */}
                  <ul className="hidden lg:block space-y-1.5 text-[#6A6A6A] text-xs sm:text-sm font-kanit font-normal tracking-wide uppercase list-none pl-0">
                    {option1Items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Mobile Footer Note */}
                <span className="lg:hidden text-[#6A6A6A]/80 italic font-kanit font-normal text-[11px] sm:text-xs mt-4 pt-3 border-t border-zinc-100 block">
                  *LIGHT NOT INCLUDED
                </span>

                {/* Desktop Footer Note */}
                <span className="hidden lg:block text-[#6A6A6A]/70 italic font-kanit font-normal text-[11px] sm:text-xs mt-3">
                  *LIGHT NOT INCLUDED
                </span>
              </div>

              {/* Option 02 */}
              <div className="bg-white lg:bg-transparent border border-zinc-200/80 lg:border-0 rounded-2xl lg:rounded-none p-5 sm:p-6 lg:p-0 shadow-xs lg:shadow-none flex flex-col justify-between hover:border-[#7BA641]/50 lg:hover:border-transparent transition-colors duration-300">
                <div>
                  {/* Mobile Badge */}
                  <span className="inline-block lg:hidden text-[#7BA641] bg-[#7BA641]/10 font-kanit font-medium text-[11px] sm:text-xs tracking-wider uppercase px-3 py-1 rounded-md mb-3">
                    OPTION 02
                  </span>
                  {/* Desktop Subtitle */}
                  <p className="hidden lg:block text-[#6A6A6A] font-kanit font-medium text-xs tracking-wider uppercase mb-1">
                    OPTION 02
                  </p>
                  
                  <h4 className="text-[#0C1A22] font-kanit font-medium text-sm sm:text-base tracking-tight uppercase mb-4">
                    {option2Title}
                  </h4>
                  
                  {/* Mobile List with checkmarks */}
                  <ul className="lg:hidden space-y-2 text-[#4A4A4A] text-xs sm:text-sm font-kanit font-normal tracking-wide list-none pl-0">
                    {option2Items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-[#7BA641] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Desktop Original Clean List */}
                  <ul className="hidden lg:block space-y-1.5 text-[#6A6A6A] text-xs sm:text-sm font-kanit font-normal tracking-wide uppercase list-none pl-0">
                    {option2Items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Mobile Footer Note */}
                <span className="lg:hidden text-[#6A6A6A]/80 italic font-kanit font-normal text-[11px] sm:text-xs mt-4 pt-3 border-t border-zinc-100 block">
                  *LIGHT NOT INCLUDED
                </span>

                {/* Desktop Footer Note */}
                <span className="hidden lg:block text-[#6A6A6A]/70 italic font-kanit font-normal text-[11px] sm:text-xs mt-3">
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