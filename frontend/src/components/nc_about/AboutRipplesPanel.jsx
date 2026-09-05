import React from 'react';
import booksImg from '../../assets/nc_about/books.png';
import ripplesLogo from '../../assets/nc_logo/ripples.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutRipplesPanel = ({ data }) => {
  const year2015Title = data?.year2015Title || "2015";
  const shopHeading = data?.shopHeading || "RIPPLES STARTS SHOP";
  const shopText = data?.shopText || "RIPPLES, THE RETAIL STORE CUM GALLERY OF NATURE CUBE GETS INAUGURATED. IT GENERATES FURTHER INTERESTS OF NATURE AQUARIUM AMONG SEVERAL AQUARIUM HOBBYISTS.";

  const year2016Title = data?.year2016Title || "2016";
  const journalHeading = data?.journalHeading || "RIPPLES FEATURED IN THE ADA AQUA JOURNAL";

  return (
    <div className="w-auto flex-shrink-0 h-full bg-white text-zinc-900 relative flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-0 z-10 select-none font-kanit overflow-hidden">
      <div className="relative z-10 flex flex-row items-center my-auto font-kanit mt-28">

        {/* Card Column 6: 2015 Text (top) & Ripples Logo (bottom) */}
        <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
          <div className="bg-[#0c181c] text-white p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
            <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-white">
              {year2015Title}
            </span>
            <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-white leading-tight">
              {shopHeading}
            </span>
            <p className="font-kanit font-normal text-[10px] sm:text-[11px] tracking-wide uppercase text-zinc-300 pt-1 leading-relaxed">
              {shopText}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 aspect-[1.5/1] flex items-center justify-center">
            <img
              src={data?.image2 ? resolveAssetUrl(data.image2) : ripplesLogo}
              alt="Ripples Aquatic Studio Logo"
              className="max-h-20 sm:max-h-24 w-auto object-contain"
            />
          </div>
        </div>

        {/* Card Column 7: ADA Aqua Journal Image (top) & 2016 Text (bottom) */}
        <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
          <div className="bg-zinc-900 aspect-[1.5/1] overflow-hidden relative">
            <img
              src={data?.image1 ? resolveAssetUrl(data.image1) : booksImg}
              alt="ADA Aqua Journal Books"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="bg-[#0c181c] text-white p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
            <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-white">
              {year2016Title}
            </span>
            <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-white leading-tight">
              {journalHeading}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutRipplesPanel;