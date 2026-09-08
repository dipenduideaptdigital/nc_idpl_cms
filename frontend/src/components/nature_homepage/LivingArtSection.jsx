import React, { useState } from 'react';
import boxImg from '../../assets/nc_home/box.png';
import playBtnImg from '../../assets/nc_logo/play_btn.png';
import ellipseBtnImg from '../../assets/nc_logo/Ellipse_plus_btn.png';
import brush1Img from '../../assets/nc_logo/brush1.png';
import brush2Img from '../../assets/nc_logo/brush2.png';
import bush3Img from '../../assets/nc_logo/bush3.png';
import card1Img from '../../assets/nc_home/card1.png';
import card2Img from '../../assets/nc_home/card2.png';
import card3Img from '../../assets/nc_home/card3.png';
import card4Img from '../../assets/nc_home/card4.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};
const defaultTabData = [
  { id: '01', title: 'Paludariums', desc1: 'Experience the best of both worlds with our paludariums, which combine aquatic and terrestrial elements to create a unique and captivating display.', desc2: 'Experience the best of both worlds with our paludariums, which combine aquatic and terrestrial elements to create a unique and captivating display.', image: boxImg },
  { id: '02', title: 'Aquascapes', desc1: 'Immerse yourself in lush underwater gardens designed to replicate pristine natural aquatic environments.', desc2: 'Carefully balanced ecosystems featuring vibrant aquatic flora, natural driftwood, and crystal-clear aquatic life.', image: card1Img },
  { id: '03', title: 'Terrariums', desc1: 'Self-sustaining miniature moss landscapes encased in precision glass, bringing living serenity to any interior.', desc2: 'Meticulously crafted with rare tropical plants, humic substrate layers, and micro-climate atmosphere controls.', image: card2Img },
  { id: '04', title: 'Biotopes', desc1: 'Geographically accurate nature replications mimicking wild riverbeds, rainforest floors, and tropical banks.', desc2: 'Authentic biodiversity habitats engineered for optimal biological balance and breathtaking visual realism.', image: card3Img },
];

const LivingArtSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState('01');
  const [isPlaying, setIsPlaying] = useState(false);

  // Dynamic Data Bindings with Fallbacks
  const tagline = data?.tagline || "what we do";
  const mainTitle = data?.mainTitle || "LIVING";
  const italicTitle = data?.italicTitle || "art";
  const subHeadline = data?.subHeadline || "It is a long established fact that a reader will be distracted.";
  const paragraph = data?.paragraph || "It is a long established fact that a reader will be distracted.";
  const footerTagline = data?.footerTagline || "what we do";
  const footerQuote = data?.footerQuote || "Nature showed it to us twice – once in the Ripples on water and once in the flowers of the Gulmohar";
  const videoUrl = data?.videoUrl || "";
  const tabsToRender = (data?.tabs && data.tabs.length > 0) ? data.tabs : defaultTabData;
  const currentTab = tabsToRender.find((tab) => tab.id === activeTab) || tabsToRender[0];
  const configuredImage = typeof currentTab?.image === 'string' ? currentTab.image.trim() : '';
  const currentTabImage = configuredImage
    ? getAssetUrl(configuredImage)
    : boxImg;

  if (data?.isVisible === false) return null;

  return (
    <section className="relative w-full bg-white pt-12 sm:pt-16 lg:pt-20 pb-0 overflow-hidden select-none">

      {/* Main Content Grid: Left Info & Right Large Dark Card */}
      <div className="flex flex-col lg:flex-row items-stretch relative">

        {/* Left Column */}
        <div className="w-full lg:w-[42%] xl:w-[40%] flex-shrink-0 flex flex-col justify-between px-4 sm:px-8 lg:pl-12 xl:pl-20 2xl:pl-28 lg:pr-8">
          <div>
            <span className="font-kanit text-sm sm:text-base lg:text-[20px] font-medium text-[#6CAB44] tracking-wide block mb-8 lowercase">
              {tagline}
            </span>

            <h2 className="font-reem text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide text-[#0f2329] leading-none mb-8 uppercase">
              {mainTitle} <span className="font-larken text-5xl sm:text-6xl lg:text-7xl font-semibold italic text-[#6CAB44] lowercase ml-2">{italicTitle}</span>
            </h2>

            <h3 className="font-kanit text-2xl sm:text-3xl lg:text-[48px] font-medium text-[#363636] leading-tighter  tracking-tight max-w-[340px] lg:max-w-[500px] mb-10">
              {subHeadline}
            </h3>

            <p className="font-kanit text-base sm:text-lg lg:text-[35px] text-zinc-500 font-ligh  leading-tight max-w-[250px] lg:max-w-[440px] mb-8">
              {paragraph}
            </p>
          </div>

          {/* Play Button */}
          <div className="mt-2 sm:mt-4 pb-2">
            <button
              onClick={() => setIsPlaying(true)}
              className="group relative inline-flex items-center justify-center focus:outline-none cursor-pointer"
              aria-label="Play video"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f0f4ec] hover:bg-[#e4edd9] transition-all duration-300 flex items-center justify-center shadow-sm group-hover:scale-105">
                <img
                  src={playBtnImg}
                  alt="Play"
                  className="w-7 h-7 sm:w-9 sm:h-9 object-contain transform translate-x-0.5 group-hover:scale-110 transition-transform"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Dark Card - extends to right edge */}
        <div className="w-full lg:flex-1 relative mt-4 lg:mt-0 lg:pt-10 flex flex-col min-w-0">

          {/* Top Right Floating Tabs attached to dark card */}
          <div className="flex justify-end gap-2 sm:gap-2 mb-0.5 relative z-20 pr-8 sm:pr-12 lg:pr-16">
            {[...tabsToRender].reverse().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-reem font-bold text-sm sm:text-base tracking-wider transition-all rounded-xs cursor-pointer ${activeTab === tab.id
                  ? 'bg-[#6CAB44] text-white shadow-lg scale-105'
                  : 'bg-[#5a8a36] text-white/90 hover:bg-[#6CAB44]'
                  }`}
              >
                {tab.id}
              </button>
            ))}
          </div>

          {/* Main Dark Card Container - no right rounding, bleeds to edge */}
          <div className="relative bg-[#0e2129] rounded-tl-xs rounded-tr-none p-6 sm:p-10 lg:p-14 text-white shadow-2xl overflow-visible min-h-[420px] sm:min-h-[460px] lg:min-h-[600px] flex flex-col justify-between flex-1">

            <div className="max-w-xs sm:max-w-sm lg:max-w-md relative z-30 space-y-6 lg:space-y-5">
              <h3 className="font-larken text-4xl sm:text-5xl lg:text-6xl xl:text-7xl italic font-normal text-white tracking-wide leading-tight">
                {currentTab?.title}
              </h3>

              <p className="font-kanit text-sm sm:text-base text-zinc-300/90 leading-relaxed font-light">
                {currentTab?.desc1}
              </p>

              <p className="font-kanit text-sm sm:text-base text-zinc-300/90 leading-relaxed font-light">
                {currentTab?.desc2}
              </p>

              <div className="pt-4">
                <button className="group inline-flex items-center gap-3.5 text-[#505A5C] hover:text-[#48682E] transition-colors cursor-pointer">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EBF3DF] group-hover:bg-[#4A712E] text-[#6CAB44] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-[0_2px_12px_rgba(72,104,46,0.35)] group-active:scale-95">
                    <svg
                      className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span className="font-kanit text-[14.5px] sm:text-[15.5px] font-medium tracking-normal lowercase text-[#505A5C] group-hover:text-[#48682E] transition-colors">
                    explore the art
                  </span>
                </button>
              </div>
            </div>

            {/* Background Paint Splash (bush3) */}
            <div className="absolute bottom-[-40px] sm:bottom-[-50px] lg:bottom-[-170px]  right-[25%] lg:right-[32%] w-[220px] sm:w-[280px] lg:w-[420px]  h-[220px] sm:h-[280px] lg:h-[380px] pointer-events-none z-10 opacity-100 transform scale-y-[-1] rotate-180">
              <img
                src={brush1Img}
                alt=""
                className="w-full h-full object-contain filter brightness-100 contrast-90"
              />
            </div>

            {/* Terrarium / Paludarium Box Image */}
            <div className="relative lg:absolute self-end lg:self-auto mt-6 lg:mt-0 right-[20%] lg:right-[25%] lg:bottom-[-60px] xl:bottom-[-80px] z-20 w-[180px] xs:w-[220px] sm:w-[260px] md:w-[280px] lg:w-[280px] xl:w-[310px] 2xl:w-[340px] pointer-events-none transform transition-transform duration-500 ease-out hover:scale-102">
              <img
                src={currentTabImage}
                alt={currentTab?.title}
                className="w-full h-auto object-contain filter"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Section: Footer Quote */}
      <div className="mt-12 sm:mt-16 lg:mt-40 text-center space-y-4 max-w-6xl mx-auto px-4">
        <span className="font-kanit text-sm sm:text-base font-semibold text-[#6CAB44] tracking-wide block lowercase">
          {footerTagline}
        </span>
        <h4 className="font-larken text-[28px] sm:text-[38px] lg:text-[50px] italic font-semibold text-[#222222] leading-[1.2] tracking-normal text-center">
          {footerQuote}
        </h4>
      </div>

      {/* Video Modal Placeholder */}
      {isPlaying && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsPlaying(false)}
        >
          <div className="relative bg-black rounded-lg overflow-hidden max-w-4xl w-full aspect-video flex items-center justify-center text-white">
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-zinc-400 cursor-pointer z-50"
            >
              &times;
            </button>
            {videoUrl ? (
              <iframe
                src={videoUrl}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="NatureCube Video"
              ></iframe>
            ) : (
              <p className="font-reem text-xl text-zinc-300">NatureCube Showcase Video</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default LivingArtSection;