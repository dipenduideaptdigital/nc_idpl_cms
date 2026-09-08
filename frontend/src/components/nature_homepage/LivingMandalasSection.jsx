import React from 'react';
import { Link } from 'react-router-dom';
import defaultMandalaImg from '../../assets/nc_home/mandala.png';
import brush1Img from '../../assets/nc_logo/brush1.png';
import brush2Img from '../../assets/nc_logo/brush2.png';

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

  if (data?.isVisible === false) return null;

  return (
    <section className="relative w-full bg-white py-12 sm:py-16 lg:py-16 xl:py-20 px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 overflow-hidden select-none font-kanit">

      {/* Background Watercolor Splashes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-Left Brush */}
        <div className="absolute -top-8 -left-10 sm:-top-12 sm:-left-14 lg:-top-20 lg:-left-10 w-[300px] xs:w-[360px] sm:w-[460px] md:w-[560px] lg:w-[620px] h-[220px] sm:h-[300px] md:h-[380px]">
          <img
            src={brush1Img}
            alt=""
            className="w-full h-full object-contain object-left-top"
          />
        </div>
        {/* Bottom-Right Brush */}
        <div className="absolute -bottom-6 -right-4 sm:bottom-4 sm:right-4 md:right-12 lg:right-[22%] lg:bottom-6  w-[240px] sm:w-[300px] md:w-[340px] h-[200px] sm:h-[240px] md:h-[280px]">
          <img
            src={brush2Img}
            alt=""
            className="w-full h-full object-contain object-right-bottom"
          />
        </div>
      </div>

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto relative z-10 min-h-[460px] lg:min-h-[500px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">

        {/* Left Block (Top-left on Desktop) */}
        <div className="w-full lg:w-[30%] xl:w-[28%] text-center lg:text-left z-20 space-y-4 order-1 lg:order-1 self-center lg:self-start lg:pt-3">
          <span className="font-kanit text-xl sm:text-2xl lg:text-[20px] font-medium text-[#6CA844] tracking-normal block pl-2 sm:pl-4 lg:pl-6">
            {tagline}
          </span>
          <h2 className="font-reem text-2xl xs:text-3xl sm:text-4xl lg:text-[42px] font-bold text-black tracking-wide uppercase leading-tight whitespace-nowrap pl-6 sm:pl-10 lg:pl-12">
            {mainTitle}
          </h2>
        </div>

        {/* Central Mandala Artwork */}
        <div className="relative w-[280px] xs:w-[340px] sm:w-[420px] md:w-[460px] lg:w-[460px] xl:w-[500px] 2xl:w-[520px] aspect-square flex-shrink-0 flex items-center justify-center z-10 order-2 lg:order-2 my-4 lg:my-0 mx-auto">
          <img
            src={mandalaImage}
            alt="Living Mandala Artwork"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.06)]transition-transform duration-700 hover:scale-105"
          />
          {/* Floating circular bubble accents matching Figma design */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 500 500">
            {/* Top right larger circle */}
            <circle cx="286" cy="214" r="8" stroke="#8EA4A8" strokeWidth="2.2" fill="none" opacity="0.7" />
            {/* Tiny circle adjacent to top right */}
            <circle cx="292" cy="204" r="3.5" stroke="#8EA4A8" strokeWidth="1.8" fill="none" opacity="0.65" />
            {/* Middle left circle */}
            <circle cx="272" cy="245" r="5.5" stroke="#8EA4A8" strokeWidth="1.8" fill="none" opacity="0.65" />
            {/* Lower right circle */}
            <circle cx="293" cy="268" r="7.5" stroke="#8EA4A8" strokeWidth="2.2" fill="none" opacity="0.7" />
          </svg>
        </div>

        {/* Right Block (Top-right & Bottom-right on Desktop) */}
        <div className="w-full lg:w-[32%] xl:w-[30%] text-center lg:text-left z-20 flex flex-col justify-between order-3 lg:order-3 self-center lg:self-stretch py-2 lg:py-5 space-y-8 lg:space-y-0">

          {/* Top Right Quote */}
          <div className="space-y-0 max-w-sm mx-auto lg:mx-0">
            <h3 className="font-kanit text-2xl sm:text-3xl lg:text-[30px] xl:text-[33px] font-extrabold text-[#4A712E] tracking-tight leading-[1.15]">
              {headingLine1}
            </h3>
            <h3 className="font-kanit text-2xl sm:text-3xl lg:text-[30px] xl:text-[33px] font-extrabold text-[#48682E] tracking-tight leading-[1.15]">
              {headingLine2}
            </h3>
            <div className="font-larken text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] text-[#4A712E] font-normal italic tracking-normal leading-none mt-1">
              {italicWord}
            </div>
          </div>

          {/* Bottom Right Description & CTA */}
          <div className="relative max-w-sm mx-auto lg:mx-0 pt-2 lg:pt-0">

            <div className="relative z-10 space-y-4">
              <div className="font-kanit text-xs sm:text-[12.5px] lg:text-[16px] font-medium tracking-[0.035em] text-[#06232B] uppercase leading-[1.4] space-y-0.5">
                <div>{descLine1}</div>
                <div>{descLine2}</div>
              </div>

              <Link
                to="/mandala"
                className="group inline-flex items-center gap-3.5 text-[#505A5C] hover:text-[#48682E] transition-colors cursor-pointer pt-1"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EBF3DF] group-hover:bg-[#4A712E] text-[#6CA844] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-[0_2px_12px_rgba(72,104,46,0.35)] group-active:scale-95">
                  <svg
                    className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="font-kanit text-[14.5px] sm:text-[15.5px] font-medium tracking-normal lowercase text-[#505A5C] group-hover:text-[#48682E] transition-colors">
                  {buttonText}
                </span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LivingMandalasSection;
