import React from 'react';
import aboutMainImg from '../../assets/nc_about/about_main.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutMainImagePanel = ({ data }) => {
  return (
    <div className="w-screen min-w-[100vw] h-full bg-black flex-shrink-0 relative flex items-center justify-center overflow-hidden select-none font-kanit">
      <img
        src={data?.image ? resolveAssetUrl(data.image) : aboutMainImg}
        alt="About NatureCube Main Showcase"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default AboutMainImagePanel;