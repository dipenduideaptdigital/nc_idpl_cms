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

  return (
    <section className="relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-between bg-[#060e05] text-white overflow-hidden pt-24 xs:pt-28 md:pt-36 lg:pt-40">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="NatureCube Aquascape"
          className="w-full h-full object-cover object-[center_35%] md:object-center scale-100 sm:scale-102 md:scale-105 filter brightness-95 contrast-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 sm:from-black/65 sm:via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060e05] via-[#060e05]/35 to-black/40" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 w-full my-auto py-8 sm:py-12 md:py-16">
        <div className="max-w-full lg:max-w-4xl xl:max-w-5xl space-y-4 sm:space-y-6">
          <h1 className="font-reem text-[1.4rem] xs:text-2xl sm:text-4xl md:text-5xl lg:text-[3.2rem] tracking-[0.03em] sm:tracking-[0.02em] [word-spacing:0.15em] sm:[word-spacing:0.2em] leading-[1.18] text-white uppercase font-light drop-shadow-lg space-y-1 sm:space-y-2.5">
            <div className="sm:whitespace-nowrap">{titleLine1}</div>
            <div className="sm:whitespace-nowrap">{titleLine2}</div>
          </h1>

          <div className="pt-2 sm:pt-4 md:pt-6">
            <h2 className="font-reem text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.03em] sm:tracking-[0.02em] [word-spacing:0.15em] sm:[word-spacing:0.2em] leading-[1.18] text-white uppercase font-light drop-shadow-md sm:whitespace-nowrap">
              {subHeadline}
            </h2>
            <div className="font-larken text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-zinc-100 font-normal italic tracking-normal mt-1 sm:mt-2 md:mt-3 select-none leading-none drop-shadow-lg">
              {italicWord}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Highlight Bar */}
      <div className="relative z-20 w-full mt-auto">
        <NatureFeaturesBar />
      </div>
    </section>
  );
};

export default NatureHero;