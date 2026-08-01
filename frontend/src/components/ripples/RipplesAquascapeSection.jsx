import React, { useState, useEffect } from 'react';
import card1 from '../../assets/nc_home/card1.png';
import card2 from '../../assets/nc_home/card2.png';
import card3 from '../../assets/nc_home/card3.png';
import card4 from '../../assets/nc_home/card4.png';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';
import gallery3 from '../../assets/nc_home/gallery3.png';
import fishImg from '../../assets/nc_home/fish.png';

const RipplesAquascapeSection = ({ data }) => {
  // Default fallbacks for categories
  const defaultCategories = [
    { id: 'nature', label: 'Nature Aquariums', img: card1, desc: 'Captivating underwater landscapes styled after natural forests, mountains, and valleys with vibrant living plants.' },
    { id: 'biotope', label: 'Low-Maintenance Biotopes', img: card2, desc: 'Authentic habitat recreations tailored for easy maintenance while mirroring natural rivers and aquatic ecosystems.' },
    { id: 'hardscape', label: 'Custom Hardscapes', img: card3, desc: 'Artisanal stone structures, fossil wood, and natural driftwood scapes crafted as permanent interior focal points.' },
    { id: 'paludarium', label: 'Paludariums & Ripariums', img: card4, desc: 'Seamlessly blending underwater aquatic realms with lush above-water terrarium plant growth.' },
  ];

  const categories = data?.categories?.length > 0 ? data.categories : defaultCategories;
  
  const [activeTab, setActiveTab] = useState(categories[0]?.id || 'nature');

  // Prevent UI break if dynamic categories change from admin panel
  useEffect(() => {
    if (categories.length > 0 && !categories.some(cat => cat.id === activeTab)) {
      setActiveTab(categories[0].id);
    }
  }, [categories, activeTab]);

  // Dynamic Texts with Fallbacks
  const displaySubtitle = data?.subtitle || 'RIPPLES AQUATIC STUDIO';
  const displayTitle = data?.title || 'LIVING ART UNDER WATER';
  const displayDescription = data?.description || 'At Ripples Aquatic Studio, we engineer pristine underwater ecosystems that bring tranquility, life, and architectural grandeur into your space. From high-tech Dutch aquascapes to low-maintenance biotope environments, each installation is a handcrafted living masterpiece.';

  const displayGallerySubtitle = data?.gallerySubtitle || 'GALLERY SHOWCASE';
  const displayGalleryTitle = data?.galleryTitle || 'CRAFTED WITH PRECISION & PASSION';

  // Default fallbacks for galleries
  const defaultGalleries = [
    { img: gallery1, caption: 'Nature Aquarium Hardscape' },
    { img: gallery2, caption: 'High Precision CO2 Plant System' },
    { img: gallery3, caption: 'Custom Architectural Tank Fitments' }
  ];
  
  const galleries = data?.galleries?.length > 0 ? data.galleries : defaultGalleries;

  return (
    <div className="w-full bg-[#070e06] text-white py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden select-none font-kanit">
      
      {/* Background Subtle Fish Accent */}
      <div className="absolute top-12 right-[-60px] w-64 md:w-96 opacity-15 pointer-events-none filter blur-[1px] transform rotate-12">
        <img src={fishImg} alt="Fish Accent" className="w-full h-auto object-contain" />
      </div>

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* Header Philosophy Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-zinc-800/80 pb-16">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[#7BA641] text-xs font-semibold tracking-[0.25em] uppercase">
              {displaySubtitle}
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white leading-tight">
              {displayTitle}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
              {displayDescription}
            </p>
          </div>
        </div>

        {/* Category Showcase Tabs & Cards */}
        <div className="space-y-12">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-6 py-3 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-300 ${
                  activeTab === cat.id
                    ? 'bg-[#7BA641] text-white shadow-[0_0_20px_rgba(123,166,65,0.4)] scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured Tab Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-950/60 rounded-2xl border border-zinc-800/60 p-6 md:p-10 backdrop-blur-sm">
            {categories
              .filter((cat) => cat.id === activeTab)
              .map((item) => (
                <React.Fragment key={item.id}>
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-block px-3 py-1 bg-[#7BA641]/20 border border-[#7BA641]/40 rounded-sm text-[#7BA641] text-[10px] tracking-widest uppercase font-semibold">
                      FEATURED COLLECTION
                    </div>
                    <h3 className="text-2xl md:text-4xl font-light text-white tracking-wide">
                      {item.label}
                    </h3>
                    <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="pt-4 flex items-center gap-6">
                      <button
                        onClick={() => {
                          const event = new CustomEvent('open-consultation-modal');
                          window.dispatchEvent(event);
                        }}
                        className="bg-[#7BA641] hover:bg-[#6b9337] text-white text-xs font-medium tracking-widest px-8 py-3.5 rounded-sm uppercase transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(123,166,65,0.4)] cursor-pointer"
                      >
                        BOOK A CONSULTATION
                      </button>
                    </div>
                  </div>
                  <div className="lg:col-span-6 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 group relative">
                    <img
                      src={item.img || card1} // Fallback to card1 if image is missing from admin
                      alt={item.label}
                      className="w-full h-[320px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>

        {/* Gallery Grid Section */}
        <div className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <span className="text-[#7BA641] text-xs font-semibold tracking-[0.2em] uppercase">
              {displayGallerySubtitle}
            </span>
            <h3 className="text-2xl md:text-4xl font-light tracking-wide text-white">
              {displayGalleryTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleries.map((item, index) => (
              <div key={index} className="rounded-xl overflow-hidden border border-zinc-800 shadow-lg group relative h-80">
                <img 
                  src={item.img || gallery1} // Fallback if image is missing
                  alt={item.caption} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <span className="text-xs tracking-widest text-zinc-300 uppercase font-light">
                    {item.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RipplesAquascapeSection;