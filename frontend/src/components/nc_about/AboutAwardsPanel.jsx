import React from 'react';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';
import gallery3 from '../../assets/nc_home/gallery3.png';
import singleBush from '../../assets/nc_logo/brush2.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutAwardsPanel = ({ data }) => {
  const headingLine1 = data?.headingLine1 || "THE AWARDS WON";
  const headingLine2 = data?.headingLine2 || "BY OUR PROJECTS.";
  const subtext = data?.subtext || "Evolving from artificial decor to natural aquascaping, our journey was shaped by encounters with legendary aquarist Takashi Amano. Inspired by his vision, we founded NatureCube in 2010.";

  const dynamicAwards = data?.awards?.length > 0 ? data.awards : null;
  const fallbacks = [gallery1, gallery2, gallery3];

  const awardsList = dynamicAwards?.map((award, index) => ({
    id: index + 1,
    image: award.image ? resolveAssetUrl(award.image) : fallbacks[index % 3],
    title: award.title,
    subtitle: award.subtitle
  })) || [
      { id: 1, image: gallery1, title: "PRIMAL BURST", subtitle: "IAPLC Rank 20, 2020" },
      { id: 2, image: gallery2, title: "PRIMAL BURST", subtitle: "IAPLC Rank 20, 2020" },
      { id: 3, image: gallery3, title: "PRIMAL BURST", subtitle: "IAPLC Rank 20, 2020" }
    ];

  return (
    <div className="w-[82vw] min-w-[82vw] h-full bg-white text-zinc-900 flex-shrink-0 relative flex flex-col justify-between pt-20 sm:pt-24 pb-12 sm:pb-16 px-6 sm:px-10 lg:px-14 z-10 select-none font-kanit overflow-hidden">

      {/* Top Right Single Bush Background Decor Image */}
      {/* <div className="absolute -top-16 -right-16 w-[340px] sm:w-[440px] lg:w-[500px] pointer-events-none opacity-40 z-0">
        <img
          src={singleBush}
          alt="Background Decor"
          className="w-full h-auto object-contain"
        />
      </div> */}

      {/* Main Content Area */}
      <div className="relative z-10 max-w-6xl w-full my-auto flex flex-col space-y-8 sm:space-y-10 font-kanit ml-10">

        {/* Header Title & Subtext */}
        <div className="max-w-2xl space-y-3 font-kanit font-normal">
          <h2 className="font-kanit font-normal text-[#1E293B] text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-[1.15] uppercase">
            <div>{headingLine1}</div>
            <div>{headingLine2}</div>
          </h2>
          <div
            className="font-kanit font-normal text-[#6A6A6A] text-xs sm:text-sm lg:text-base leading-relaxed pt-1 max-w-xl [&>p]:mb-0"
            dangerouslySetInnerHTML={{ __html: subtext }}
          />
        </div>

        {/* Awards Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full pt-2 font-kanit font-normal mt-10">
          {awardsList.map((item) => (
            <div key={item.id} className="flex flex-col space-y-3 group">
              {/* Image Box */}
              <div className="w-full aspect-[4/3] sm:aspect-[3/2] bg-zinc-200 overflow-hidden shadow-sm border border-zinc-100 rounded-sm relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-0.5 pt-1 font-kanit font-normal">
                <h3 className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-zinc-900 leading-tight">
                  {item.title}
                </h3>
                <p className="font-kanit font-normal text-[11px] sm:text-xs text-zinc-500 tracking-wide uppercase">
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