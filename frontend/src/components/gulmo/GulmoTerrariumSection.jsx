import React from 'react';
import jar1 from '../../assets/nc_home/jar1.png';
import jar2 from '../../assets/nc_home/jar2.png';
import jar3 from '../../assets/nc_home/jar3.png';
import jar4 from '../../assets/nc_home/jar4.png';
import jar5 from '../../assets/nc_home/jar5.png';

import LeafImg from '../../assets/nc_logo/Leaf.png';
import leaf2Img from '../../assets/nc_logo/leaf2.png';
import terraIcon from '../../assets/nc_logo/terra.png';
import paluIcon from '../../assets/nc_logo/palu.png';
import indoorIcon from '../../assets/nc_logo/indoor.png';

const GulmoTerrariumSection = ({ data }) => {
  return (
    <section className="w-full bg-white select-none font-kanit py-16 md:py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-20 md:space-y-28">
        
        {/* Top Part: Large Featured Jar & 3 Category Items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center mt-18">
          
          {/* Left Column: Glass Cylinder Jar with Leaf Background Accents */}
          <div className="lg:col-span-6 relative flex justify-center  lg:justify-start">
            {/* Main Big Leaf (Leaf.png) on top-left */}
            <div className="absolute -top-25 sm:-top-36 md:-top-58 -left-10 sm:-left-16 md:-left-30 w-60 sm:w-80 md:w-96 pointer-events-none z-0">
              <img
                src={LeafImg}
                alt="Main Watercolor Leaf"
                className="w-full h-auto object-contain block transform -rotate-3"
              />
            </div>

            {/* Small Secondary Leaf (leaf2.png) on top-right */}
            <div className="absolute -top-16 sm:-top-22 md:-top-24 left-20 sm:left-28 md:left-23 w-36 sm:w-48 md:w-56 pointer-events-none z-0">
              <img
                src={leaf2Img}
                alt="Secondary Watercolor Leaf"
                className="w-full h-auto object-contain block transform rotate-12 opacity-95"
              />
            </div>

            {/* Main Featured DOOA Jar */}
            <div className="relative z-10 w-[240px] sm:w-[300px] md:w-[340px] ml-5  sm:mt-20">
              <img
                src={data?.mainJarImage || jar1}
                alt="DOOA Glass Terrarium"
                className="w-full h-auto object-contain drop-shadow-xl hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column: 3 Category Feature Items */}
          <div className="lg:col-span-6 space-y-8 md:space-y-10 mb-50">
            
            {/* 1. Terrariums */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 sm:w-16 h-14 sm:h-16 shrink-0 flex items-center justify-center pt-0.5">
                <img
                  src={data?.cat1Icon || terraIcon}
                  alt="Terrariums"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-kanit text-xl sm:text-2xl font-bold text-[#1f2937] tracking-tight">
                  {data?.cat1Title || 'Terrariums'}
                </h3>
                <p className="font-kanit text-sm sm:text-base font-light text-[#6b7280] leading-relaxed max-w-md whitespace-pre-wrap">
                  {data?.cat1Desc || 'Elevate your indoor spaces with lush, green gardens tailored to thrive in various home environments, promoting health and well-being.'}
                </p>
              </div>
            </div>

            {/* 2. Paludariums */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 sm:w-16 h-14 sm:h-16 shrink-0 flex items-center justify-center pt-0.5">
                <img
                  src={data?.cat2Icon || paluIcon}
                  alt="Paludariums"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-kanit text-xl sm:text-2xl font-bold text-[#1f2937] tracking-tight">
                  {data?.cat2Title || 'Paludariums'}
                </h3>
                <p className="font-kanit text-sm sm:text-base font-light text-[#6b7280] leading-relaxed max-w-md whitespace-pre-wrap">
                  {data?.cat2Desc || 'Experience the best of both worlds with our paludariums, which combine aquatic and terrestrial elements to create a unique and captivating display.'}
                </p>
              </div>
            </div>

            {/* 3. Indoor Gardens */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 sm:w-16 h-14 sm:h-16 shrink-0 flex items-center justify-center pt-0.5">
                <img
                  src={data?.cat3Icon || indoorIcon}
                  alt="Indoor Gardens"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-kanit text-xl sm:text-2xl font-bold text-[#1f2937] tracking-tight">
                  {data?.cat3Title || 'Indoor Gardens'}
                </h3>
                <p className="font-kanit text-sm sm:text-base font-light text-[#6b7280] leading-relaxed max-w-md whitespace-pre-wrap">
                  {data?.cat3Desc || 'Transform any space with our custom-designed aquariums that mimic natural aquatic ecosystems, providing a stunning visual and calming presence.'}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Part: 4 Terrarium / Plant Jars Grid */}
        <div className="pt-6 md:pt-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-12 items-end justify-items-center max-w-5xl mx-auto">
            
            {/* Jar 2 */}
            <div className="w-full flex justify-center hover:scale-105 transition-transform duration-500">
              <img
                src={data?.bottomJar1 || jar2}
                alt="Slim Glass Terrarium"
                className="h-44 sm:h-52 md:h-64 w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Jar 3 */}
            <div className="w-full flex justify-center hover:scale-105 transition-transform duration-500">
              <img
                src={data?.bottomJar2 || jar3}
                alt="Teardrop Glass Terrarium"
                className="h-48 sm:h-56 md:h-68 w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Jar 4 */}
            <div className="w-full flex justify-center hover:scale-105 transition-transform duration-500">
              <img
                src={data?.bottomJar3 || jar4}
                alt="Jewel Orchid Plant Dish"
                className="h-36 sm:h-44 md:h-52 w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Jar 5 */}
            <div className="w-full flex justify-center hover:scale-105 transition-transform duration-500">
              <img
                src={data?.bottomJar4 || jar5}
                alt="Tall Wall Glass Terrarium"
                className="h-44 sm:h-52 md:h-64 w-auto object-contain drop-shadow-md"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default GulmoTerrariumSection;