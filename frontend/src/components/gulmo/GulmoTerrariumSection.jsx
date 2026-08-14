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
    <section className="w-full bg-white select-none font-kanit py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-14 md:space-y-20">
        
        {/* Top Part: Large Featured Jar & 3 Category Items */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center mt-12 md:mt-10">
          
          {/* Left Column: Glass Cylinder Jar with Leaf Background Accents */}
          <div className="md:col-span-6 relative flex justify-center md:justify-start">
            {/* Main Big Leaf (Leaf.png) on top-left */}
            <div className="absolute -top-28 sm:-top-36 md:-top-48 lg:-top-56 -left-2 sm:-left-12 md:-left-20 lg:-left-28 w-48 sm:w-72 md:w-80 lg:w-96 pointer-events-none z-0">
              <img
                src={LeafImg}
                alt="Main Watercolor Leaf"
                className="w-full h-auto object-contain block transform -rotate-3"
              />
            </div>

            {/* Small Secondary Leaf (leaf2.png) on top-right */}
            <div className="absolute -top-16 sm:-top-22 md:-top-20 lg:-top-24 left-24 sm:left-28 md:left-20 lg:left-24 w-28 sm:w-44 md:w-48 lg:w-56 pointer-events-none z-0">
              <img
                src={leaf2Img}
                alt="Secondary Watercolor Leaf"
                className="w-full h-auto object-contain block transform rotate-12 opacity-95"
              />
            </div>

            {/* Main Featured DOOA Jar */}
            <div className="relative z-10 w-[200px] sm:w-[260px] md:w-[300px] lg:w-[340px] mt-4 sm:mt-12 md:mt-16 lg:mt-20 mb-2">
              <img
                src={data?.mainJarImage || jar1}
                alt="DOOA Glass Terrarium"
                className="w-full h-auto object-contain drop-shadow-xl hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column: 3 Category Feature Items */}
          <div className="md:col-span-6 space-y-6 sm:space-y-8 md:space-y-10">

            
            {/* 1. Terrariums */}
            <div className="flex items-start gap-4 sm:gap-5 group">
              <div className="w-12 sm:w-16 h-12 sm:h-16 shrink-0 flex items-center justify-center pt-0.5">
                <img
                  src={data?.cat1Icon || terraIcon}
                  alt="Terrariums"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-kanit text-lg sm:text-2xl font-bold text-[#1f2937] tracking-tight">
                  {data?.cat1Title || 'Terrariums'}
                </h3>
                <p className="font-kanit text-xs sm:text-base font-light text-[#6b7280] leading-relaxed max-w-md whitespace-pre-wrap">
                  {data?.cat1Desc || 'Elevate your indoor spaces with lush, green gardens tailored to thrive in various home environments, promoting health and well-being.'}
                </p>
              </div>
            </div>

            {/* 2. Paludariums */}
            <div className="flex items-start gap-4 sm:gap-5 group">
              <div className="w-12 sm:w-16 h-12 sm:h-16 shrink-0 flex items-center justify-center pt-0.5">
                <img
                  src={data?.cat2Icon || paluIcon}
                  alt="Paludariums"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-kanit text-lg sm:text-2xl font-bold text-[#1f2937] tracking-tight">
                  {data?.cat2Title || 'Paludariums'}
                </h3>
                <p className="font-kanit text-xs sm:text-base font-light text-[#6b7280] leading-relaxed max-w-md whitespace-pre-wrap">
                  {data?.cat2Desc || 'Experience the best of both worlds with our paludariums, which combine aquatic and terrestrial elements to create a unique and captivating display.'}
                </p>
              </div>
            </div>

            {/* 3. Indoor Gardens */}
            <div className="flex items-start gap-4 sm:gap-5 group">
              <div className="w-12 sm:w-16 h-12 sm:h-16 shrink-0 flex items-center justify-center pt-0.5">
                <img
                  src={data?.cat3Icon || indoorIcon}
                  alt="Indoor Gardens"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-kanit text-lg sm:text-2xl font-bold text-[#1f2937] tracking-tight">
                  {data?.cat3Title || 'Indoor Gardens'}
                </h3>
                <p className="font-kanit text-xs sm:text-base font-light text-[#6b7280] leading-relaxed max-w-md whitespace-pre-wrap">
                  {data?.cat3Desc || 'Transform any space with our custom-designed aquariums that mimic natural aquatic ecosystems, providing a stunning visual and calming presence.'}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Part: 4 Terrarium / Plant Jars (Stacked Cards on Small Screens, Clean 4-Col Grid on Medium & Desktop) */}
        <div className="pt-6 md:pt-10">
          <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12 items-center md:items-end justify-items-center max-w-sm sm:max-w-xl md:max-w-5xl mx-auto">

            
            {/* Jar 1 / Card 1 */}
            <div className="w-full flex flex-col items-center justify-between text-center bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 md:bg-transparent md:backdrop-blur-none md:rounded-none md:p-0 md:border-none md:shadow-none md:hover:shadow-none md:justify-center group">
              <div className="w-full h-52 sm:h-60 md:h-64 flex items-center justify-center p-2 md:p-0 group-hover:scale-105 transition-transform duration-500">
                <img
                  src={data?.bottomJar1 || jar2}
                  alt="Slim Glass Terrarium"
                  className="max-h-full max-w-full md:h-64 md:w-auto object-contain drop-shadow-md"
                />
              </div>
              {/* Card Label visible only on smaller screens (< md) */}
              <div className="md:hidden mt-3 pt-2.5 border-t border-gray-100/80 w-full space-y-0.5">
                <h4 className="font-kanit text-sm sm:text-base font-bold text-[#1f2937] tracking-tight">
                  {data?.bottomJar1Title || 'Glass Terrarium'}
                </h4>
                <p className="font-kanit text-xs text-[#6b7280] font-light">
                  {data?.bottomJar1Sub || 'Slim Design'}
                </p>
              </div>
            </div>

            {/* Jar 2 / Card 2 */}
            <div className="w-full flex flex-col items-center justify-between text-center bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 md:bg-transparent md:backdrop-blur-none md:rounded-none md:p-0 md:border-none md:shadow-none md:hover:shadow-none md:justify-center group">
              <div className="w-full h-52 sm:h-60 md:h-68 flex items-center justify-center p-2 md:p-0 group-hover:scale-105 transition-transform duration-500">
                <img
                  src={data?.bottomJar2 || jar3}
                  alt="Teardrop Glass Terrarium"
                  className="max-h-full max-w-full md:h-68 md:w-auto object-contain drop-shadow-md"
                />
              </div>
              {/* Card Label visible only on smaller screens (< md) */}
              <div className="md:hidden mt-3 pt-2.5 border-t border-gray-100/80 w-full space-y-0.5">
                <h4 className="font-kanit text-sm sm:text-base font-bold text-[#1f2937] tracking-tight">
                  {data?.bottomJar2Title || 'Paludarium Jar'}
                </h4>
                <p className="font-kanit text-xs text-[#6b7280] font-light">
                  {data?.bottomJar2Sub || 'Indoor Ecosystem'}
                </p>
              </div>
            </div>

            {/* Jar 3 / Card 3 */}
            <div className="w-full flex flex-col items-center justify-between text-center bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 md:bg-transparent md:backdrop-blur-none md:rounded-none md:p-0 md:border-none md:shadow-none md:hover:shadow-none md:justify-center group">
              <div className="w-full h-52 sm:h-60 md:h-52 flex items-center justify-center p-2 md:p-0 group-hover:scale-105 transition-transform duration-500">
                <img
                  src={data?.bottomJar3 || jar4}
                  alt="Jewel Orchid Plant Dish"
                  className="max-h-full max-w-full md:h-52 md:w-auto object-contain drop-shadow-md"
                />
              </div>
              {/* Card Label visible only on smaller screens (< md) */}
              <div className="md:hidden mt-3 pt-2.5 border-t border-gray-100/80 w-full space-y-0.5">
                <h4 className="font-kanit text-sm sm:text-base font-bold text-[#1f2937] tracking-tight">
                  {data?.bottomJar3Title || 'Jewel Orchid'}
                </h4>
                <p className="font-kanit text-xs text-[#6b7280] font-light">
                  {data?.bottomJar3Sub || 'Botanical Vessel'}
                </p>
              </div>
            </div>

            {/* Jar 4 / Card 4 */}
            <div className="w-full flex flex-col items-center justify-between text-center bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 md:bg-transparent md:backdrop-blur-none md:rounded-none md:p-0 md:border-none md:shadow-none md:hover:shadow-none md:justify-center group">
              <div className="w-full h-52 sm:h-60 md:h-64 flex items-center justify-center p-2 md:p-0 group-hover:scale-105 transition-transform duration-500">
                <img
                  src={data?.bottomJar4 || jar5}
                  alt="Tall Wall Glass Terrarium"
                  className="max-h-full max-w-full md:h-64 md:w-auto object-contain drop-shadow-md"
                />
              </div>
              {/* Card Label visible only on smaller screens (< md) */}
              <div className="md:hidden mt-3 pt-2.5 border-t border-gray-100/80 w-full space-y-0.5">
                <h4 className="font-kanit text-sm sm:text-base font-bold text-[#1f2937] tracking-tight">
                  {data?.bottomJar4Title || 'Aqua Terrarium'}
                </h4>
                <p className="font-kanit text-xs text-[#6b7280] font-light">
                  {data?.bottomJar4Sub || 'Nature Showcase'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default GulmoTerrariumSection;