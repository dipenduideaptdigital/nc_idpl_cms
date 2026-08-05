import React from 'react';
import aboutMainImg from '../../assets/nc_about/about_main.png';

const AboutMainImagePanel = () => {
  return (
    <div className="w-screen min-w-[100vw] h-full bg-black flex-shrink-0 relative flex items-center justify-center overflow-hidden select-none font-kanit">
      <img
        src={aboutMainImg}
        alt="About NatureCube Main Showcase"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default AboutMainImagePanel;