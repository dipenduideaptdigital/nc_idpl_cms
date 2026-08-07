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
    <section className="relative w-full bg-white pt-10 md:pt-25 pb-6 md:pb-15 px-4 sm:px-8 overflow-hidden select-none">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-8 -left-10 sm:-top-12 sm:-left-14 w-[340px] sm:w-[460px] md:w-[560px] lg:w-[620px] h-[260px] sm:h-[340px] md:h-[400px]">
          <img src={brush1Img} alt="" className="w-full h-full object-contain object-left-top filter contrast-125 brightness-95 opacity-90" />
        </div>
        <div className="absolute bottom-20 right-1 sm:right-8 md:right-10 lg:right-100 w-60 sm:w-[260px] md:w-[310px] h-48 sm:h-[210px] md:h-[250px]">
          <img src={brush2Img} alt="" className="w-full h-full object-contain object-right-bottom filter contrast-125 brightness-95 opacity-85" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative min-h-[460px] lg:min-h-[500px] flex items-center justify-center">

        <div className="relative z-20 w-[300px] sm:w-[400px] md:w-[480px] lg:w-[520px] aspect-square flex items-center justify-center my-6 lg:my-0">
          <img src={mandalaImage} alt="Living Mandala Artwork" className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.08)]" />
        </div>

        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 md:p-8">
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 pointer-events-auto">
            <div className="space-y-1">
              <span className="font-kanit text-sm md:text-base font-semibold text-[#7BA641] tracking-wide block">
                {tagline}
              </span>
              <h2 className="font-reem text-xl sm:text-3xl md:text-3xl lg:text-[35px] font-normal text-black tracking-wider uppercase leading-none">
                {mainTitle}
              </h2>
            </div>

            <div className="text-left space-y-0.5 max-w-xs md:max-w-sm lg:mt-4">
              <h3 className="font-kanit text-xl sm:text-2xl md:text-3xl font-bold text-[#4B6B2E] tracking-tight leading-tight">
                {headingLine1}
              </h3>
              <h3 className="font-kanit text-xl sm:text-2xl md:text-3xl font-bold text-[#4B6B2E] tracking-tight leading-tight">
                {headingLine2}
              </h3>
              <div className="font-larken text-4xl sm:text-5xl text-[#4B6B2E] font-normal italic tracking-normal transform -translate-y-1">
                {italicWord}
              </div>
            </div>
          </div>

          <div className="flex justify-end items-end pointer-events-auto">
            <div className="max-w-xs md:max-w-sm space-y-4 text-left">
              <div className="font-kanit text-[11px] sm:text-xs md:text-[13px] font-bold tracking-wider text-zinc-800 uppercase leading-snug space-y-0.5">
                <div>{descLine1}</div>
                <div>{descLine2}</div>
              </div>

              <Link to="/mandala" className="group inline-flex items-center gap-3 text-zinc-700 hover:text-[#4B6B2E] transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden">
                  <img src={ellipseBtnImg} alt="" className="absolute inset-0 w-full h-full object-cover rounded-full" />
                  <span className="relative z-10 text-lg font-light text-zinc-700 group-hover:text-[#4B6B2E]">+</span>
                </div>
                <span className="font-kanit text-sm font-normal tracking-wide lowercase text-zinc-700 group-hover:text-[#4B6B2E]">
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