import React, { useState } from 'react';
import deepImg from '../../assets/nc_home/deep.png';
import branchImg from '../../assets/nc_home/branch.png';

const RipplesLetsBeginSection = () => {
  const [activeStep, setActiveStep] = useState(3);

  const steps = [
    {
      id: 1,
      num: '01',
      title: 'Design Consultation',
      description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.',
      img: deepImg,
    },
    {
      id: 2,
      num: '02',
      title: 'Design Consultation',
      description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.',
      img: deepImg,
    },
    {
      id: 3,
      num: '03',
      title: 'Design Consultation',
      description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.',
      img: deepImg,
    },
    {
      id: 4,
      num: '04',
      title: 'Design Consultation',
      description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.',
      img: deepImg,
    },
  ];

  const handleToggle = (id) => {
    setActiveStep(activeStep === id ? null : id);
  };

  return (
    <section className="w-full bg-white select-none font-kanit py-12 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Intro Text */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-kanit text-4xl sm:text-5xl md:text-[54px] font-medium text-[#2c2c2c] leading-tight tracking-tight">
              Let's begin
            </h2>
            <p className="font-kanit text-xs sm:text-sm font-light text-zinc-500 leading-relaxed max-w-xs">
              Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.
            </p>
          </div>

          {/* Right Column: Step Accordion List */}
          <div className="lg:col-span-8 space-y-2 ml-10">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div key={step.id} className="border-b border-zinc-400/80 py-4 transition-all duration-300">
                  {/* Step Header Line */}
                  <button
                    onClick={() => handleToggle(step.id)}
                    className="w-full flex items-center gap-6 text-left cursor-pointer group focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full border border-zinc-400 flex items-center justify-center text-xs font-medium text-zinc-600 group-hover:border-zinc-800 transition-colors shrink-0">
                      {step.num}
                    </div>
                    <span className="font-kanit text-lg sm:text-xl font-medium text-[#2c2c2c] group-hover:text-black transition-colors">
                      {step.title}
                    </span>
                  </button>

                  {/* Active Step Banner Card (deep.png) */}
                  {isActive && (
                    <div className="relative w-full rounded-xs overflow-hidden mt-4 mb-2 h-[220px] sm:h-[270px] md:h-[310px] shadow-md transition-all duration-500">
                      <img
                        src={step.img}
                        alt={step.title}
                        className="w-full h-full object-cover object-center"
                      />
                      {/* Text Overlay on the Right side of image */}
                      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent flex items-center justify-end p-6 sm:p-8 md:p-10">
                        <p className="font-kanit text-xs sm:text-sm text-white/90 font-light max-w-xs text-left leading-relaxed drop-shadow-md">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Large Image Banner (branch.png) */}
        <div className="w-full mt-16 md:mt-24 rounded-xs overflow-hidden shadow-lg border border-zinc-100">
          <img
            src={branchImg}
            alt="Nature Aquascape Branch"
            className="w-full h-auto object-cover block"
          />
        </div>

      </div>
    </section>
  );
};

export default RipplesLetsBeginSection;
