import React from 'react';

import handIcon from '../../assets/nc_logo/hand.png';
import solutionIcon from '../../assets/nc_logo/solution.png';
import qualityIcon from '../../assets/nc_logo/quality.png';
import guidanceIcon from '../../assets/nc_logo/guidance.png';

const NatureFeaturesBar = () => {
  const features = [
    {
      icon: handIcon,
      title: '40+ Years',
      subtitle: 'of Experience',
      titleBold: true,
      alt: '40+ Years of Experience',
    },
    {
      icon: solutionIcon,
      title: 'Sustainable',
      subtitle: 'Solutions',
      titleBold: true,
      alt: 'Sustainable Solutions',
    },
    {
      icon: qualityIcon,
      title: 'Focus on',
      subtitle: 'Quality',
      titleBold: false,
      alt: 'Focus on Quality',
    },
    {
      icon: guidanceIcon,
      title: 'Expert',
      subtitle: 'Guidance',
      titleBold: false,
      alt: 'Expert Guidance',
    },
  ];

  return (
    <div className="w-full bg-[#0a1608]/85 backdrop-blur-md border-t border-emerald-900/40 py-4 sm:py-5 md:py-6 px-4 xs:px-6 md:px-12 2xl:px-16 font-kanit">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 lg:gap-0 justify-items-center items-center">
        {features.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-center gap-3 sm:gap-4 py-2.5 xs:py-3 sm:py-2 w-full px-2 sm:px-4 ${
              index !== 0
                ? 'lg:border-l lg:border-white/15'
                : ''
            } ${
              index % 2 === 1
                ? 'xs:border-l xs:border-white/10 lg:border-none'
                : ''
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 2xl:w-14 2xl:h-14 flex-shrink-0 flex items-center justify-center filter brightness-125 contrast-125">
              <img
                src={item.icon}
                alt={item.alt}
                className="w-8 h-8 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 object-contain"
              />
            </div>
            <div className="flex flex-col text-left text-white">
              <span
                className={`font-kanit text-base sm:text-lg md:text-xl 2xl:text-2xl tracking-wide leading-snug ${
                  item.titleBold
                    ? 'font-bold text-white'
                    : 'font-normal text-zinc-200'
                }`}
              >
                {item.title}
              </span>
              <span
                className={`font-kanit text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-xl tracking-wide leading-snug ${
                  !item.titleBold
                    ? 'font-bold text-white'
                    : 'font-normal text-zinc-200'
                }`}
              >
                {item.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NatureFeaturesBar;