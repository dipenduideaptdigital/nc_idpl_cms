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
  const centreHeading = data?.centreHeading || "OPEN STATE OF THE ART EXPERIENCE CENTRE IN KOLKATA";

  const year2020Title = data?.year2020Title || "2020";
  const bringsLine1 = data?.bringsLine1 || "NATURE CUBE BRINGS 2 HR AQUARIST TO INDIA";
  const bringsLine2 = data?.bringsLine2 || "NATURE CUBE BRINGS OASE TO INDIA";

  return (
    <div className="w-auto flex-shrink-0 h-full bg-white text-zinc-900 relative flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 pl-0 pr-0 z-10 select-none font-kanit overflow-hidden">
      <div className="relative z-10 flex flex-row items-center my-auto font-kanit mt-28">

        {/* Card Column 8: 2017 Terrarium Products (top) & Gulmohar Logo (bottom) */}
        <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
          <div className="bg-[#0c181c] text-white p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
            <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-white">
              {year2017Title}
            </span>
            <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-white leading-tight">
              {terrariumHeading}
            </span>
            <p className="font-kanit font-normal text-[10px] sm:text-[11px] tracking-wide uppercase text-zinc-300 pt-1 leading-relaxed">
              {terrariumText}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 aspect-[1.5/1] flex items-center justify-center">
            <img
              src={image2}
              alt="Gulmohar Logo"
              className="max-h-20 sm:max-h-24 w-auto object-contain"
            />
          </div>
        </div>

        {/* Card Column 9: 2hr Aquarist Logo (top) & 2020 Text (bottom) */}
        <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
          <div className="bg-[#f4efe6] p-6 sm:p-8 aspect-[1.5/1] flex items-center justify-center">
            <img
              src={image1}
              alt="2hr Aquarist Logo"
              className="max-h-20 sm:max-h-24 w-auto object-contain"
            />
          </div>

          <div className="bg-white text-zinc-900 p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
            <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-[#1E293B]">
              {year2020Title}
            </span>
            <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#1E293B] leading-tight">
              {bringsLine1}
            </span>
            <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#1E293B] leading-tight">
              {bringsLine2}
            </span>
          </div>
        </div>

        {/* Card Column 10: 2025 Experience Centre (top) & Oase Logo (bottom) */}
        <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
          <div className="bg-[#7BA641] text-white p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
            <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-white">
              {year2025Title}
            </span>
            <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-white leading-tight">
              {centreHeading}
            </span>
          </div>

          <div className="bg-white p-6 sm:p-8 aspect-[1.5/1] flex items-center justify-center">
            <img
              src={image3}
              alt="Oase Logo"
              className="max-h-20 sm:max-h-24 w-auto object-contain"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutBrandsPanel;