import React from 'react';
import adaLogo from '../../assets/nc_logo/ada.jpg';
import person2 from '../../assets/nc_about/person2.png';
import naturecubeLogo from '../../assets/nc_logo/naturecube.png';
import singleBush from '../../assets/nc_logo/brush2.png';

const AboutHistoryPanel = ({ data }) => {
  const title = data?.title || "OUR HISTORY";
  const smallText = data?.smallText || "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS WITH LEGENDARY AQUARIST TAKASHI AMANO, INSPIRED BY HIS VISION, WE FOUNDED NATURECUBE IN 2010,";
  const boldText = data?.boldText || "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS";

  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-900 flex-shrink-0 relative flex flex-col justify-center pt-16 sm:pt-20 pb-12 sm:pb-16 px-6 sm:px-12 lg:px-16 z-10 select-none font-kanit overflow-hidden">
      
      {/* Top Left Single Bush Background Decor Image */}
      <div className="absolute -top-16 -left-16 w-[340px] sm:w-[440px] lg:w-[500px] pointer-events-none opacity-40 z-0">
        <img 
          src={singleBush} 
          alt="Background Decor" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Main 4-Column Layout matching design mockup */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 xl:gap-6 items-stretch">
        
        {/* Column 1: Left Narrative Column */}
        <div className="flex flex-col justify-between py-2 pr-2">
          {/* Top: Heading */}
          <div className="mb-6 lg:mb-0 pt-2">
            <h2 className="font-reem-fun text-[#1E293B] font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight uppercase leading-none">
              {title}
            </h2>
          </div>

          {/* Bottom: Narrative Paragraph & Bold Statement */}
          <div className="space-y-4 pt-6">
            <p className="text-[#8492A6] font-normal text-[11px] sm:text-xs leading-relaxed uppercase tracking-wider max-w-xs">
              {smallText}
            </p>

            <p className="text-[#475569] font-extrabold text-sm sm:text-base lg:text-lg leading-snug uppercase tracking-tight max-w-xs">
              {boldText}
            </p>
          </div>
        </div>

        {/* Column 2: Block Col 1 */}
        <div className="flex flex-col space-y-4 xl:space-y-6 justify-between">
          {/* Top: ADA Logo Box */}
          <div className="bg-white p-6 aspect-[1.35/1] flex items-center justify-center border border-zinc-100 shadow-sm rounded-xs">
            <img
              src={adaLogo}
              alt="ADA Aqua Design Amano"
              className="max-h-20 sm:max-h-24 w-auto object-contain"
            />
          </div>

          {/* Bottom: 2008 Dark Navy Box */}
          <div className="bg-[#0b1a1f] text-white p-6 aspect-[1.35/1] flex flex-col justify-center space-y-2 shadow-sm rounded-xs">
            <span className="font-reem-fun font-bold text-3xl sm:text-4xl tracking-tight leading-none text-white">
              2008
            </span>
            <span className="font-reem-fun font-bold text-xs sm:text-sm tracking-wider uppercase text-white leading-tight">
              ADA LAUNCHED IN KOLKATA
            </span>
            <p className="font-normal text-[10px] sm:text-[11px] tracking-wide uppercase text-zinc-300 pt-1 leading-relaxed">
              THE PRODUCTS GET TESTED AND SOME INITIAL LEARNING IS GATHERED.
            </p>
          </div>
        </div>

        {/* Column 3: Block Col 2 */}
        <div className="flex flex-col space-y-4 xl:space-y-6 justify-between">
          {/* Top: Takashi Amano Photo Box */}
          <div className="bg-zinc-900 aspect-[1.35/1] overflow-hidden relative shadow-sm rounded-xs">
            <img
              src={person2}
              alt="Mr. Takashi Amano"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Bottom: 2009 Light Box */}
          <div className="bg-white text-zinc-900 p-6 aspect-[1.35/1] flex flex-col justify-center space-y-2 border border-zinc-100 shadow-sm rounded-xs">
            <span className="font-reem-fun font-bold text-3xl sm:text-4xl tracking-tight leading-none text-zinc-900">
              2009
            </span>
            <span className="font-reem-fun font-bold text-xs sm:text-sm tracking-wider uppercase text-zinc-800 leading-tight">
              MENTOR MR. GAUTAMGUPTA MEETS MR. TAKASHI AMANO
            </span>
            <p className="font-normal text-[10px] sm:text-[11px] text-zinc-500 pt-0.5 leading-relaxed">
              Mr. Gautam Gupta participates in India's first ever Nature Aquarium Seminar.
            </p>
          </div>
        </div>

        {/* Column 4: Block Col 3 */}
        <div className="flex flex-col space-y-4 xl:space-y-6 justify-between">
          {/* Top: 2010 Dark Navy Box */}
          <div className="bg-[#0b1a1f] text-white p-6 aspect-[1.35/1] flex flex-col justify-center space-y-2 shadow-sm rounded-xs">
            <span className="font-reem-fun font-bold text-3xl sm:text-4xl tracking-tight leading-none text-white">
              2010
            </span>
            <span className="font-reem-fun font-bold text-xs sm:text-sm tracking-wider uppercase text-white leading-tight">
              OUR JOURNEY STARTED
            </span>
          </div>

          {/* Bottom: NatureCube Logo Box */}
          <div className="bg-white p-6 aspect-[1.35/1] flex items-center justify-center border border-zinc-100 shadow-sm rounded-xs">
            <img
              src={naturecubeLogo}
              alt="NatureCube Living Art Under Water"
              className="max-h-20 sm:max-h-24 w-auto object-contain"
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default AboutHistoryPanel;