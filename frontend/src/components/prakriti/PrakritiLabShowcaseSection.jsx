import React from 'react';
import brush1Img from '../../assets/nc_logo/brush1.png';
import terraImg from '../../assets/nc_logo/terra.png';
import paluImg from '../../assets/nc_logo/palu.png';
import indoorImg from '../../assets/nc_logo/indoor.png';
import aquaticImg from '../../assets/nc_logo/aquatic.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const defaultShowcaseItems = [
  {
    title: "Botanical Terrariums",
    category: "Enclosed Microclimates",
    desc: "Self-sustaining glass biomes featuring rare mosses, tropical ferns, and delicate high-humidity flora.",
    image: terraImg,
  },
  {
    title: "Paludarium Ecosystems",
    category: "Dual Water & Terrestrial",
    desc: "Seamless blend of underwater aquatic landscapes with lush terrestrial waterfalls and living rock walls.",
    image: paluImg,
  },
  {
    title: "Indoor Biophilic Art",
    category: "Architectural Installations",
    desc: "Custom living green walls and interior biological features designed for high-end luxury spaces.",
    image: indoorImg,
  },
  {
    title: "Nature Aquascapes",
    category: "Aquatic Sculptures",
    desc: "Submerged landscapes inspired by natural stream beds, ancient forests, and pristine mountain rivers.",
    image: aquaticImg,
  },
];

const PrakritiLabShowcaseSection = ({ data }) => {
  const tagline = data?.tagline || "Laboratory Portfolio";
  const title = data?.title || "Prakriti Lab Experiments";
  const description = data?.description || "Each creation is a meticulously engineered natural ecosystem designed for aesthetic tranquility and low-maintenance longevity.";
  const showcaseItems = (data?.showcaseItems && data.showcaseItems.length > 0) ? data.showcaseItems : defaultShowcaseItems;

  return (
    <section className="relative w-full bg-[#FAFBF8] py-24 px-6 md:px-12 lg:px-20 overflow-hidden select-none">
      
      {/* Decorative Top Right Splash */}
      <div className="absolute -top-16 -right-16 w-[400px] h-[300px] pointer-events-none opacity-40">
        <img src={brush1Img} alt="" className="w-full h-full object-contain filter contrast-125" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-kanit text-xs font-semibold tracking-[0.2em] text-[#7BA641] uppercase block mb-2">
              {tagline}
            </span>
            <h2 className="font-kanit text-3xl sm:text-4xl md:text-5xl font-bold text-[#232720] tracking-tight">
              {title}
            </h2>
          </div>
          
          <div 
            className="font-sans text-sm sm:text-base text-zinc-600 max-w-md font-light tiptap-content"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {showcaseItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-zinc-200/70 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                <div className="w-full h-48 rounded-xl bg-zinc-100 overflow-hidden mb-6 flex items-center justify-center p-4">
                  <img
                    src={item.image ? getAssetUrl(item.image) : ''}
                    alt={item.title}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="font-kanit text-[11px] font-semibold text-[#7BA641] tracking-widest uppercase block mb-1">
                  {item.category}
                </span>
                <h3 className="font-kanit text-xl font-bold text-[#232720] mb-2 group-hover:text-[#5B822B] transition-colors">
                  {item.title}
                </h3>
                
                {/* Item Description HTML Safe */}
                <div 
                  className="text-zinc-500 text-xs leading-relaxed font-light tiptap-content"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
              </div>
              
              <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="font-kanit text-xs font-medium text-zinc-700 group-hover:text-[#5B822B] transition-colors">
                  Explore Details
                </span>
                <span className="w-7 h-7 rounded-full bg-[#7BA641]/10 text-[#5B822B] flex items-center justify-center text-sm font-bold group-hover:bg-[#7BA641] group-hover:text-white transition-colors">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrakritiLabShowcaseSection;