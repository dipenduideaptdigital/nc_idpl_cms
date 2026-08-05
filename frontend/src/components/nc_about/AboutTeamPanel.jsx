import React from 'react';
import team1Img from '../../assets/nc_about/team1.png';
import singleBush from '../../assets/nc_logo/brush2.png';

const AboutTeamPanel = ({ data }) => {
  const title = data?.title || "OUR TEAM";
  const statement = data?.statement || "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS WITH LEGENDARY AQUARIST TAKASHI AMANO.";
  const name = data?.name || "GAUTAM GUPTA";
  const role = data?.role || "MENTOR";

  const p1 = data?.p1 || "Gautam Gupta is a committed Nature Advocate, environmental steward, and lifelong aquascaping enthusiast, whose deep-rooted passion for ecological harmony continues to shape the vision and direction of Nature Cube.";
  const p2 = data?.p2 || "As a core mentor to NatureCube, his guidance and vision play a pivotal role in driving the organisation's mission to introduce living, regenerative ecosystems into modern urban environments through Nature Aquariums, Terrariums, and Indoor Gardens.";
  const p3 = data?.p3 || "Leveraging his expertise in aquatic ecology, ecosystem design, and sustainable habitat creation, he has been instrumental in establishing Kolkata's first Natural Aquarium gallery and in forging collaborations with global leaders such as Aqua Design Amano (Japan) and 2Hr Aquarist (Singapore).";
  const p4 = data?.p4 || "Through outreach programs, workshops, his YouTube channel, he has built a vibrant community of students, hobbyists, and environmentally conscious individuals, inspiring them to appreciate, recreate, and responsibly care for natural ecosystems across diverse environments.";
  const p5 = data?.p5 || "With 28+ years of corporate experience in IT consulting, he add immense values in terms of business, leadership and strategy.";

  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-900 flex-shrink-0 relative flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 sm:py-20 select-none font-kanit overflow-hidden">

      {/* Background Single Bush Decor (Bottom Left) */}
      <div className="absolute bottom-0 left-0 pointer-events-none opacity-20 z-0">
        <img
          src={singleBush}
          alt="Bush Decoration"
          className="w-72 sm:w-96 md:w-[480px] h-auto object-contain"
        />
      </div>

      {/* Main Grid Content Container */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-9 items-start relative z-10">

        {/* Left Column: OUR TEAM Title & Bold Statement */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-8">
          <h2 className="font-reem-fun font-bold text-3xl sm:text-4xl lg:text-[52px] mt-10   text-[#000000] tracking-tight uppercase leading-none">
            {title}
          </h2>
          <p className="font-reem-fun font-semibold text-base sm:text-lg lg:text-[20px] text-[#6A6A6A] leading-1.2 uppercase tracking-tight max-w-md">
            {statement}
          </p>
        </div>

        {/* Center Column: Portrait Photo with Overlapping Name Badge */}
        <div className="lg:col-span-4 relative flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/4] overflow-visible shadow-xl rounded-sm">
            <img
              src={team1Img}
              alt="Gautam Gupta - Mentor"
              className="w-full h-full object-cover rounded-sm"
            />
            {/* White Overlapping Badge extending outside to the left */}
            <div className="absolute -left-5 sm:-left-16 bottom-6 sm:bottom-8 bg-white px-5 sm:px-8 py-3 sm:py-2 shadow-2xl rounded-sm z-20 border border-zinc-100/80">
              <span className="block font-reem-fun font-bold text-lg sm:text-xl text-[#7BA641] tracking-wide uppercase leading-tight">
                {name}
              </span>
              <span className="block font-kanit font-semibold text-xs text-zinc-500 tracking-widest uppercase mt-0.5">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative Body Paragraphs */}
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 text-xs sm:text-[15px] text-zinc-600 leading-relaxed max-w-lg">
          <p>{p1}</p>
          <p>{p2}</p>
          <p>{p3}</p>
          <p>{p4}</p>
          <p>{p5}</p>
        </div>

      </div>

    </div>
  );
};

export default AboutTeamPanel;