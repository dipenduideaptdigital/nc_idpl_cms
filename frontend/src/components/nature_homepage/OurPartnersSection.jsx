import React from 'react';

// Partner Logos from nc_logo
import juwelLogo from '../../assets/nc_logo/juwel.png';
import ntlabsLogo from '../../assets/nc_logo/ntlabs.png';
import oaseLogo from '../../assets/nc_logo/oase.png';
import adaLogo from '../../assets/nc_logo/ada.jpg';
import swaLogo from '../../assets/nc_logo/rsz_swa_logo.png';
import aquaticLogo from '../../assets/nc_logo/aquatic.png';

// Icons and background splash from nc_logo
import pointerIcon from '../../assets/nc_logo/pointer.png';
import brushBg from '../../assets/nc_logo/bush3.png';

const OurPartnersSection = () => {
  const column1Partners = [
    { name: 'JUWEL', logo: juwelLogo },
    { name: 'Oase', logo: oaseLogo },
    { name: 'Still Water Aquatics', logo: swaLogo },
  ];

  const column2Partners = [
    { name: 'NT LABS', logo: ntlabsLogo },
    { name: 'ADA Aqua Design Amano', logo: adaLogo },
    { name: 'Chihiros Aquatic Studio', logo: aquaticLogo },
  ];

  return (
    <section className="relative w-full bg-white py-20 sm:py-28 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      
      {/* Soft Green Watercolor Splash Pinned to Bottom-Left */}
      <div className="absolute -bottom-10 -left-18 w-[350px] sm:w-[500px] lg:w-[500px] h-auto pointer-events-none z-0 opacity-65">
        <img
          src={brushBg}
          alt=""
          className="w-full h-auto object-contain object-left-bottom"
        />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Text Content & Call-to-Action */}
        <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-6 pt-0 lg:pt-1">
          
          {/* Section Title */}
          <div className="mb-8 flex items-baseline">
            <span 
              className="font-reem font-bold text-4xl sm:text-5xl lg:text-[58px] text-black leading-[80%] tracking-[-1%] uppercase align-middle"
              style={{ fontWeight: 700, verticalAlign: 'middle' }}
            >
              OUR 
            </span>
            <span 
              className="font-reem font-bold text-4xl sm:text-5xl lg:text-[62px] leading-[100%] tracking-[5%] align-middle"
              style={{ fontWeight: 700, verticalAlign: 'middle' }}
            >
              &nbsp;
            </span>
            <span 
              className="font-larken font-normal italic text-5xl sm:text-7xl lg:text-[88px] text-[#7BA641] leading-[100%] tracking-[0%] lowercase align-middle"
              style={{ fontWeight: 400, verticalAlign: 'middle' }}
            >
              partners
            </span>
          </div>

          {/* Main Headline */}
          <h2 
            className="font-kanit font-medium text-2xl sm:text-4xl lg:text-[45px] text-[#363636] leading-[111%] tracking-[0%] align-middle max-w-lg mb-8 mt-4"
            style={{ fontWeight: 500, lineHeight: '111%', letterSpacing: '0%', verticalAlign: 'middle', color: '#363636' }}
          >
            Trusted by Leading<br />Innovators in Web3.
          </h2>

          {/* Paragraph */}
          <p 
            className="font-kanit font-light text-lg sm:text-2xl lg:text-[28px] text-[#6A6A6A] leading-[34px] tracking-[0%] align-middle max-w-lg mb-8"
            style={{ fontWeight: 300, lineHeight: '34px', letterSpacing: '0%', verticalAlign: 'middle', color: '#6A6A6A' }}
          >
            If you use this site regularly and would like to help keep the site on the Internet, please consider donating a small sum to help pay for the hosting and bandwidth bill.
          </p>

          {/* Store Button with Pointer Logo */}
          <a
            href="#store"
            className="inline-flex items-center gap-3 bg-[#7BA641] hover:bg-[#6b9435] text-white px-5 py-2.5 mt-2 rounded-xs transition-colors shadow-sm group"
          >
            <span className="font-kanit font-bold text-xs sm:text-sm tracking-wider uppercase">
              STORE
            </span>
            <div className="w-6 h-6 rounded-full bg-[#1b2b16] flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <svg 
                className="w-3.5 h-3.5 text-white" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </a>

        </div>

        {/* Right Column: Staggered Partner Logos Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          {/* Left Column of Logos */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {column1Partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-[10px] p-8 sm:p-10 flex items-center justify-center h-[180px] sm:h-[220px] shadow-[4px_4px_14.5px_-3px_#00000026] transition-all duration-300"
                style={{ boxShadow: '4px 4px 14.5px -3px #00000026' }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 sm:max-h-20 w-auto max-w-[80%] object-contain"
                />
              </div>
            ))}
          </div>

          {/* Right Column of Logos (Staggered / Offset vertically on desktop) */}
          <div className="flex flex-col gap-6 sm:gap-8 sm:mt-12 lg:mt-16">
            {column2Partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-[10px] p-8 sm:p-10 flex items-center justify-center h-[180px] sm:h-[220px] shadow-[4px_4px_14.5px_-3px_#00000026] transition-all duration-300"
                style={{ boxShadow: '4px 4px 14.5px -3px #00000026' }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 sm:max-h-20 w-auto max-w-[80%] object-contain"
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default OurPartnersSection;
