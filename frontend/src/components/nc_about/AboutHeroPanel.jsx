import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import naturecubeLogo from '../../assets/nc_logo/naturecube.png';

// Subhaakritee Counter Animation Component
const AnimatedCounter = ({ text }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof text !== 'string') return;
    const match = text.match(/^(.*?)(\d+)(.*)$/);
    if (!match) return;

    const targetNum = parseInt(match[2], 10);
    if (!isVisible || targetNum === 0) return;

    let start = 0;
    const duration = 1800;
    const increment = targetNum / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNum) {
        clearInterval(timer);
        setCount(targetNum);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, text]);

  if (typeof text !== 'string') return text;
  const match = text.match(/^(.*?)(\d+)(.*)$/);
  if (!match) return <span>{text}</span>;

  const prefix = match[1];
  const suffix = match[3];

  return (
    <span ref={ref}>
      {isVisible ? `${prefix}${count}${suffix}` : `${prefix}0${suffix}`}
    </span>
  );
};

const AboutHeroPanel = ({ data }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const headlineLine1 = data?.headlineLine1 || "LOOK DEEP INTO NATURE, AND THEN YOU WILL";
  const headlineLine2 = data?.headlineLine2 || "UNDERSTAND EVERYTHING BETTER";
  const subtext = data?.subtext || "We are evolving the landscape of how nature and science bringing peace in your inner world.";
  const yearsExp = data?.yearsExp || "25+";
  const sinceYear = data?.sinceYear || "SINCE 2010";
  const clientCount = data?.clientCount || "+100K SATISFIED CLIENTS";

  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-900 flex-shrink-0 relative flex flex-col justify-between pt-20 sm:pt-24 pb-12 sm:pb-16 px-6 sm:px-12 lg:px-20 z-10 select-none font-kanit">

      {/* Top Headline & Subtext */}
      <div className="max-w-4xl space-y-4 my-auto">
        <h1 className="leading-tight">
          <span className="font-reem-fun text-[#6A6A6A] font-semibold text-2xl sm:text-3xl lg:text-[34px] tracking-tight block uppercase">
            {headlineLine1}
          </span>
          <span className="font-reem-fun text-[#1E293B] font-bold text-3xl sm:text-5xl lg:text-[56px] tracking-tight block uppercase mt-1 leading-none">
            {headlineLine2}
          </span>
        </h1>

        <div 
          className="text-[#6A6A6A] font-medium text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed pt-2 [&>p]:mb-0 tiptap-content"
          dangerouslySetInnerHTML={{ __html: subtext }}
        />
      </div>

      {/* Bottom Badges Section */}
      <div className="w-full flex items-center justify-between mb-4 sm:mb-8 relative z-20">
        {/* Left: 25+ Years Experience Badge */}
        <div className="bg-[#6CA844] text-white p-6 sm:p-8 w-44 sm:w-52 aspect-square flex flex-col justify-center shadow-lg flex-shrink-0 font-kanit font-normal">
          <span className="font-kanit font-normal text-4xl sm:text-5xl lg:text-6xl leading-none">
            <AnimatedCounter text={yearsExp} />
          </span>
          <span className="font-kanit font-normal text-xs sm:text-sm tracking-wider uppercase mt-3">
            YEARS OF
          </span>
          <span className="font-kanit font-normal text-xs sm:text-sm tracking-wider uppercase">
            EXPERIENCE
          </span>
        </div>

        {/* Center Part: SINCE 2010 */}
        <div className="flex-1 flex flex-col justify-center items-start text-left space-y-1.5 px-4 sm:px-8 lg:px-90 mb-25 font-kanit font-normal">
          <span className="text-[#111827] font-kanit font-normal text-xl sm:text-2xl lg:text-[25px] tracking-tight uppercase whitespace-nowrap">
            <AnimatedCounter text={sinceYear} />
          </span>
          <span className="text-[#7BA641] font-kanit font-normal text-base sm:text-lg lg:text-xl tracking-wide uppercase whitespace-nowrap">
            <AnimatedCounter text={clientCount} />
          </span>
        </div>

        {/* Right Spacer for layout balance */}
        <div className="w-44 sm:w-52 flex-shrink-0 hidden lg:block" />
      </div>

    </div>
  );
};

export default AboutHeroPanel;