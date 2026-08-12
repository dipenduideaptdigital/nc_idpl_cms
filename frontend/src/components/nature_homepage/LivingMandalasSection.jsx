import React from 'react';
import { Link } from 'react-router-dom';
import defaultMandalaImg from '../../assets/nc_home/mandala.png';
import brush1Img from '../../assets/nc_logo/brush1.png';
import brush2Img from '../../assets/nc_logo/brush2.png';
import ellipseBtnImg from '../../assets/nc_logo/Ellipse_plus_btn.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const LivingMandalasSection = ({ data }) => {
  const tagline = data?.tagline || "what we believe";
  const mainTitle = data?.mainTitle || "LIVING MANDALAS";
  const headingLine1 = data?.headingLine1 || "A quest to";
  const headingLine2 = data?.headingLine2 || "expose the principles of";
  const italicWord = data?.italicWord || "mandala";
  const descLine1 = data?.descLine1 || "LIQUID LANDSCAPES MIRRORED IN MINDFUL ART,";
  const descLine2 = data?.descLine2 || "A LIVING MANDALA'S HEART.";
  const buttonText = data?.buttonText || "explore the mandala";
  const mandalaImage = data?.mandalaImage ? getAssetUrl(data.mandalaImage) : defaultMandalaImg;

  return (
    <section className="relative w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden select-none font-kanit">
      
      {/* Background Brush Textures */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-8 -left-10 sm:-top-12 sm:-left-14 w-[280px] xs:w-[340px] sm:w-[460px] md:w-[560px] lg:w-[620px] h-[220px] sm:h-[340px] md:h-[400px]">
          <img src={brush1Img} alt="" className="w-full h-full object-contain object-left-top filter contrast-125 brightness-95 opacity-80" />
        </div>
        <div className="absolute -bottom-8 -right-4 sm:bottom-6 sm:right-6 md:right-16 lg:right-24 w-[220px] sm:w-[280px] md:w-[320px] h-[180px] sm:h-[220px] md:h-[260px]">
          <img src={brush2Img} alt="" className="w-full h-full object-contain object-right-bottom filter contrast-125 brightness-95 opacity-80" />
        </div>
      </div>

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto relative z-10 min-h-[460px] lg:min-h-[540px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
        
        {/* Left Block (Top-left on Desktop) */}
        <div className="w-full lg:w-1/3 text-center lg:text-left z-20 space-y-1.5 order-1 lg:order-1 self-center lg:self-start lg:pt-6">
          <span className="font-kanit text-sm sm:text-base font-semibold text-[#7BA641] tracking-wide block uppercase">
            {tagline}
          </span>
          <h2 className="font-reem text-2xl xs:text-3xl sm:text-4xl lg:text-[34px] xl:text-[38px] font-normal text-black tracking-wider uppercase leading-tight">
            {mainTitle}
          </h2>
        </div>

        {/* Central Mandala Artwork */}
        <div className="w-[260px] xs:w-[320px] sm:w-[400px] md:w-[460px] lg:w-[420px] xl:w-[480px] 2xl:w-[520px] aspect-square flex-shrink-0 flex items-center justify-center z-10 order-2 lg:order-2 my-4 lg:my-0 mx-auto">
          <img
            src={mandalaImage}
            alt="Living Mandala Artwork"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Right Block (Top-right & Bottom-right on Desktop) */}
        <div className="w-full lg:w-1/3 text-center lg:text-left z-20 flex flex-col justify-between space-y-8 lg:space-y-16 order-3 lg:order-3 self-center lg:self-stretch lg:py-4">
          {/* Top Right Quote */}
          <div className="space-y-0.5 max-w-sm mx-auto lg:mx-0">
            <h3 className="font-kanit text-xl sm:text-2xl lg:text-3xl font-bold text-[#4B6B2E] tracking-tight leading-tight">
              {headingLine1}
            </h3>
            <h3 className="font-kanit text-xl sm:text-2xl lg:text-3xl font-bold text-[#4B6B2E] tracking-tight leading-tight">
              {headingLine2}
            </h3>
            <div className="font-larken text-4xl sm:text-5xl lg:text-6xl text-[#4B6B2E] font-normal italic tracking-normal transform -translate-y-1">
              {italicWord}
            </div>
          </div>

          {/* Bottom Right Description & CTA */}
          <div className="space-y-4 max-w-sm mx-auto lg:mx-0 pt-2 lg:pt-0">
            <div className="font-kanit text-xs sm:text-sm font-semibold tracking-wider text-zinc-800 uppercase leading-relaxed space-y-0.5">
              <div>{descLine1}</div>
              <div>{descLine2}</div>
            </div>

            <Link
              to="/mandala"
              className="group inline-flex items-center gap-3 text-zinc-700 hover:text-[#4B6B2E] transition-colors cursor-pointer pt-1"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-200/80 group-hover:bg-[#4B6B2E] text-zinc-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-[0_0_14px_rgba(75,107,46,0.45)] group-active:scale-95">
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span className="font-kanit text-sm sm:text-base font-normal tracking-wide lowercase text-zinc-700 group-hover:text-[#4B6B2E] transition-colors">
                {buttonText}
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LivingMandalasSection;