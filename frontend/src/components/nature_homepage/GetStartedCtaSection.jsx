import React from 'react';

const GetStartedCtaSection = () => {
  return (
    <section className="relative w-full bg-white py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto text-center flex flex-col items-center">
        
        {/* Section Title: LIVING art */}
        <div className="mb-6 flex items-baseline justify-center">
          <span 
            className="font-reem font-bold text-4xl sm:text-5xl lg:text-[64px] text-black leading-[100%] tracking-[0%] uppercase align-middle"
            style={{ fontWeight: 700, verticalAlign: 'middle' }}
          >
            LIVING
          </span>
          <span 
            className="font-reem font-bold text-4xl sm:text-5xl lg:text-[64px] leading-[100%] tracking-[10%] align-middle"
            style={{ fontWeight: 700, verticalAlign: 'middle' }}
          >
            &nbsp;
          </span>
          <span 
            className="font-larken font-normal italic text-5xl sm:text-7xl lg:text-[100px] text-[#7BA641] leading-[100%] tracking-[0%] lowercase align-middle"
            style={{ fontWeight: 400, verticalAlign: 'middle' }}
          >
            art
          </span>
        </div>

        {/* Main Headline */}
        <h2 
          className="font-kanit font-medium text-2xl sm:text-3xl lg:text-[38px] text-zinc-900 text-center align-middle leading-[120%] tracking-[0%] mt-4 max-w-2xl mx-auto mb-4"
          style={{ fontWeight: 500, lineHeight: '110%', letterSpacing: '0%', textAlign: 'center', verticalAlign: 'middle' }}
        >
          It is a long established<br />fact that a reader will be<br />distracted.
        </h2>

        {/* Subtext Paragraph */}
        <p 
          className="font-kanit font-light text-base sm:text-xl text-[#6A6A6A] max-w-3xl  mt-5 mx-auto mb-8 leading-relaxed"
          style={{ fontWeight: 300, color: '#6A6A6A' }}
        >
          It is a long established fact that a reader will be distracted.
        </p>

        {/* Button: LET'S GET STARTED */}
        <a
          href="#contact"
          className="inline-flex items-center justify-center bg-[#7BA641] hover:bg-[#6b9435] text-white font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase px-8 py-3.5 rounded-xs transition-colors shadow-sm"
        >
          LET'S GET STARTED
        </a>

      </div>
    </section>
  );
};

export default GetStartedCtaSection;
