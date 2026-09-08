import React, { useState } from 'react';
import deepImg from '../../assets/nc_home/deep.png';
import branchImg from '../../assets/nc_home/branch.png';

const RipplesLetsBeginSection = ({ data }) => {
  // We use index 2 as the default to match the original static version (which had id 3 open by default)
  const [activeStep, setActiveStep] = useState(2);

  // Extract data with safe fallbacks
  const heading = data?.heading || "Let's begin";
  const introText = data?.introText || "Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.";
  
  const bottomImage = data?.bottomImage || branchImg; 


  const defaultSteps = [
    { num: '01', title: 'Design Consultation', description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.', img: deepImg },
    { num: '02', title: 'Space Planning', description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.', img: deepImg },
    { num: '03', title: 'Implementation', description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.', img: deepImg },
    { num: '04', title: 'Maintenance', description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.', img: deepImg },
  ];

  // Use dynamic steps if available, otherwise use default
  const steps = data?.steps && data.steps.length > 0 ? data.steps : defaultSteps;

  const handleToggle = (index) => {
    setActiveStep(activeStep === index ? null : index);
  };

  return (
    <section className="w-full bg-white select-none font-kanit">
      
      {/* Screen 1: Let's Begin Accordion */}
      <div className="w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-center lg:pt-6 pb-8">
        <div className="max-w-[1300px] w-[92%] mx-auto px-4 md:px-8">
          
          {/* Top Layout */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">
            
            {/* Left Column: Heading & Intro Text */}
            <div className="w-full lg:w-[40%] flex-shrink-0 space-y-4 lg:space-y-6 pt-4">
              <h2 className="font-reem text-5xl sm:text-6xl md:text-[72px] font-medium text-[#363636] tracking-wide leading-none whitespace-nowrap">
                {heading}
              </h2>
              <p className="font-kanit text-base sm:text-lg lg:text-[18px] font-light text-zinc-500 max-w-[340px] leading-relaxed">
                {introText}
              </p>
            </div>
  
            {/* Right Column: Step Accordion List */}
            <div className="w-full lg:w-[55%] space-y-1">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <div key={index} className="border-b border-zinc-300 py-4 lg:py-5 transition-all duration-300">
                    {/* Step Header Line */}
                    <button
                      onClick={() => handleToggle(index)}
                      className="w-full flex items-center gap-5 lg:gap-8 text-left cursor-pointer group focus:outline-none"
                    >
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-zinc-100 flex items-center justify-center text-sm lg:text-base font-semibold text-zinc-600 group-hover:bg-zinc-200 transition-colors shrink-0">
                        {step.num}
                      </div>
                      <span className="font-kanit text-xl sm:text-2xl lg:text-[28px] font-medium text-zinc-800 group-hover:text-black transition-colors tracking-wide">
                        {step.title}
                      </span>
                    </button>
  
                    {/* Active Step Banner Card */}
                    <div 
                      className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out ${
                        isActive ? 'max-h-[400px] lg:max-h-[40vh] mt-6 mb-2 opacity-100' : 'max-h-0 mt-0 mb-0 opacity-0'
                      }`}
                    >
                      <div className="h-[250px] sm:h-[300px] lg:h-[350px] w-full rounded-sm overflow-hidden">
                        <img
                          src={step.img || deepImg}
                          alt={step.title}
                          className="w-full h-full object-cover object-center block"
                        />
                        {/* Text Overlay on the Right side of image */}
                        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-transparent flex items-center justify-end p-8 sm:p-12 lg:p-16">
                          <p className="font-kanit text-base sm:text-lg lg:text-xl text-white/95 font-light max-w-md text-right leading-relaxed drop-shadow-md">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
  
          </div>
        </div>
      </div>

      {/* Screen 2: Bottom Large Image Banner (Full Bleed) */}
      <div className="w-full h-[60vh] lg:h-screen overflow-hidden mt-12 lg:mt-24">
        <img
          src={bottomImage}
          alt="Nature Aquascape Banner"
          className="w-full h-full object-cover object-center block"
        />
      </div>

    </section>
  );
};

export default RipplesLetsBeginSection;