import React, { useState } from 'react';
import jar1 from '../../assets/nc_home/jar1.png';
import jar2 from '../../assets/nc_home/jar2.png';
import jar3 from '../../assets/nc_home/jar3.png';
import jar4 from '../../assets/nc_home/jar4.png';
import jar5 from '../../assets/nc_home/jar5.png';
import plantBox from '../../assets/nc_home/plant_box.png';

const GulmoConceptSection = () => {
  const [activeTab, setActiveTab] = useState('terrariums');

  const categories = [
    { id: 'terrariums', label: 'Glass Terrariums', img: jar1, desc: 'Self-sustaining miniature botanical worlds encapsulated in hand-blown crystal glass vessels.' },
    { id: 'moss', label: 'Moss Art & Biomes', img: jar2, desc: 'Lush evergreen moss scapes crafted with natural stone, ancient wood, and humidity-retaining flora.' },
    { id: 'desktop', label: 'Desktop Ecosystems', img: jar3, desc: 'Compact living sculptures tailored for executive desks, luxury homes, and minimal workspaces.' },
    { id: 'planters', label: 'Concept Planters', img: plantBox, desc: 'Artisanal planters and custom wooden frames engineered to house exotic tropical specimens.' },
  ];

  const galleryJars = [
    { id: 1, img: jar1, title: 'Enclosed Rain-Forest Biome', subtitle: 'Self-Sustaining Glass Jar' },
    { id: 2, img: jar2, title: 'Miniature Moss Oasis', subtitle: 'High Humidity Flora Setup' },
    { id: 3, img: jar3, title: 'Tropical Fern Sanctum', subtitle: 'Botanical Glass Display' },
    { id: 4, img: jar4, title: 'Curated Moss Sphere', subtitle: 'Artisanal Miniature World' },
    { id: 5, img: jar5, title: 'Closed Ecosystem Vessel', subtitle: 'Zero-Maintenance Greenery' },
  ];

  return (
    <section className="w-full bg-[#070e06] text-white py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden select-none font-kanit">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7BA641]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Header Philosophy Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-zinc-800/80 pb-16">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[#7BA641] text-xs font-semibold tracking-[0.25em] uppercase">
              GULMO BOTANICAL STUDIO
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white leading-tight">
              MINIATURE NATURE IN GLASS
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
              Gulmo Concept Gardening reimagines indoor greenery through handcrafted living terrariums, enclosed ecosystems, and bespoke botanical installations. Each creation balances humidity, light, and natural substrata to form self-sustaining indoor habitats.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="space-y-12">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-6 py-3 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-[#7BA641] text-white shadow-[0_0_20px_rgba(123,166,65,0.4)] scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Tab Featured Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-950/60 rounded-2xl border border-zinc-800/60 p-6 md:p-10 backdrop-blur-sm">
            {categories
              .filter((cat) => cat.id === activeTab)
              .map((item) => (
                <React.Fragment key={item.id}>
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-block px-3 py-1 bg-[#7BA641]/20 border border-[#7BA641]/40 rounded-sm text-[#7BA641] text-[10px] tracking-widest uppercase font-semibold">
                      FEATURED CONCEPT
                    </div>
                    <h3 className="text-2xl md:text-4xl font-light text-white tracking-wide">
                      {item.label}
                    </h3>
                    <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          const event = new CustomEvent('open-consultation-modal');
                          window.dispatchEvent(event);
                        }}
                        className="bg-[#7BA641] hover:bg-[#6b9337] text-white text-xs font-medium tracking-widest px-8 py-3.5 rounded-sm uppercase transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(123,166,65,0.4)] cursor-pointer"
                      >
                        ORDER CUSTOM TERRARIUM
                      </button>
                    </div>
                  </div>
                  <div className="lg:col-span-6 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 group relative bg-zinc-900 flex items-center justify-center p-6">
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full max-h-[360px] object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>

        {/* Terrarium Jars Collection Showcase Grid */}
        <div className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <span className="text-[#7BA641] text-xs font-semibold tracking-[0.2em] uppercase">
              JAR COLLECTION
            </span>
            <h3 className="text-2xl md:text-4xl font-light tracking-wide text-white">
              EXPLORE OUR BOTANICAL SANCTUARIES
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {galleryJars.map((jar) => (
              <div
                key={jar.id}
                className="bg-zinc-900/60 rounded-xl border border-zinc-800 p-4 hover:border-[#7BA641]/50 transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className="w-full h-48 flex items-center justify-center overflow-hidden mb-4">
                  <img
                    src={jar.img}
                    alt={jar.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-sm font-medium text-white tracking-wide">{jar.title}</h4>
                <span className="text-[11px] text-zinc-400 font-light mt-1">{jar.subtitle}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default GulmoConceptSection;
