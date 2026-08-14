import React from 'react';

// Default Partner Logos from nc_logo
import juwelLogo from '../../assets/nc_logo/juwel.png';
import ntlabsLogo from '../../assets/nc_logo/ntlabs.png';
import oaseLogo from '../../assets/nc_logo/oase.png';
import adaLogo from '../../assets/nc_logo/ada.jpg';
import swaLogo from '../../assets/nc_logo/rsz_swa_logo.png';
import aquaticLogo from '../../assets/nc_logo/aquatic.png';

// Icons and background splash
import brushBg from '../../assets/nc_logo/bush3.png';

// Helper to resolve the correct image URL from your backend
const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const defaultPartnerLogos = [
  juwelLogo, oaseLogo, swaLogo, // Col 1
  ntlabsLogo, adaLogo, aquaticLogo // Col 2
];

const OurPartnersSection = ({ data }) => {
  // Fallbacks for Text
  const mainTitle1 = data?.mainTitle1 || "OUR";
  const italicTitle = data?.italicTitle || "partners";
  const headline = data?.headline || "Trusted by Leading<br />Innovators in Web3.";
  const paragraph = data?.paragraph || "If you use this site regularly and would like to help keep the site on the Internet, please consider donating a small sum to help pay for the hosting and bandwidth bill.";
  const buttonText = data?.buttonText || "STORE";
  const buttonLink = data?.buttonLink || "#store";

  // Process Partner Logos (Fallback to default if not provided)
  const getLogo = (index) => {
    if (data?.partnerLogos && data.partnerLogos[index]) {
      return getAssetUrl(data.partnerLogos[index]);
    }
    return defaultPartnerLogos[index];
  };

  // Split into 2 columns (0,1,2 for Col 1 and 3,4,5 for Col 2)
  const column1Partners = [getLogo(0), getLogo(1), getLogo(2)];
  const column2Partners = [getLogo(3), getLogo(4), getLogo(5)];
  if (data?.isVisible === false) return null;
  return (
    <section className="relative w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-20 overflow-hidden select-none">
      
      {/* Soft Green Watercolor Splash Pinned to Bottom-Left */}
      <div className="absolute -bottom-10 -left-18 w-[320px] sm:w-[450px] lg:w-[500px] h-auto pointer-events-none z-0 opacity-65">
        <img
          src={brushBg}
          alt=""
          className="w-full h-auto object-contain object-left-bottom"
        />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Text Content & Call-to-Action */}
        <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-6 pt-0 lg:pt-1">
          
          <div className="mb-6 sm:mb-8 flex items-baseline flex-wrap">
            <span 
              className="font-reem font-bold text-3xl sm:text-5xl lg:text-[58px] text-black leading-[80%] uppercase align-middle"
              style={{ fontWeight: 700, verticalAlign: 'middle' }}
            >
              {mainTitle1}
            </span>
            <span className="font-reem font-bold text-3xl sm:text-5xl lg:text-[62px] leading-[100%] align-middle" style={{ fontWeight: 700, verticalAlign: 'middle' }}>
              &nbsp;
            </span>
            <span 
              className="font-larken font-normal italic text-4xl sm:text-6xl lg:text-[88px] text-[#7BA641] leading-[100%] lowercase align-middle"
              style={{ fontWeight: 400, verticalAlign: 'middle' }}
            >
              {italicTitle}
            </span>
          </div>

          {/* Headline using dangerouslySetInnerHTML to allow <br/> from admin */}
          <h2 
            className="font-kanit font-medium text-2xl sm:text-4xl lg:text-[40px] text-[#363636] leading-[1.18] lg:leading-[111%] max-w-lg mb-6 sm:mb-8 mt-2 sm:mt-4"
            dangerouslySetInnerHTML={{ __html: headline }}
          />

          <p 
            className="font-kanit font-light text-base sm:text-xl lg:text-[22px] text-[#6A6A6A] leading-relaxed lg:leading-[34px] max-w-lg mb-6 sm:mb-8"
          >
            {paragraph}
          </p>

          <a
            href={buttonLink}
            className="inline-flex items-center gap-3 bg-[#7BA641] hover:bg-[#6b9435] text-white px-5 py-2.5 mt-1 sm:mt-2 rounded-xs transition-colors shadow-sm group"
          >
            <span className="font-kanit font-bold text-xs sm:text-sm tracking-wider uppercase">
              {buttonText}
            </span>
            <div className="w-6 h-6 rounded-full bg-[#1b2b16] flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </a>

        </div>

        {/* Right Column: Staggered Partner Logos Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
          
          {/* Left Column of Logos */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            {column1Partners.map((logoUrl, index) => (
              <div
                key={`col1-${index}`}
                className="bg-white rounded-[10px] p-4 sm:p-8 lg:p-10 flex items-center justify-center h-[130px] sm:h-[180px] lg:h-[220px] shadow-[4px_4px_14.5px_-3px_#00000026] transition-all duration-300 hover:scale-[1.02]"
              >
                {logoUrl && <img src={logoUrl} alt="Partner" className="max-h-12 sm:max-h-16 lg:max-h-20 w-auto max-w-[85%] object-contain" />}
              </div>
            ))}
          </div>

          {/* Right Column of Logos (Staggered / Offset vertically on desktop) */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-12 lg:mt-16">
            {column2Partners.map((logoUrl, index) => (
              <div
                key={`col2-${index}`}
                className="bg-white rounded-[10px] p-4 sm:p-8 lg:p-10 flex items-center justify-center h-[130px] sm:h-[180px] lg:h-[220px] shadow-[4px_4px_14.5px_-3px_#00000026] transition-all duration-300 hover:scale-[1.02]"
              >
                {logoUrl && <img src={logoUrl} alt="Partner" className="max-h-12 sm:max-h-16 lg:max-h-20 w-auto max-w-[85%] object-contain" />}
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default OurPartnersSection;