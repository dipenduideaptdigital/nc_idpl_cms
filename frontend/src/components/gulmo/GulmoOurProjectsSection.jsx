import React from 'react';
import lab1 from '../../assets/nc_home/lab1.png';
import lab2 from '../../assets/nc_home/lab2.png';
import bush3 from '../../assets/nc_logo/bush3.png';

const GulmoOurProjectsSection = ({ data }) => {
  return (
    <section className="w-full bg-[#fcfdfa] text-[#1f2937] py-16 sm:py-24 md:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden select-none font-kanit">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Background Organic Watercolor Splash */}
        <div className="absolute top-140 left-120 -translate-x-1/4 -translate-y-1/3 w-[360px] sm:w-[480px] md:w-[500px] pointer-events-none z-0 opacity-90">
          <img
            src={data?.bgSplash || bush3}
            alt="Organic Green Watercolor Splash"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Two-Column Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-start relative z-10">

          {/* Left Column: Heading, Text & Bottom Image */}
          <div className="md:col-span-6 space-y-6 sm:space-y-10 md:space-y-12">

            {/* Title & Description Header */}
            <div className="space-y-4 sm:space-y-6 max-w-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#131f24] uppercase font-kanit">
                {data?.title || 'OUR PROJECTS'}
              </h2>
              <p className="text-base sm:text-lg md:text-[19px] lg:text-[21px] leading-relaxed sm:leading-[1.65] text-[#555a60] font-light whitespace-pre-wrap">
                {data?.description || 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.'}
              </p>
            </div>

            {/* Bottom-Left Image (Lush Plant Wall) */}
            <div className="pt-3 sm:pt-6 md:pt-10 ml-0 sm:ml-4 md:ml-5">
              <div className="w-full max-w-[480px] shadow-lg rounded-xs overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src={data?.imageLeft || lab2}
                  alt="Lush Aquascape Terrarium Wall"
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Top Image (Glass Cube Terrarium) */}
          <div className="md:col-span-6 flex justify-start md:justify-end pt-3 md:pt-5">
            <div className="w-full max-w-[480px] shadow-lg rounded-xs overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
              <img
                src={data?.imageRight || lab1}
                alt="Glass Cube Terrarium with Light"
                className="w-full h-auto object-cover block"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GulmoOurProjectsSection;