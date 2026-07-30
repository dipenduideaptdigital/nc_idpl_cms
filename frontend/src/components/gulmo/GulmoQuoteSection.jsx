import React from 'react';
import tableJar from '../../assets/nc_home/table_jar.png';
import quoteIcon from '../../assets/nc_logo/quote.png';

const GulmoQuoteSection = () => {
  return (
    <section className="w-full relative min-h-[500px] sm:min-h-[550px] md:min-h-[620px] lg:min-h-[680px] flex items-center justify-end overflow-hidden font-kanit select-none">
      {/* Background Image: table_jar */}
      <img
        src={tableJar}
        alt="Terrarium on Table"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Subtle overlay for small screens to ensure readability if stacked */}
      <div className="absolute inset-0 bg-black/20 lg:bg-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16  mr-5 flex justify-center lg:justify-end py-12 md:py-20">
        {/* Quote Card with background #06232B (semi-transparent) */}
        <div className="w-full max-w-lg lg:max-w-[470px] bg-[#06232B]/80 backdrop-blur-md p-8 sm:p-10 md:p-12 lg:p-18 shadow-2xl ">
          {/* Quote Icon from nc_logo/quote.png */}
          <div className="mb-6 md:mb-8">
            <img
              src={quoteIcon}
              alt="Quote"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>

          {/* Quote Body */}
          <blockquote className="space-y-6">
            <p className="text-white/95 text-lg sm:text-xl md:text-2xl lg:text-[20px] font-normal leading-relaxed md:leading-[1.55] tracking-wide">
              The forest is a peculiar organism of unlimited kindness and benevolence that makes no demands for its sustenance and extends generously the products of its life activity; it affords protection to all beings, offering shade even to the axe-man who destroys it.
            </p>

            {/* Author */}
            <cite className="block text-white font-bold italic text-base sm:text-lg md:text-xl not-italic tracking-wide pt-2">
              <span className="italic font-bold">Gautama Buddha</span>
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default GulmoQuoteSection;
