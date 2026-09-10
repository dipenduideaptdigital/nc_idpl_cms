import React from 'react';
import defaultHeroBg from '../../assets/nc_home/hero.jpg';
import NatureFeaturesBar from './NatureFeaturesBar';

// Helper to resolve the correct image URL from your backend
const getAssetUrl = (path) => {
  if (!path) return '';
  if (typeof path === 'object' && path.url) return getAssetUrl(path.url);
  const pathStr = String(path);
  if (
    pathStr.startsWith('http') || 
    pathStr.startsWith('data:') || 
    pathStr.startsWith('blob:') || 
    pathStr.startsWith('/src/') || 
    pathStr.startsWith('/assets/') ||
    pathStr.startsWith('/@fs/')
  ) {
    return pathStr;
  }
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${pathStr.startsWith('/') ? pathStr : `/${pathStr}`}`;
};

const NatureHero = ({ data }) => {
  const bgImage = data?.backgroundImage ? getAssetUrl(data.backgroundImage) : defaultHeroBg;
  const titleLine1 = data?.titleLine1 || "NATURE HAS";
  const titleLine2 = data?.titleLine2 || "ALWAYS BEEN CALLING.";
  const subHeadline = data?.subHeadline || "WE SIMPLY HELP YOU";
  const italicWord = data?.italicWord || "answer";

  if (data?.isVisible === false) return null;
  
  return (
    <section className="relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-between bg-[#060e05] text-white overflow-hidden pt-28 xs:pt-32 md:pt-36 lg:pt-40">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="NatureCube Aquascape"
          className="w-full h-full object-cover object-[center_35%] md:object-center scale-100 sm:scale-102 md:scale-105 filter brightness-100 contrast-100 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl min-[1921px]:max-w-[70vw] mx-auto px-4 xs:px-6 sm:px-8 w-full my-auto py-8 sm:py-12 md:py-16 transition-all duration-500">
        <div className="max-w-full lg:max-w-4xl xl:max-w-5xl min-[1921px]:max-w-[55vw] space-y-4 sm:space-y-6">
          <h1 className="font-reem text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] min-[1921px]:text-[clamp(3.5rem,3.5vw,5rem)] tracking-[0.03em] sm:tracking-[0.02em] [word-spacing:0.15em] sm:[word-spacing:0.2em] leading-[1.18] text-white uppercase font-light drop-shadow-lg space-y-1 sm:space-y-2.5">
            <div className="sm:whitespace-nowrap">{titleLine1}</div>
            <div className="sm:whitespace-nowrap">{titleLine2}</div>
          </h1>

          <div className="pt-2 sm:pt-4 md:pt-6">
            <h2 className="font-reem text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl min-[1921px]:text-[clamp(2.5rem,2.5vw,4rem)] tracking-[0.03em] sm:tracking-[0.02em] [word-spacing:0.15em] sm:[word-spacing:0.2em] leading-[1.18] text-white uppercase font-light drop-shadow-md sm:whitespace-nowrap">
              {subHeadline}
            </h2>
            <div className="font-larken text-5xl xs:text-6xl sm:text-7xl md:text-7xl lg:text-[5.5rem] min-[1921px]:text-[clamp(6rem,7vw,10rem)] text-zinc-100 font-normal italic tracking-normal mt-0 select-none leading-none drop-shadow-lg">
              {italicWord}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Highlight Bar */}
      <div className="relative z-20 w-full mt-auto">
        <NatureFeaturesBar featuresData={data?.features} />
      </div>
    </section>
  );
};

export default NatureHero;