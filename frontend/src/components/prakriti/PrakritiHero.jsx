import React from 'react';
import brush2Img from '../../assets/nc_logo/brush2.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const PrakritiHero = ({ data }) => {
  const defaultHeadlineLines = [
    { line: "It is a long" },
    { line: "established" },
    { line: "fact that a" },
    { line: "reader will be" },
    { line: "distracted." }
  ];

  const headlineLines = (data?.headlineLines && data.headlineLines.length > 0) 
    ? data.headlineLines 
    : defaultHeadlineLines;

  const brushBg = data?.brushImage ? getAssetUrl(data.brushImage) : brush2Img;

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-screen bg-[#FAFAF7] overflow-hidden select-none flex items-center pt-28 pb-20 lg:pt-36 lg:pb-24 px-8 sm:px-12 lg:px-20 xl:px-24">
      <div 
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle at 75% 40%, rgba(240, 245, 235, 0.8) 0%, rgba(250, 250, 247, 0) 65%)'
        }}
      />
      
      {/* Bottom-Left Watercolor Brush Element (brush2) */}
      <div className="absolute -bottom-12 -left-16 sm:-bottom-16 sm:-left-20 md:-bottom-20 md:-left-24 lg:-bottom-24 lg:-left-28 w-[320px] sm:w-[440px] md:w-[560px] lg:w-[680px] aspect-square pointer-events-none z-0">
        <img
          src={brushBg}
          alt="Prakriti Lab Brush Accent"
          className="w-full h-full object-contain object-left-bottom opacity-90 filter brightness-105 transform -rotate-12 transition-all duration-700 hover:scale-105"
        />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side Spacer / Ambient Area */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-6" />

        {/* Right Side Main Typography Content */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center items-start lg:items-start pl-0 lg:pl-6">
          <div className="space-y-1 sm:space-y-1.5 md:space-y-2 lg:ml-40">
            {headlineLines.map((lineObj, idx) => (
              <h1
                key={idx}
                className="font-kanit font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[60px] text-[#6A6A6A] leading-[1.08] tracking-tight transition-all duration-500 hover:translate-x-1"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {lineObj.line}
              </h1>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrakritiHero;