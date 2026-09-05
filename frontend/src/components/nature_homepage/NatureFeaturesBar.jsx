import React, { useState, useEffect } from 'react';
import handIcon from '../../assets/nc_logo/hand.png';
import solutionIcon from '../../assets/nc_logo/solution.png';
import qualityIcon from '../../assets/nc_logo/quality.png';
import guidanceIcon from '../../assets/nc_logo/guidance.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

// Default static features as fallback
const DEFAULT_FEATURES = [
  { icon: handIcon, title: '40+ Years', subtitle: 'of Experience', titleBold: true },
  { icon: solutionIcon, title: 'Sustainable', subtitle: 'Solutions', titleBold: true },
  { icon: qualityIcon, title: 'Focus on', subtitle: 'Quality', titleBold: false },
  { icon: guidanceIcon, title: 'Expert', subtitle: 'Guidance', titleBold: false },
];

const NatureFeaturesBar = ({ featuresData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const features = (featuresData && featuresData.length === 4)
    ? featuresData
    : DEFAULT_FEATURES;

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= 2) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  const renderFeatureItem = (item, index) => {
    if (!item) return null;
    const iconUrl = item.icon ? resolveAssetUrl(item.icon) : DEFAULT_FEATURES[index]?.icon;

    return (
      <div className="flex items-center justify-center gap-2.5 sm:gap-4 w-full min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 2xl:w-14 2xl:h-14 flex-shrink-0 flex items-center justify-center filter brightness-125 contrast-125">
          <img src={iconUrl} alt={item.title} className="w-6 h-6 sm:w-8 sm:h-8 2xl:w-12 2xl:h-12 object-contain" />
        </div>
        <div className="flex flex-col text-left text-white min-w-0">
          <span className={`font-kanit text-xs sm:text-base md:text-xl 2xl:text-2xl tracking-wide leading-tight whitespace-nowrap ${item.titleBold ? 'font-bold text-white' : 'font-normal text-zinc-200'}`}>
            {item.title}
          </span>
          <span className={`font-kanit text-[10px] sm:text-xs md:text-base 2xl:text-xl tracking-wide leading-tight whitespace-nowrap ${!item.titleBold ? 'font-bold text-white' : 'font-normal text-zinc-200'}`}>
            {item.subtitle}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#2C441B]/45 border-t border-emerald-900/40 py-3.5 sm:py-4 md:py-6 px-3 sm:px-6 md:px-12 2xl:px-16 font-kanit">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto">

        {/* Desktop View (Static 4 columns with 3 vertical dividing lines) */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-0 justify-items-center items-center">
          {features.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-center gap-3 sm:gap-4 py-2 w-full px-4 md:px-6 ${index !== 0 ? 'border-l border-white/20' : ''
                }`}
            >
              {renderFeatureItem(item, index)}
            </div>
          ))}
        </div>

        {/* Mobile / Tablet View (Continuous infinite left-sliding 2 features at a time) */}
        <div className="block lg:hidden w-full overflow-hidden relative">
          <div
            className={`flex w-[300%] ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : 'transition-none'}`}
            style={{ transform: `translateX(-${currentIndex * 33.333333}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {/* Slide 1: Features 0 & 1 */}
            <div className="w-1/3 flex items-center justify-between px-1 sm:px-4">
              <div className="w-[48%] flex justify-center">
                {renderFeatureItem(features[0], 0)}
              </div>
              <div className="h-7 sm:h-9 w-px bg-white/25 flex-shrink-0" />
              <div className="w-[48%] flex justify-center">
                {renderFeatureItem(features[1], 1)}
              </div>
            </div>

            {/* Slide 2: Features 2 & 3 */}
            <div className="w-1/3 flex items-center justify-between px-1 sm:px-4">
              <div className="w-[48%] flex justify-center">
                {renderFeatureItem(features[2], 2)}
              </div>
              <div className="h-7 sm:h-9 w-px bg-white/25 flex-shrink-0" />
              <div className="w-[48%] flex justify-center">
                {renderFeatureItem(features[3], 3)}
              </div>
            </div>

            {/* Slide 3 (Clone of Slide 1 for seamless infinite loop): Features 0 & 1 */}
            <div className="w-1/3 flex items-center justify-between px-1 sm:px-4">
              <div className="w-[48%] flex justify-center">
                {renderFeatureItem(features[0], 0)}
              </div>
              <div className="h-7 sm:h-9 w-px bg-white/25 flex-shrink-0" />
              <div className="w-[48%] flex justify-center">
                {renderFeatureItem(features[1], 1)}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NatureFeaturesBar;