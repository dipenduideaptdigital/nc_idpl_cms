import React from 'react';
import team2Img from '../../assets/nc_about/team2.png';
import team3Img from '../../assets/nc_about/team3.png';
import team4Img from '../../assets/nc_about/team4.png';
import team5Img from '../../assets/nc_about/team5.png';
import topLeaf from '../../assets/nc_logo/bush3.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutTeamMembersPanel = ({ data }) => {
  const leader1Name = data?.leader1Name || "COL. BASUDEV MITRA";
  const leader1Bio = data?.leader1Bio || "Colonel Basudev Mitra retired from the army in 2008 after 23 years with the Gurkha Rifles and then worked with Aditya Birla Group for 12 years overseeing mine security and corporate liaison. Now superannuated, he pursues his passion for gardening, particularly bonsais, and enjoys road travel.";

  const leader2Name = data?.leader2Name || "PARTHA CHAKRABORTY";
  const leader2Bio = data?.leader2Bio || "Partha, a management graduate with expertise in Telecom Infrastructure and Value Retail, has spent 15 years mastering aquascaping. An internationally awarded nature-style aquarium artist, he leads our venture with creative vision, ecological expertise, and bespoke sustainable designs.";

  const leader3Name = data?.leader3Name || "SANJOY DUTTA";
  const leader3Bio = data?.leader3Bio || "Colonel Basudev Mitra served 23 years with the Gurkha Rifles before retiring in 2008, followed by 12 years with the Aditya Birla Group in mine security and corporate liaison. He now heads the finance team at Naturecube while pursuing his passion for bonsai gardening and road travel.";

  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-900 flex-shrink-0 relative flex flex-col justify-center px-6 sm:px-12 lg:px-16 pt-20 sm:pt-24 pb-12 select-none font-kanit overflow-hidden">

      {/* Top-Right Decorative Leaf */}
      <div className="absolute -top-10 -right-10 pointer-events-none opacity-50 z-0">
        <img
          src={topLeaf}
          alt="Leaf Decoration"
          className="w-72 sm:w-96 md:w-[460px] h-auto object-contain"
        />
      </div>

      {/* Main Grid Content Container */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">

        {/* Left Column: 3 Core Team Leaders Stacked Vertically */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8">

          {/* Member 1: Col. Basudev Mitra */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <img
              src={data?.image1 ? resolveAssetUrl(data.image1) : team2Img}
              alt="Col. Basudev Mitra"
              className="w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 rounded-sm object-cover flex-shrink-0 shadow-md border border-zinc-100"
            />
            <div>
              <h3 className="font-reem-fun font-bold text-base sm:text-lg lg:text-xl text-[#7BA641] tracking-wide uppercase mb-1">
                {leader1Name}
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-md font-normal whitespace-pre-wrap">
                {leader1Bio}
              </p>
            </div>
          </div>

          {/* Member 2: Partha Chakraborty */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <img
              src={data?.image2 ? resolveAssetUrl(data.image2) : team3Img}
              alt="Partha Chakraborty"
              className="w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 rounded-sm object-cover flex-shrink-0 shadow-md border border-zinc-100"
            />
            <div>
              <h3 className="font-reem-fun font-bold text-base sm:text-lg lg:text-xl text-[#7BA641] tracking-wide uppercase mb-1">
                {leader2Name}
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-md font-normal whitespace-pre-wrap">
                {leader2Bio}
              </p>
            </div>
          </div>

          {/* Member 3: Sanjoy Dutta */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <img
              src={data?.image3 ? resolveAssetUrl(data.image3) : team4Img}
              alt="Sanjoy Dutta"
              className="w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 rounded-sm object-cover flex-shrink-0 shadow-md border border-zinc-100"
            />
            <div>
              <h3 className="font-reem-fun font-bold text-base sm:text-lg lg:text-xl text-[#7BA641] tracking-wide uppercase mb-1">
                {leader3Name}
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-md font-normal whitespace-pre-wrap">
                {leader3Bio}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Wide Cut-Out Team Group Photo (Increased size) */}
        <div className="lg:col-span-6 relative flex items-center justify-center h-full z-10">
          <div className="relative w-full flex justify-center items-center">
            <img
              src={data?.groupImage ? resolveAssetUrl(data.groupImage) : team5Img}
              alt="NatureCube Team Group"
              className="w-full sm:w-[115%] lg:w-[120%] ml-10 max-w-none h-auto max-h-[92vh] object-contain drop-shadow-2xl scale-105 sm:scale-115 lg:scale-125 transition-transform duration-300 origin-center lg:origin-right"
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default AboutTeamMembersPanel;