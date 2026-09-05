import React from 'react';
import adaLogo from '../../assets/nc_logo/ada.jpg';
import person2 from '../../assets/nc_about/person2.png';
import naturecubeLogo from '../../assets/nc_logo/naturecube.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutHistoryPanel = ({ data }) => {
  const title = data?.title || "OUR HISTORY";
  const image1 = data?.image1 ? resolveAssetUrl(data.image1) : adaLogo;
  const image2 = data?.image2 ? resolveAssetUrl(data.image2) : person2;
  const smallText = data?.smallText || "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS WITH LEGENDARY AQUARIST TAKASHI AMANO, INSPIRED BY HIS VISION, WE FOUNDED NATURECUBE IN 2010,";
  const boldText = data?.boldText || "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS";

  return (
    <div className="w-auto flex-shrink-0 h-full bg-white text-zinc-900 relative flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 pl-4 sm:pl-8 lg:pl-12 pr-0 z-10 select-none font-kanit overflow-hidden">

      <div className="relative z-10 flex flex-row items-center my-auto font-kanit">

        {/* Column 1: Header & Left Description */}
        <div className="w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0 flex flex-col justify-between py-2 pr-6 lg:pr-10 font-reem font-normal">
          <div className="mb-6 lg:mb-40 pt-2">
            <h2 className="font-reem font-bold text-[#1E293B] text-3xl sm:text-4xl lg:text-5xl tracking-tight uppercase leading-none whitespace-nowrap">
              {title}
            </h2>
          </div>

          <div className="space-y-4 pt-6 font-reem font-normal">
            <p className="font-reem font-normal text-[#8492A6] text-[11px] sm:text-xs leading-relaxed uppercase tracking-wider max-w-xs">
              {smallText}
            </p>

            <p className="font-reem font-normal text-[#475569] text-sm sm:text-base lg:text-lg leading-snug uppercase tracking-tight max-w-xs">
              {boldText}
            </p>
          </div>
        </div>

        {/* 3 Columns of Cards (2008, 2009, 2010) */}
        <div className="flex flex-row gap-0 overflow-hidden font-kanit mt-28">

          {/* Card Column 1: ADA Logo & 2008 Box */}
          <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
            <div className="bg-white p-6 sm:p-8 aspect-[1.5/1] flex items-center justify-center">
              <img
                src={image1}
                alt="ADA Aqua Design Amano"
                className="max-h-20 sm:max-h-24 w-auto object-contain"
              />
            </div>

            <div className="bg-[#0c181c] text-white p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
              <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-white">
                2008
              </span>
              <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-white leading-tight">
                ADA LAUNCHED IN KOLKATA
              </span>
              <p className="font-kanit font-normal text-[10px] sm:text-[11px] tracking-wide uppercase text-zinc-300 pt-1 leading-relaxed">
                THE PRODUCTS GET TESTED AND SOME INITIAL LEARNING IS GATHERED.
              </p>
            </div>
          </div>

          {/* Card Column 2: Takashi Amano Image & 2009 Box */}
          <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
            <div className="bg-zinc-900 aspect-[1.5/1] overflow-hidden relative">
              <img
                src={image2}
                alt="Mr. Takashi Amano"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="bg-white text-zinc-900 p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
              <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-zinc-900">
                2009
              </span>
              <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-zinc-800 leading-tight">
                MENTOR MR. GAUTAMGUPTA MEETS MR. TAKASHI AMANO
              </span>
              <p className="font-kanit font-normal text-[10px] sm:text-[11px] text-zinc-500 pt-0.5 leading-relaxed uppercase">
                Mr. Gautam Gupta participates in India's first ever Nature Aquarium Seminar.
              </p>
            </div>
          </div>

          {/* Card Column 3: 2010 Box & NatureCube Logo */}
          <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
            <div className="bg-[#0c181c] text-white p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
              <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-white">
                2010
              </span>
              <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-white leading-tight">
                OUR JOURNEY STARTED
              </span>
            </div>

            <div className="bg-white p-6 sm:p-8 aspect-[1.5/1] flex items-center justify-center">
              <img
                src={naturecubeLogo}
                alt="NatureCube Living Art Under Water"
                className="max-h-20 sm:max-h-24 w-auto object-contain"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AboutHistoryPanel;