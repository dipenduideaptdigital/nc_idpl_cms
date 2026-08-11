import React from 'react';
import NatureNavbar from '../nature_homepage/NatureNavbar';
import projectHeroImg from '../../assets/nc_contact/project_hero.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const NcProjectsHero = ({ data }) => {
  const title = data?.title || "It is a long established fact that a reader\nwill be distracted.";
  const bgImageUrl = data?.backgroundImage ? resolveAssetUrl(data.backgroundImage) : projectHeroImg;

  return (
    <div className="relative w-full min-h-[550px] sm:min-h-[650px] md:min-h-[750px] lg:min-h-[850px] bg-zinc-950 overflow-hidden font-kanit">
      
      <NatureNavbar forceDark={true} />

      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto min-h-[550px] sm:min-h-[650px] md:min-h-[750px] lg:min-h-[850px] flex items-center px-6 sm:px-12 md:px-16 lg:px-24">
        <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl pt-24 sm:pt-28 md:pt-32">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[60px] font-normal text-white leading-[1.2] tracking-wide drop-shadow-lg font-kanit whitespace-pre-line">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default NcProjectsHero;