import React, { useState } from 'react';
import { resolveAssetUrl } from '../../shared/utils/assetResolver';

const LetsBegin = ({ data }) => {
  const [activeStep, setActiveStep] = useState(2);
  if (!data) return null;

  const steps = Array.isArray(data.steps) && data.steps.length > 0 ? data.steps : [];
  const bottomImage = resolveAssetUrl(data.bottomImage, '/assets/nc_home/branch.png');

  return (
    <section className="w-full bg-white select-none font-kanit py-12 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-kanit text-4xl sm:text-5xl md:text-[54px] font-medium text-[#2c2c2c] leading-tight tracking-tight">{data.heading}</h2>
            <p className="font-kanit text-xs sm:text-sm font-light text-zinc-500 leading-relaxed max-w-xs">{data.introText}</p>
          </div>
          <div className="lg:col-span-8 space-y-2 ml-10">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <div key={index} className="border-b border-zinc-400/80 py-4 transition-all duration-300">
                  <button onClick={() => setActiveStep(activeStep === index ? null : index)} className="w-full flex items-center gap-6 text-left cursor-pointer group focus:outline-none">
                    <div className="w-8 h-8 rounded-full border border-zinc-400 flex items-center justify-center text-xs font-medium text-zinc-600 group-hover:border-zinc-800 transition-colors shrink-0">{step.num}</div>
                    <span className="font-kanit text-lg sm:text-xl font-medium text-[#2c2c2c] group-hover:text-black transition-colors">{step.title}</span>
                  </button>
                  {isActive && (
                    <div className="relative w-full rounded-xs overflow-hidden mt-4 mb-2 h-[220px] sm:h-[270px] md:h-[310px] shadow-md transition-all duration-500">
                      <img src={resolveAssetUrl(step.img, '/assets/nc_home/deep.png')} alt={step.title} className="w-full h-full object-cover object-center" />
                      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent flex items-center justify-end p-6 sm:p-8 md:p-10">
                        <p className="font-kanit text-xs sm:text-sm text-white/90 font-light max-w-xs text-left leading-relaxed drop-shadow-md">{step.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full mt-16 md:mt-24 rounded-xs overflow-hidden shadow-lg border border-zinc-100">
          <img src={bottomImage} alt="Nature Aquascape Banner" className="w-full h-auto object-cover block" />
        </div>
      </div>
    </section>
  );
};
export default LetsBegin;