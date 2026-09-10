import React from 'react';
import leafTexture from '../../assets/nc_logo/Leaf.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutJourneyPanel = ({ data }) => {
  const heading = data?.heading || "BORN FROM A CHILDHOOD FASCINATION WITH LOCAL WATERBODIES, NATURECUBE BEGAN AS A PASSION PROJECT ALMOST 40 YEARS AGO.";
  const paragraph1 = data?.paragraph1 || "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS WITH LEGENDARY AQUARIST TAKASHI AMANO. INSPIRED BY HIS VISION, WE FOUNDED NATURECUBE IN 2010, DEDICATED TO REINTRODUCING URBAN DWELLERS TO THE WONDERS OF NATURE THROUGH BEAUTIFULLY DESIGNED AQUASCAPES.";
  const paragraph2 = data?.paragraph2 || "WITH A COMMITMENT TO ETHICAL BUSINESS PRACTICES AND KEEPING ENVIRONMENTAL SUSTAINABILITY AT THE CORE, WE PARTNER WITH BEST IN CLASS TECHNOLOGY PROVIDERS TO OFFER THE BEST AQUARIUM, TERRARIUM, NATURE CONNECT PROGRAMS, WORKSHOPS, AND ALSO INNOVATIVE INDOOR GARDENING SOLUTIONS TO OUR CUSTOMERS.";

  return (
    <div className="w-[78vw] min-w-[78vw] h-full bg-[#0a1f1c] text-white flex-shrink-0 relative flex flex-col justify-between pt-20 sm:pt-24 pb-12 sm:pb-16 px-6 sm:px-10 lg:px-14 z-10 select-none font-kanit">

      {/* Dark Tropical Leaf Background Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 bg-cover bg-center"
        style={{
          backgroundImage: `url(${data?.bgImage ? resolveAssetUrl(data.bgImage) : leafTexture})`,
        }}
      />

      {/* Dark Vignette Overlay for Depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 60% 50%, rgba(15, 45, 40, 0.4) 0%, rgba(7, 22, 20, 0.9) 100%)'
        }}
      />



      {/* Story Text Container - Squeezed width matching design */}
      <div className="relative z-20 max-w-xl lg:max-w-[620px] my-auto space-y-5 sm:space-y-6 ml-[18vw] sm:ml-[22vw] lg:ml-[25vw] pr-6 lg:pr-12">

        {/* Main Headline */}
        <h2 className="font-reem-fun text-white font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight leading-snug uppercase">
          {heading}
        </h2>

        {/* Paragraph 1 */}
        <div
          className="font-kanit font-normal text-zinc-200 text-xs sm:text-sm lg:text-base leading-relaxed tracking-wide uppercase [&>p]:mb-0"
          dangerouslySetInnerHTML={{ __html: paragraph1 }}
        />

        {/* Paragraph 2 */}
        <div
          className="font-kanit font-normal text-zinc-200 text-xs sm:text-sm lg:text-base leading-relaxed tracking-wide uppercase [&>p]:mb-0"
          dangerouslySetInnerHTML={{ __html: paragraph2 }}
        />

      </div>

      {/* Spacer */}
      <div className="relative z-20 h-4" />

    </div>
  );
};

export default AboutJourneyPanel;