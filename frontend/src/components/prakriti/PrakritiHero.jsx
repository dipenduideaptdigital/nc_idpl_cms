import React from 'react';
import Reveal from '../../animations/Reveal';
import brush2Img from '../../assets/nc_logo/brush2.png';

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

const PrakritiHero = ({ data }) => {
  const defaultHeadlineLines = [
    { line: "Learning" },
    { line: "through" },
    { line: "experience," },
    { line: "not through" },
    { line: "lectures" }
  ];

  const headlineLines = (data?.headlineLines && data.headlineLines.length > 0) 
    ? data.headlineLines 
    : defaultHeadlineLines;

  const brushBg = data?.brushImage ? getAssetUrl(data.brushImage) : brush2Img;

  return (
    <section data-prakriti-step="hero" data-nav-theme="light" className="relative w-full min-h-[100svh] -mt-24 bg-[#FAFAF7] overflow-hidden select-none flex items-center pt-28 pb-10 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
      {/* Background Radial Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle at 75% 40%, rgba(240, 245, 235, 0.8) 0%, rgba(250, 250, 247, 0) 65%)'
        }}
      />
      
      {/* Bottom-Left Watercolor Brush Element */}
      <Reveal direction="right" amount={0.15} duration={1.5} className="absolute bottom-0 -left-20 sm:-bottom-16 sm:-left-20 md:-bottom-20 md:-left-24 lg:-bottom-4 lg:-left-24 w-[260px] sm:w-[400px] md:w-[520px] lg:w-[400px] aspect-square pointer-events-none z-0">
        <img
          src={brushBg}
          alt=""
          className="w-full h-full object-contain object-left-bottom opacity-80 sm:opacity-90 -rotate-12"
        />
      </Reveal>

      {/* Main Hero Content Container */}
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side Ambient Area (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-6" />

        {/* Right Side Main Typography Content */}
        <Reveal amount={0.3} duration={1.4} delay={0.15} className="lg:col-span-7 xl:col-span-6 pl-2 sm:pl-4 lg:pl-6">
          <h1 className="font-kanit font-bold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[58px] text-[#363636] leading-[1.08] tracking-tight space-y-1 sm:space-y-1.5 md:space-y-2 lg:ml-20 xl:ml-32">
            {headlineLines.map((lineObj, idx) => (
              <span
                key={idx}
                className="block"
              >
                {lineObj.line}
              </span>
            ))}
          </h1>
        </Reveal>
      </div>
    </section>
  );
};

export default PrakritiHero;
