import React from 'react';
import leafTexture from '../../assets/nc_logo/Leaf.png';

const AboutJourneyPanel = ({ data }) => {
  const heading = data?.heading || "BORN FROM A CHILDHOOD FASCINATION WITH LOCAL WATERBODIES, NATURECUBE BEGAN AS A PASSION PROJECT ALMOST 40 YEARS AGO.";
  const paragraph1 = data?.paragraph1 || "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS WITH LEGENDARY AQUARIST TAKASHI AMANO. INSPIRED BY HIS VISION, WE FOUNDED NATURECUBE IN 2010, DEDICATED TO REINTRODUCING URBAN DWELLERS TO THE WONDERS OF NATURE THROUGH BEAUTIFULLY DESIGNED AQUASCAPES.";
  const paragraph2 = data?.paragraph2 || "WITH A COMMITMENT TO ETHICAL BUSINESS PRACTICES AND KEEPING ENVIRONMENTAL SUSTAINABILITY AT THE CORE, WE PARTNER WITH BEST IN CLASS TECHNOLOGY PROVIDERS TO OFFER THE BEST AQUARIUM, TERRARIUM, NATURE CONNECT PROGRAMS, WORKSHOPS, AND ALSO INNOVATIVE INDOOR GARDENING SOLUTIONS TO OUR CUSTOMERS.";

  return (
    <div className="w-screen min-w-[100vw] h-full bg-[#0a1f1c] text-white flex-shrink-0 relative flex flex-col justify-between pt-24 sm:pt-28 pb-12 sm:pb-16 px-6 sm:px-12 lg:px-20 z-10 select-none font-kanit">
      
      {/* Dark Tropical Leaf Background Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(${leafTexture})`,
          backgroundBlendMode: 'overlay'
        }}
      />

      {/* Dark Vignette Overlay for Depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 60% 50%, rgba(15, 45, 40, 0.4) 0%, rgba(7, 22, 20, 0.9) 100%)'
        }}
      />

      {/* Top Left STORE Indicator */}
      <div className="relative z-20  ">
        <a
          href="#store"
          className="inline-flex items-center justify-center bg-[#7BA641] hover:bg-[#6b9337] text-white font-medium text-xs tracking-[0.18em] px-10 py-2.5 rounded-sm shadow-md transition-all uppercase"
        >
          STORE
        </a>
      </div>

      {/* Right Column Story Text */}
      <div className="relative z-20 max-w-3xl my-auto space-y-6 sm:space-y-8 pl-0 lg:pl-16 self-end">
        
        {/* Main Headline */}
        <h2 className="font-reem-fun text-white font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight leading-snug uppercase">
          {heading}
        </h2>

        {/* Paragraph 1 */}
        <p className="text-zinc-200 font-normal text-xs sm:text-sm lg:text-base leading-relaxed tracking-wide uppercase">
          {paragraph1}
        </p>

        {/* Paragraph 2 */}
        <p className="text-zinc-200 font-normal text-xs sm:text-sm lg:text-base leading-relaxed tracking-wide uppercase">
          {paragraph2}
        </p>

      </div>

      {/* Spacer */}
      <div className="relative z-20 h-4" />

    </div>
  );
};

export default AboutJourneyPanel;