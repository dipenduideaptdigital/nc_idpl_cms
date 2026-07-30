import React from 'react';
import brush1Img from '../../assets/nc_logo/brush1.png';
import ellipseBtnImg from '../../assets/nc_logo/Ellipse_plus_btn.png';

// Fallback Default Images
import defaultLogoImg from '../../assets/nc_logo/naturecube.png';
import defaultRipplesLogo from '../../assets/nc_logo/ripples.png';
import defaultGulmoLogo from '../../assets/nc_logo/gulmo.png';
import defaultGallery1 from '../../assets/nc_home/gallery1.png';
import defaultGallery2 from '../../assets/nc_home/gallery2.png';
import defaultGallery3 from '../../assets/nc_home/gallery3.png';
import defaultFishImg from '../../assets/nc_home/fish.png';
import defaultPlantBoxImg from '../../assets/nc_home/plant_box.png';

// Helper to resolve the correct image URL from your backend
const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const NatureShowcaseSection = ({ data }) => {
  // --- ROW 1 DATA ---
  const row1Logo = data?.row1Logo ? getAssetUrl(data.row1Logo) : defaultLogoImg;
  const row1Desc = data?.row1Desc || "NatureCube brings the beauty and tranquility of nature right into your living spaces. We offer a curated selection of products and services designed to create serene and vibrant natural environments within your home.";
  const gal1 = data?.galleryImages?.[0] ? getAssetUrl(data.galleryImages[0]) : defaultGallery1;
  const gal2 = data?.galleryImages?.[1] ? getAssetUrl(data.galleryImages[1]) : defaultGallery2;
  const gal3 = data?.galleryImages?.[2] ? getAssetUrl(data.galleryImages[2]) : defaultGallery3;

  // --- ROW 2 DATA ---
  const row2Logo = data?.row2Logo ? getAssetUrl(data.row2Logo) : defaultRipplesLogo;
  const row2Desc = data?.row2Desc || 'A <b>"Nature Aquarium"</b> To A Low Maintenance <b>"Biotope"</b>, We Have Everything Your Need To Enhance Your Space And Bring A Touch Of Nature To Your Life.';
  const row2BtnText = data?.row2BtnText || "explore";
  const row2FloatingImg = data?.row2FloatingImg ? getAssetUrl(data.row2FloatingImg) : defaultFishImg;

  // --- ROW 3 DATA ---
  const row3Logo = data?.row3Logo ? getAssetUrl(data.row3Logo) : defaultGulmoLogo;
  const row3Desc = data?.row3Desc || 'Their Impact Is Crucial. We <b>Offer State-Of-The-Art Semi-Aquatic And Terrestrial Terrarium Technologies</b> To Bring A Miniature Rainforest Into Your Living Room.';
  const row3BtnText = data?.row3BtnText || "explore";
  const row3FloatingImg = data?.row3FloatingImg ? getAssetUrl(data.row3FloatingImg) : defaultPlantBoxImg;

  return (
    <section className="relative w-full bg-[#fcfdfc] py-20 sm:py-28 px-4 sm:px-8 lg:px-20 overflow-hidden select-none">
      
      {/* Background Soft Paint Splash */}
      <div className="absolute -top-10 sm:-top-16 lg:-top-24 -left-10 sm:-left-16 lg:-left-24 w-[320px] sm:w-[480px] lg:w-[580px] h-auto pointer-events-none z-0 opacity-40">
        <img src={brush1Img} alt="" className="w-full h-auto object-contain object-left-top" />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 space-y-24 sm:space-y-36">
        
        {/* Row 1: NatureCube Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 md:space-y-8 pr-0 lg:pr-6">
            <div className="w-[200px] sm:w-[260px] lg:w-[300px]">
              <img src={row1Logo} alt="NatureCube Logo" className="w-full h-auto object-contain" />
            </div>
            <p className="font-kanit text-[20px] sm:text-[24px] lg:text-[27px] font-light text-[#6A6A6A] leading-[1.36] tracking-normal max-w-[370px]">
              {row1Desc}
            </p>
          </div>

          <div className="lg:col-span-7 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-4 sm:gap-6 min-w-[700px] lg:min-w-0 pb-4">
              <div className="w-1/3 min-w-[220px] lg:min-w-0 aspect-[4/5] rounded-xs overflow-hidden shadow-lg border border-zinc-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <img src={gal1} alt="Gallery 1" className="w-full h-full object-cover" />
              </div>
              <div className="w-1/3 min-w-[220px] lg:min-w-0 aspect-[4/5] rounded-xs overflow-hidden shadow-lg border border-zinc-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <img src={gal2} alt="Gallery 2" className="w-full h-full object-cover" />
              </div>
              <div className="w-1/3 min-w-[220px] lg:min-w-0 aspect-[4/5] rounded-xs overflow-hidden shadow-lg border border-zinc-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <img src={gal3} alt="Gallery 3" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Ripples Aquatic Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative">
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="w-[180px] sm:w-[180px] lg:w-[225px]">
              <img src={row2Logo} alt="Ripples Logo" className="w-full h-auto object-contain" />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6 ml-12 ">
            {/* Using dangerouslySetInnerHTML so <b> tags work dynamically */}
            <p 
              className="font-kanit text-sm sm:text-base lg:text-[19px] text-[#6A6A6A] leading-relaxed font-light max-w-sm [&>b]:font-bold [&>b]:text-zinc-800"
              dangerouslySetInnerHTML={{ __html: row2Desc }}
            />

            <div className="flex justify-end pr-8 sm:pr-12 pt-2">
              <button className="group inline-flex items-center gap-3 text-zinc-700 hover:text-[#7BA641] transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-full flex items-center justify-center relative overflow-hidden bg-[#eaf2e3] group-hover:bg-[#7BA641] transition-colors">
                  <img src={ellipseBtnImg} alt="+" className="w-full h-full object-cover" />
                </div>
                <span className="font-kanit text-xs sm:text-sm font-semibold tracking-wide lowercase text-zinc-800 group-hover:text-[#7BA641]">
                  {row2BtnText}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 relative min-h-[160px] flex items-center justify-center mb-30 lg:justify-end">
            <div className="absolute top-[-30px] right-[-20px] w-[140px] sm:w-[180px] pointer-events-none opacity-30 filter blur-[2px] transform -rotate-12">
              <img src={row2FloatingImg} alt="" className="w-full h-auto object-contain" />
            </div>
            <div className="relative z-10 w-[200px] sm:w-[260px] lg:w-[280px] pointer-events-none transform -rotate-6 hover:scale-105 transition-transform duration-500">
              <img src={row2FloatingImg} alt="Floating Fish" className="w-full h-auto object-contain filter drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Row 3: Gulmohar Concept Gardening */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="w-[200px] sm:w-[260px] lg:w-[250px] pointer-events-none transform transition-transform duration-500 hover:scale-105">
              <img src={row3FloatingImg} alt="Terrarium" className="w-full h-auto object-contain filter drop-shadow-xl" />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6 lg:pl-6">
            <div className="w-[180px] sm:w-[240px] lg:w-[225px]">
              <img src={row3Logo} alt="Gulmohar Logo" className="w-full h-auto object-contain" />
            </div>

            <p 
              className="font-kanit ml-20 text-sm sm:text-base lg:text-lg text-[#6A6A6A] leading-relaxed font-light max-w-[400px] [&>b]:font-bold [&>b]:text-zinc-800"
              dangerouslySetInnerHTML={{ __html: row3Desc }}
            />

            <div className="flex justify-center pr-8 sm:pr-16 pt-2">
              <button className="group inline-flex items-center gap-3 text-zinc-700 hover:text-[#7BA641] transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-full flex items-center justify-center relative overflow-hidden bg-[#eaf2e3] group-hover:bg-[#7BA641] transition-colors">
                  <img src={ellipseBtnImg} alt="+" className="w-full h-full object-cover" />
                </div>
                <span className="font-kanit text-xs sm:text-sm font-semibold tracking-wide lowercase text-zinc-800 group-hover:text-[#7BA641]">
                  {row3BtnText}
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default NatureShowcaseSection;