import React from 'react';
import { useLocation } from 'react-router-dom';
import personImg from '../../assets/nc_home/person.png';

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

const RipplesIntroSection = ({ data, showQuoteBanner }) => {
  const location = useLocation();
  const isGulmoPage = location?.pathname?.toLowerCase().includes('gulmo') || 
                      (typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('gulmo'));

  const personImageSrc = data?.personImage ? getAssetUrl(data.personImage) : personImg;
  const shouldShowQuote = !isGulmoPage && showQuoteBanner !== false && data?.showQuoteBanner !== false && data?.hideQuoteBanner !== true;

  return (
    <section className={`w-full bg-white select-none font-kanit ${shouldShowQuote ? 'pb-16 sm:pb-20 md:pb-28' : 'pb-8 sm:pb-12 md:pb-16'} overflow-hidden`}>
      {/* Top Intro Section */}
      <div className="min-h-[80vh] lg:min-h-screen flex flex-col justify-center max-w-7xl mx-auto py-20 lg:py-0 px-5 sm:px-8 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-16 items-start">
          
          {/* Main Title (Left Column) */}
          <div className="lg:col-span-6 pr-0 lg:pr-8">
            <h2 className="font-kanit text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[86px] font-medium text-[#363636] leading-[1.1] tracking-tight whitespace-pre-line">
              {data?.mainTitle || 'It is a long\nestablished\nfact that a\nreader will be\ndistracted.'}
            </h2>
          </div>

          {/* Subtitle, Description & Explore Action (Right Column) */}
          <div className="lg:col-span-5 lg:col-start-8 space-y-4 sm:space-y-6 pt-2 lg:pt-4">
            <h3 className="font-kanit text-base sm:text-xl md:text-2xl lg:text-[40px] font-medium text-[#666666] leading-snug whitespace-pre-line">
              {data?.subTitle || 'It is a long established fact\nthat a reader will be\ndistracted.'}
            </h3>

            <p className="font-kanit text-xs sm:text-sm md:text-base lg:text-[25px] font-light text-[#777777] leading-[1.6] max-w-lg whitespace-pre-line">
              {data?.description || "Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India. Specializing in setting up 'Nature Aquariums' and 'Biotopes' that mimic actual fish habitats, we offer international quality brands and exceptional customer service, helping you build and maintain your dream aquarium."}
            </p>

            {/* Explore Button */}
            <div className="pt-4 lg:pt-6">
              <button 
                onClick={() => {
                  const event = new CustomEvent('open-consultation-modal');
                  window.dispatchEvent(event);
                }}
                className="group inline-flex items-center gap-4 lg:gap-5 cursor-pointer"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#f4f4f4] text-[#7BA641] flex items-center justify-center transition-all duration-300 group-hover:bg-[#7BA641] group-hover:text-white group-hover:shadow-[0_4px_14px_rgba(123,166,65,0.4)] group-active:scale-95">
                  <svg 
                    className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:rotate-90" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="font-kanit text-lg md:text-[22px] font-normal tracking-wide lowercase text-[#111827] group-hover:text-[#7BA641] transition-colors">
                  explore
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Navy Banner: Prominent Overlapping Image & Spacious Quote */}
      {shouldShowQuote && (
        <div className="w-full bg-[#0e222b] mt-12 sm:mt-16 md:mt-24 mb-16 md:mb-24 py-8 sm:py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 relative">
            <div className="grid grid-cols-12 gap-6 sm:gap-10 md:gap-12 items-center">
              
              {/* Person Image (Left Side - Symmetrical Overlap across ALL screens) */}
              <div className="col-span-5 sm:col-span-5 md:col-span-6 relative z-10 flex justify-start -my-10 xs:-my-12 sm:-my-18 md:-my-28 lg:-my-32">
                <div className="w-full max-w-[200px] xs:max-w-[250px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[500px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)] rounded-xs border border-white/15">
                  <img
                    src={personImageSrc}
                    alt={data?.authorName || "Takashi Amano"}
                    className="w-full h-auto object-cover block"
                  />
                </div>
              </div>

              {/* Quote & Author Signature (Right Side - Elegant Typography) */}
              <div className="col-span-7 sm:col-span-7 md:col-span-6 space-y-2 xs:space-y-3 sm:space-y-4 py-2 sm:py-6 md:py-10 pl-1 sm:pl-4 text-left text-white">
                <blockquote className="font-kanit text-sm xs:text-base sm:text-2xl md:text-3xl lg:text-[34px] font-normal leading-snug sm:leading-tight tracking-wide whitespace-pre-line">
                  {data?.quote || '“To know Mother Nature is to love her smallest creations.”'}
                </blockquote>
                <p className="font-kanit text-xs xs:text-sm sm:text-xl md:text-2xl font-normal italic tracking-wide text-[#8CB84D] sm:text-zinc-200 whitespace-pre-line pt-1">
                  {data?.authorName || '–Takashi Amano'}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RipplesIntroSection;