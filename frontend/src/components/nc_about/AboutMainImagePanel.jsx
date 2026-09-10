import React from 'react';
import aboutMainImg from '../../assets/nc_about/about_main.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutMainImagePanel = ({ data }) => {
  return (
    <div className="w-auto flex-shrink-0 h-full bg-white text-zinc-900 relative flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-0 z-10 select-none font-kanit overflow-hidden">
      <div className="relative z-10 flex flex-row items-center my-auto font-kanit mt-28">
        <div className="w-[420px] sm:w-[550px] md:w-[680px] lg:w-[900px] h-[373px] sm:h-[426px] md:h-[480px] lg:h-[533px] flex-shrink-0 overflow-hidden relative">
          <img
            src={data?.image ? resolveAssetUrl(data.image) : aboutMainImg}
            alt="About NatureCube Main Showcase"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutMainImagePanel;