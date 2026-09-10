import React from 'react';
import team1Img from '../../assets/nc_about/team1.png';
import singleBush from '../../assets/nc_logo/bush3.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutTeamPanel = ({ data }) => {
  const title = data?.title || "OUR TEAM";
  const statement = data?.statement || "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS WITH LEGENDARY AQUARIST TAKASHI AMANO.";
  const name = data?.name || "GAUTAM GUPTA";
  const role = data?.role || "MENTOR";

  const description = data?.description || "<p>Gautam Gupta is a committed Nature Advocate, environmental steward, and lifelong aquascaping enthusiast, whose deep-rooted passion for ecological harmony continues to shape the vision and direction of Nature Cube.</p><p>As a core mentor to NatureCube, his guidance and vision play a pivotal role in driving the organisation's mission to introduce living, regenerative ecosystems into modern urban environments through Nature Aquariums, Terrariums, and Indoor Gardens.</p><p>Leveraging his expertise in aquatic ecology, ecosystem design, and sustainable habitat creation, he has been instrumental in establishing Kolkata's first Natural Aquarium gallery and in forging collaborations with global leaders such as Aqua Design Amano (Japan) and 2Hr Aquarist (Singapore).</p><p>Through outreach programs, workshops, his YouTube channel, he has built a vibrant community of students, hobbyists, and environmentally conscious individuals, inspiring them to appreciate, recreate, and responsibly care for natural ecosystems across diverse environments.</p><p>With 28+ years of corporate experience in IT consulting, he add immense values in terms of business, leadership and strategy.</p>";

  return (
    <div className="w-auto min-w-[85vw] lg:min-w-[90vw] h-full bg-white text-zinc-900 flex-shrink-0 relative flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-6 sm:px-10 lg:px-16 z-10 select-none font-kanit overflow-hidden">

      {/* Background Single Bush Decor (Bottom Left) */}
      <div className="absolute bottom-0 left-[-55px] pointer-events-none opacity-65 z-0">
        <img
          src={singleBush}
          alt="Bush Decoration"
          className="w-72 sm:w-96 md:w-[380px] h-auto object-contain"
        />
      </div>

      {/* Main Grid Content Container */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative z-10 my-auto pt-10">

        {/* Left Column: OUR TEAM Title & Bold Statement (Reem Kufi Ink) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between font-reem">
          <h2 className="font-reem font-bold  mb-8  text-3xl sm:text-4xl lg:text-[44px] text-[#1E293B] tracking-tight uppercase leading-none whitespace-nowrap">
            {title}
          </h2>
          <p className="font-kanit font-normal text-sm sm:text-base lg:text-lg text-[#475569] leading-snug uppercase tracking-tight max-w-sm">
            {statement}
          </p>
        </div>

        {/* Center Column: Portrait Photo with Overlapping Name Badge */}
        <div className="lg:col-span-4 relative flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[0.75/1] overflow-visible shadow-lg">
            <img
              src={data?.image ? resolveAssetUrl(data.image) : team1Img}
              alt="Gautam Gupta - Mentor"
              className="w-full h-full object-cover object-top"
            />
            {/* White Overlapping Badge extending outside to the bottom-left */}
            <div className="absolute -left-8 sm:-left-30 bottom-4 sm:bottom-6 bg-white px-6 py-3 shadow-xl z-20 flex flex-col items-end border border-zinc-100 ">
              <span className="block font-reem font-bold text-lg sm:text-xl lg:text-[22px] text-[#7BA641] tracking-wide uppercase leading-none">
                {name}
              </span>
              <span className="block font-kanit font-normal text-xs sm:text-[13px] text-zinc-500 tracking-widest uppercase mt-1 text-right">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative Body Paragraphs (Kanit Regular) */}
        <div
          className="lg:col-span-4 flex flex-col font-kanit font-normal text-xs sm:text-[13px] text-zinc-500 leading-relaxed max-w-lg space-y-3 [&>p]:mb-3"
          dangerouslySetInnerHTML={{ __html: description }}
        />

      </div>

    </div>
  );
};

export default AboutTeamPanel;