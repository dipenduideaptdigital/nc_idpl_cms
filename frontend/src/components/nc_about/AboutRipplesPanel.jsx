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
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-900 flex-shrink-0 relative grid grid-cols-1 md:grid-cols-2 grid-rows-2 font-kanit select-none pt-20 sm:pt-24 md:pt-0">
      
      {/* Top-Left: 2015 Ripples Shop Text (Dark Background) */}
      <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#0d1c22] text-white">
        <span className="font-kanit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-2 tracking-tight">
          {year2015Title}
        </span>
        <h3 className="font-kanit font-bold text-lg sm:text-xl lg:text-2xl text-white tracking-tight uppercase mb-3 max-w-lg leading-snug">
          {shopHeading}
        </h3>
        <p className="text-zinc-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-lg uppercase tracking-wide">
          {shopText}
        </p>
      </div>

      {/* Top-Right: ADA Aqua Journal Books Image (White Background) */}
      <div className="p-6 sm:p-10 flex items-center justify-center bg-white border-l border-zinc-100 overflow-hidden">
        <img
          src={data?.image1 ? resolveAssetUrl(data.image1) : booksImg}
          alt="ADA Aqua Journal Books"
          className="max-h-[85%] max-w-[85%] object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Bottom-Left: Ripples Aquatic Studio Logo (White Background) */}
      <div className="p-6 sm:p-10 flex items-center justify-center bg-white border-t border-zinc-100 overflow-hidden">
        <img
          src={data?.image2 ? resolveAssetUrl(data.image2) : ripplesLogo}
          alt="Ripples Aquatic Studio Logo"
          className="max-h-[60%] max-w-[70%] object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Bottom-Right: 2016 Aqua Journal Text (Dark Background) */}
      <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#0d1c22] text-white border-t border-l border-zinc-800/60">
        <span className="font-kanit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-2 tracking-tight">
          {year2016Title}
        </span>
        <h3 className="font-kanit font-bold text-lg sm:text-xl lg:text-2xl text-white tracking-tight uppercase max-w-lg leading-snug">
          {journalHeading}
        </h3>
      </div>

    </div>
  );
};

export default AboutRipplesPanel;