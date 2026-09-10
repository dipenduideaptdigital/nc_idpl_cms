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
    <div className="w-auto flex-shrink-0 h-full bg-white text-zinc-900 relative flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-0 z-10 select-none font-kanit overflow-hidden">

      {/* Top-Right Decorative Leaf */}
      <div className="absolute -top-10 -right-10 pointer-events-none opacity-50 z-0">
        <img
          src={topLeaf}
          alt="Leaf Decoration"
          className="w-72 sm:w-96 md:w-[260px] rotate-90 h-auto object-contain"
        />
      </div>

      {/* Main Content Container starting at mt-28 to match card grid */}
      <div className="relative z-10 flex flex-row items-center my-auto font-kanit mt-28 pl-4 sm:pl-6 lg:pl-2 pr-12 lg:pr-16 gap-8 lg:gap-12">

        {/* Left Section: 3 Core Team Leaders Stacked Vertically with Large Square Photos */}
        <div className="w-[420px] sm:w-[520px] lg:w-[600px] flex-shrink-0 space-y-4 sm:space-y-6">

          {/* Member 1: Col. Basudev Mitra */}
          <div className="flex flex-row items-start space-x-4 sm:space-x-6">
            <img
              src={data?.image1 ? resolveAssetUrl(data.image1) : team2Img}
              alt="Col. Basudev Mitra"
              className="w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 aspect-square object-cover flex-shrink-0 shadow-sm border border-zinc-100"
            />
            <div className="pt-1">
              <h3 className="font-kanit font-semibold text-base sm:text-lg lg:text-xl text-[#7BA641] tracking-wide uppercase mb-1 sm:mb-2">
                {leader1Name}
              </h3>
              <p className="text-zinc-600 text-xs sm:text-[13px] leading-relaxed font-normal whitespace-pre-wrap">
                {leader1Bio}
              </p>
            </div>
          </div>

          {/* Member 2: Partha Chakraborty */}
          <div className="flex flex-row items-start space-x-4 sm:space-x-6">
            <img
              src={data?.image2 ? resolveAssetUrl(data.image2) : team3Img}
              alt="Partha Chakraborty"
              className="w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 aspect-square object-cover flex-shrink-0 shadow-sm border border-zinc-100"
            />
            <div className="pt-1">
              <h3 className="font-kanit font-semibold text-base sm:text-lg lg:text-xl text-[#7BA641] tracking-wide uppercase mb-1 sm:mb-2">
                {leader2Name}
              </h3>
              <p className="text-zinc-600 text-xs sm:text-[13px] leading-relaxed font-normal whitespace-pre-wrap">
                {leader2Bio}
              </p>
            </div>
          </div>

          {/* Member 3: Sanjoy Dutta */}
          <div className="flex flex-row items-start space-x-4 sm:space-x-6">
            <img
              src={data?.image3 ? resolveAssetUrl(data.image3) : team4Img}
              alt="Sanjoy Dutta"
              className="w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 aspect-square object-cover flex-shrink-0 shadow-sm border border-zinc-100"
            />
            <div className="pt-1">
              <h3 className="font-kanit font-semibold text-base sm:text-lg lg:text-xl text-[#7BA641] tracking-wide uppercase mb-1 sm:mb-2">
                {leader3Name}
              </h3>
              <p className="text-zinc-600 text-xs sm:text-[13px] leading-relaxed font-normal whitespace-pre-wrap">
                {leader3Bio}
              </p>
            </div>
          </div>

        </div>

        {/* Right Section: Wide Cut-Out Team Group Photo (Increased Height & Scale) */}
        <div className="w-[580px] sm:w-[800px] lg:w-[980px] flex-shrink-0 relative flex items-end justify-start h-full pb-0 -ml-50 overflow-visible mr-60">
          <img
            src={data?.groupImage ? resolveAssetUrl(data.groupImage) : team5Img}
            alt="NatureCube Team Group"
            className="w-full h-auto max-h-[100vh] object-contain object-bottom drop-shadow-xl scale-115 sm:scale-125 lg:scale-138 origin-bottom-left"
          />
        </div>

      </div>

    </div>
  );
};

export default AboutTeamMembersPanel;