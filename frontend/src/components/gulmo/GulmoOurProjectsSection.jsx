import React from 'react';
import lab1 from '../../assets/nc_home/lab1.png';
import lab2 from '../../assets/nc_home/lab2.png';
import bush3 from '../../assets/nc_logo/bush3.png';

const GulmoOurProjectsSection = () => {
  return (
    <section className="w-full bg-[#fcfdfa] text-[#1f2937] py-16 sm:py-24 md:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden select-none font-kanit">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Background Organic Watercolor Splash (bush3.png) */}
        <div className="absolute top-140 left-120 -translate-x-1/4 -translate-y-1/3 w-[360px] sm:w-[480px] md:w-[500px] pointer-events-none z-0 opacity-90">
          <img
            src={bush3}
            alt="Organic Green Watercolor Splash"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Two-Column Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start relative z-10">
          
          {/* Left Column: Heading, Text & Bottom Image (lab1.png) */}
          <div className="lg:col-span-6 space-y-8 sm:space-y-12">
            
            {/* Title & Description Header */}
            <div className="space-y-6 max-w-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#131f24] uppercase font-kanit">
                OUR PROJECTS
              </h2>
              <p className="text-base sm:text-lg md:text-[21px] leading-relaxed sm:leading-[1.65] text-[#555a60] font-light">
                Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.
              </p>
            </div>

            {/* Bottom-Left Image (lab1.png - Lush Plant Wall) */}
            <div className="pt-5 sm:pt-10 ml-5">
              <div className="w-full max-w-[480px] shadow-lg rounded-xs overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src={lab2}
                  alt="Lush Aquascape Terrarium Wall"
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Top Image (lab2.png - Glass Cube Terrarium) */}
          <div className="lg:col-span-6 flex justify-start lg:justify-end pt-5 lg:pt-5">
            <div className="w-full max-w-[480px] shadow-lg rounded-xs overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
              <img
                src={lab1}
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