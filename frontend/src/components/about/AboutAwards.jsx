import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import awardImg from '../../assets/aboutUs/image.png';

const AWARDS_DATA = [
  { year: '2020', title: 'Residential Interior Design' },
  { year: '2021', title: 'Outdoor & Landscape Design' },
  { year: '2022', title: 'Interior Design Consultation' },
  { year: '2023', title: 'Commercial Interior Design' },
  { year: '2024', title: 'Renovation And Remodeling' },
  { year: '2025', title: 'Interior 2D/3D Layouts' },
];

const AboutAwards = () => {
  const [activeAward, setActiveAward] = useState('2020');

  return (
    <section className="py-20 lg:py-24 bg-white font-helvetica overflow-hidden">
      <div className="container mx-auto max-w-[1300px] px-6 lg:px-8">
        
        <div className="flex flex-col items-center lg:grid lg:grid-cols-[1fr_2.5fr] gap-6 lg:gap-12 mb-12 lg:mb-20 items-start w-full">
          
          {/* Left: Badge */}
          <div className="flex justify-center lg:justify-start w-full">
            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 w-max bg-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-500">
                AWARD & ACHIEVEMENT
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-left w-full">
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] font-bold tracking-tight text-[#111827] leading-[1.1]">
              Design That <span className="text-[#0084FF]">Speaks Our</span>
              <br className="hidden md:block" />
              <span className="text-[#0084FF]">Industry</span> Awards
            </h2>
          </div>

        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          
          {/* Award Image */}
          <div className="w-full max-w-[500px] lg:max-w-[540px] aspect-square rounded-[36px] overflow-hidden shadow-sm bg-zinc-50 mx-auto lg:mx-0">
            <img
              src={awardImg}
              alt="Awards and Achievements"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>

          {/*  Awards List */}
          <div className="w-full flex flex-col pt-4">
            {AWARDS_DATA.map((award, index) => {
              const isActive = activeAward === award.year;
              const isLast = index === AWARDS_DATA.length - 1;

              return (
                <div
                  key={index}
                  className={`group flex items-center justify-between py-[16px] lg:py-[24px] cursor-pointer transition-colors border-t ${
                    isActive ? 'border-t-[2px] border-[#0084FF]' : 'border-t border-gray-300'
                  } ${isLast ? 'border-b border-b-gray-300' : ''}`}
                  onMouseEnter={() => setActiveAward(award.year)}
                  onClick={() => setActiveAward(award.year)}
                >
                  
                  {/* Year & Title */}
                  <div className="flex items-center space-x-6 md:space-x-10 transform group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium text-[#111827] w-12 sm:w-16 shrink-0 text-left">
                      {award.year}
                    </span>
                    <span className="text-[16px] sm:text-[20px] lg:text-[24px] font-bold text-[#111827] leading-tight capitalize text-left">
                      {award.title}
                    </span>
                  </div>

                  {/*Icons */}
                  {isActive ? (
                    <div className="w-10 h-10 rounded-full bg-[#0084FF] flex items-center justify-center text-white shrink-0 shadow-md">
                      <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#111827] group-hover:bg-gray-100 transition-colors shrink-0">
                      <ArrowUpRight className="w-6 h-6" strokeWidth={2} />
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutAwards;