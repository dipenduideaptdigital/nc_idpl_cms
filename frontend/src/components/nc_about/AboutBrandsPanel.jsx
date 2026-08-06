import React from 'react';
import gulmoLogo from '../../assets/nc_logo/gulmo.png';
import oaseLogo from '../../assets/nc_logo/oase_new.png';
import twoHrLogo from '../../assets/nc_logo/2hr.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutBrandsPanel = ({ data }) => {
  const image1 = data?.image1 ? resolveAssetUrl(data.image1) : twoHrLogo;
  const image2 = data?.image2 ? resolveAssetUrl(data.image2) : gulmoLogo;
  const image3 = data?.image3 ? resolveAssetUrl(data.image3) : oaseLogo;

  const year2017Title = data?.year2017Title || "2017";
  const terrariumHeading = data?.terrariumHeading || "TERRARIUM PRODUCTS INTRODUCED";
  const terrariumText = data?.terrariumText || "NATURE CUBE STARTS DEALING WITH PRESTIGIOUS TERRARIUM PRODUCTS FROM DOOA AND STATE OF THE ART IOT BASED BIOTOPES FROM BIOPOD.";

  const year2025Title = data?.year2025Title || "2025";
  const centreHeading = data?.centreHeading || "OPPENSTATE OF THE ART EXPERIENCE CENTRE IN KOLKATA";

  const year2020Title = data?.year2020Title || "2020";
  const bringsLine1 = data?.bringsLine1 || "NATURE CUBE BRINGS 2 HR AQUARIST TO INDIA";
  const bringsLine2 = data?.bringsLine2 || "NATURE CUBE BRINGS OASE TO INDIA";

  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-900 flex-shrink-0 relative grid grid-cols-1 md:grid-cols-3 grid-rows-2 font-kanit select-none pt-20 sm:pt-24 md:pt-0">
      
      {/* Top-Left: 2017 Terrarium Products (Dark Navy Background) */}
      <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0d1c22] text-white">
        <span className="font-kanit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-2 tracking-tight">
          {year2017Title}
        </span>
        <h3 className="font-kanit font-bold text-base sm:text-lg lg:text-xl text-white tracking-tight uppercase mb-3 leading-snug">
          {terrariumHeading}
        </h3>
        <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed uppercase tracking-wide whitespace-pre-wrap">
          {terrariumText}
        </p>
      </div>

      <div className="p-6 flex items-center justify-center bg-[#f4efe6] border-l border-zinc-200/50 overflow-hidden">
        <img
          src={image1}
          alt="Brand Logo 1"
          className="max-h-[75%] max-w-[80%] object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#7BA641] text-white border-l border-green-600/30">
        <span className="font-kanit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-2 tracking-tight">
          {year2025Title}
        </span>
        <h3 className="font-kanit font-bold text-base sm:text-lg lg:text-xl text-white tracking-tight uppercase leading-snug">
          {centreHeading}
        </h3>
      </div>

      <div className="p-6 sm:p-10 flex items-center justify-center bg-white border-t border-zinc-100 overflow-hidden">
        <img
          src={image2}
          alt="Brand Logo 2"
          className="max-h-[65%] max-w-[75%] object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white border-t border-l border-zinc-100">
        <span className="font-kanit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1E293B] mb-2 tracking-tight">
          {year2020Title}
        </span>
        <div className="space-y-1">
          <p className="font-kanit font-bold text-sm sm:text-base lg:text-lg text-[#1E293B] tracking-tight uppercase leading-snug">
            {bringsLine1}
          </p>
          <p className="font-kanit font-bold text-sm sm:text-base lg:text-lg text-[#1E293B] tracking-tight uppercase leading-snug">
            {bringsLine2}
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-10 flex items-center justify-center bg-white border-t border-l border-zinc-100 overflow-hidden">
        <img
          src={image3}
          alt="Brand Logo 3"
          className="h-14 sm:h-20 md:h-24 w-auto object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>

    </div>
  );
};

export default AboutBrandsPanel;