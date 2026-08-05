import React from 'react';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';
import gallery3 from '../../assets/nc_home/gallery3.png';
import singleBush from '../../assets/nc_logo/brush2.png';

const AboutAwardsPanel = ({ data }) => {
  const headingLine1 = data?.headingLine1 || "THE AWARDS WON";
  const headingLine2 = data?.headingLine2 || "BY OUR PROJECTS.";
  const subtext = data?.subtext || "Evolving from artificial decor to natural aquascaping, our journey was shaped by encounters with legendary aquarist Takashi Amano. Inspired by his vision, we founded NatureCube in 2010.";

  const awardsList = data?.awards || [
    {
      id: 1,
      image: gallery1,
      title: "PRIMAL BURST",
      subtitle: "IAPLC Rank 20, 2020"
    },
    {
      id: 2,
      image: gallery2,
      title: "PRIMAL BURST",
      subtitle: "IAPLC Rank 20, 2020"
    },
    {
      id: 3,
      image: gallery3,
      title: "PRIMAL BURST",
      subtitle: "IAPLC Rank 20, 2020"
    }
  ];

  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-900 flex-shrink-0 relative flex flex-col justify-between pt-20 sm:pt-24 pb-12 sm:pb-16 px-6 sm:px-12 lg:px-20 z-10 select-none font-kanit overflow-hidden">
      
      {/* Top Right Single Bush Background Decor Image */}
      <div className="absolute -top-16 -right-16 w-[340px] sm:w-[440px] lg:w-[500px] pointer-events-none opacity-40 z-0">
        <img 
          src={singleBush} 
          alt="Background Decor" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-6xl w-full my-auto flex flex-col space-y-8 sm:space-y-12">
        
        {/* Header Title & Subtext */}
        <div className="max-w-2xl space-y-3">
          <h2 className="font-reem-fun text-[#1E293B] font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] uppercase">
            <div>{headingLine1}</div>
            <div>{headingLine2}</div>
          </h2>
          <p className="text-[#6A6A6A] font-medium text-xs sm:text-sm lg:text-base leading-relaxed pt-1 max-w-xl">
            {subtext}
          </p>
        </div>

        {/* 3 Awards Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full pt-2">
          {awardsList.map((item) => (
            <div key={item.id} className="flex flex-col space-y-3 group">
              {/* Image Box */}
              <div className="w-full aspect-[16/10] bg-zinc-200 overflow-hidden shadow-sm border border-zinc-100 rounded-sm relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-0.5 pt-1">
                <h3 className="font-reem-fun font-bold text-xs sm:text-sm tracking-wider uppercase text-zinc-900 leading-tight">
                  {item.title}
                </h3>
                <p className="font-medium text-[11px] sm:text-xs text-zinc-500 tracking-wide uppercase">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Spacer */}
      <div className="h-4" />

    </div>
  );
};

export default AboutAwardsPanel;