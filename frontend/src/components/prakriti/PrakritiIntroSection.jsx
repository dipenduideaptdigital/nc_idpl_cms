import React from 'react';
import leaveIcon from '../../assets/nc_logo/leave.png';
import ntlabsLogo from '../../assets/nc_logo/ntlabs.png';

const PrakritiIntroSection = ({ data }) => {
  const brandName = data?.brandName || "Prakriti Lab Research";
  const title = data?.title || "Cultivating the Science of Living Ecosystems.";
  const description = data?.description || "Prakriti Lab is NatureCube s experimental sanctuary where biological balance meets artistic expression. We blend botanical science, precision hydrodynamics, and sustainable design to craft living art installations that flourish for generations.";
  
  const defaultFeatures = [
    {
      id: "01",
      title: "Bio-Spheric Harmony",
      desc: "Studying multi-tiered plant microclimates and self-sustaining aquatic nitrogen cycles to create resilient biological balances."
    },
    {
      id: "02",
      title: "Precision Hydrology",
      desc: "Custom-engineered automated misting, laminar water currents, and automated nutrient diffusion for pristine plant vibrancy."
    },
    {
      id: "03",
      title: "Living Art Curation",
      desc: "Translating nature's untouched wilderness into handcrafted glass vessels, terrariums, paludariums, and custom architectural wall biomes."
    }
  ];

  const featuresToRender = (data?.features && data.features.length > 0) ? data.features : defaultFeatures;

  return (
    <section className="relative w-full bg-[#F4F6F0] py-20 px-6 md:px-12 lg:px-20 overflow-hidden select-none border-t border-zinc-200/60">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Brand & Pillar Card */}
        <div className="lg:col-span-5 flex flex-col items-start space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7BA641]/10 text-[#5B822B] text-xs font-kanit font-semibold tracking-wider uppercase">
            <img src={leaveIcon} alt="Leaf" className="w-4 h-4 object-contain" />
            <span>{brandName}</span>
          </div>
          <h2 className="font-kanit text-3xl sm:text-4xl md:text-5xl font-bold text-[#232720] leading-tight whitespace-pre-line">
            {title}
          </h2>
          <p className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed font-light whitespace-pre-line">
            {description}
          </p>
          <div className="flex items-center gap-4 pt-2">
            <img src={ntlabsLogo} alt="Prakriti Lab Logo" className="h-10 w-auto object-contain opacity-80" />
            <span className="font-kanit text-xs tracking-widest text-zinc-500 uppercase">
              Innovation & Research Hub
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Feature Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuresToRender.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300 group ${index === 2 ? 'sm:col-span-2' : ''}`}
            >
              <div className="w-12 h-12 rounded-lg bg-[#7BA641]/15 flex items-center justify-center text-[#5B822B] font-kanit font-bold text-xl mb-4 group-hover:bg-[#7BA641] group-hover:text-white transition-colors">
                {feature.id || `0${index + 1}`}
              </div>
              <h3 className="font-kanit text-xl font-bold text-[#232720] mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PrakritiIntroSection;