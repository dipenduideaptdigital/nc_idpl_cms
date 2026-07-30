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

// Helper to resolve the correct image URL from your backend
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
  
  // Use admin tabs if available, otherwise use default
  const tabsToRender = (data?.tabs && data.tabs.length > 0) ? data.tabs : defaultTabData;
  
  // Find current tab data safely
  const currentTab = tabsToRender.find((tab) => tab.id === activeTab) || tabsToRender[0];
  const currentTabImage = currentTab?.image?.startsWith('http') || currentTab?.image?.startsWith('/') 
    ? getAssetUrl(currentTab.image) 
    : currentTab?.image;

  return (
    <section className="relative w-full bg-white pt-8 md:pt-8 lg:pt-14 pb-16 md:pb-24 px-4 sm:px-8 lg:px-12  overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Main Content Grid: Left Info & Right Large Dark Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative">
          
          {/* Left Column (5 cols): "what we do", "LIVING art", description & play button */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-4 ml-8 mt-5">
            <div>
              <span className="font-kanit text-sm sm:text-base font-semibold text-[#7BA641] tracking-wide block mb-3 lowercase">
                {tagline}
              </span>

              <h2 className="font-reem text-4xl sm:text-5xl lg:text-6xl font-normal tracking-wide text-[#0f2329] leading-none mb-8 uppercase">
                {mainTitle} <span className="font-larken font-normal italic text-[#7BA641] lowercase ml-2">{italicTitle}</span>
              </h2>

              <h3 className="font-kanit text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#363636] leading-[1.18] tracking-tight max-w-[340px] mb-6">
                {subHeadline}
              </h3>

              <p className="font-kanit text-base sm:text-lg text-zinc-500 font-normal leading-relaxed max-w-[340px] mb-8">
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

          {/* Right Column (7 cols): Dark Card */}
          <div className="lg:col-span-7 relative mt-4 lg:mt-0">
            
            {/* Top Right Floating Tabs attached to dark card */}
            <div className="flex justify-end gap-2 sm:gap-2 mb-2 relative z-30 pr-2">
              {tabsToRender.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 font-reem font-bold text-sm sm:text-base tracking-wider transition-all rounded-xs cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#7BA641] text-white shadow-lg scale-105'
                      : 'bg-[#67883b] text-white/90 hover:bg-[#7BA641]'
                  }`}
                >
                  {tab.id}
                </button>
              ))}
            </div>

            {/* Main Dark Card Container */}
            <div className="relative bg-[#0e2129] rounded-xs p-8 sm:p-10 lg:p-12 text-white shadow-2xl overflow-visible min-h-[420px] sm:min-h-[460px] lg:min-h-[500px] flex flex-col justify-between">
              
              <div className="max-w-xs sm:max-w-sm lg:max-w-md relative z-20 space-y-6 lg:space-y-5">
                <h3 className="font-larken text-4xl sm:text-5xl lg:text-6xl xl:text-7xl italic font-normal text-white tracking-wide leading-tight">
                  {currentTab?.title}
                </h3>

                <p className="font-sans text-sm sm:text-base text-zinc-300/90 leading-relaxed font-light">
                  {currentTab?.desc1}
                </p>

                <p className="font-sans text-sm sm:text-base text-zinc-300/90 leading-relaxed font-light">
                  {currentTab?.desc2}
                </p>

                <div className="pt-4">
                  <button className="group inline-flex items-center gap-4 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#2a3d45] flex items-center justify-center group-hover:bg-[#7BA641] transition-colors shadow-sm">
                      <img
                        src={ellipseBtnImg}
                        alt="+"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="font-reem text-sm sm:text-base tracking-wide lowercase">
                      explore the art
                    </span>
                  </button>
                </div>
              </div>

              {/* Background Paint Splash (bush3) behind the Terrarium Box */}
              <div className="absolute bottom-19 sm:-bottom-38 right-4 sm:right-10 lg:right-55 w-[280px] sm:w-[340px] lg:w-[250px] h-[250px] sm:h-[300px] lg:h-[300px] pointer-events-none z-10 opacity-100 transform rotate-180">
                <img
                  src={bush3Img}
                  alt=""
                  className="w-full h-full object-contain filter brightness-110 contrast-110"
                />
              </div>

              {/* Responsive Terrarium / Paludarium Box Image */}
              <div className="absolute right-[-20px] sm:right-[-35px] md:right-[-50px] lg:right-[-75px] xl:right-[10px] bottom-[-25px] sm:bottom-[-35px] md:bottom-[-45px] lg:bottom-[-180px] z-20 w-[280px] sm:w-[380px] md:w-[460px] lg:w-[480px] xl:w-[350px] 2xl:w-[620px] pointer-events-none transform transition-transform duration-500 ease-out hover:scale-102">
                <img
                  src={currentTabImage}
                  alt={currentTab?.title}
                  className="w-full h-auto object-contain filter "
                />
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Section: Footer Quote */}
        <div className="mt-12 sm:mt-16 lg:mt-40 text-center space-y-4 max-w-4xl mx-auto px-4">
          <span className="font-kanit text-sm sm:text-base font-semibold text-[#7BA641] tracking-wide block lowercase">
            {footerTagline}
          </span>
          <h4 className="font-larken text-[28px] sm:text-[38px] lg:text-[50px] italic font-semibold text-[#222222] leading-[1.2] tracking-normal text-center">
            {footerQuote}
          </h4>
        </div>

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