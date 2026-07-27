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
    <div className="w-full bg-[#0a1608]/80 backdrop-blur-md border-t border-emerald-900/40 py-5 px-6 md:px-12 font-kanit">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
        {features.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-start sm:justify-center gap-4 py-4 sm:py-2 ${
              index !== 0 ? 'sm:pl-6 lg:pl-8' : ''
            }`}
          >
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center filter brightness-125 contrast-125">
              <img
                src={item.icon}
                alt={item.alt}
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex flex-col text-white">
              <span
                className={`font-kanit text-lg md:text-xl tracking-wide leading-snug ${
                  item.titleBold
                    ? 'font-bold text-white'
                    : 'font-normal text-zinc-200'
                }`}
              >
                {item.title}
              </span>
              <span
                className={`font-kanit text-base md:text-lg tracking-wide leading-snug ${
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
