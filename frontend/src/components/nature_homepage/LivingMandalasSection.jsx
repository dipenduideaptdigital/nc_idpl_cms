import React from 'react';
import mandalaImg from '../../assets/nc_home/mandala.png';
import brush1Img from '../../assets/nc_logo/brush1.png';
import brush2Img from '../../assets/nc_logo/brush2.png';
import ellipseBtnImg from '../../assets/nc_logo/Ellipse_plus_btn.png';

const LivingMandalasSection = () => {
  return (
    <section className="relative w-full bg-white py-10 md:py-24 px-4 sm:px-8 overflow-hidden select-none">
      
      {/* SECTION-LEVEL BRUSH SPLASHES (z-0) - STRICTLY BEHIND MANDALA */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-Left Brush1 Splash - Pinned to Section Top-Left */}
        <div className="absolute -top-8 -left-10 sm:-top-12 sm:-left-14 w-[340px] sm:w-[460px] md:w-[560px] lg:w-[620px] h-[260px] sm:h-[340px] md:h-[400px]">
          <img
            src={brush1Img}
            alt=""
            className="w-full h-full object-contain object-left-top filter contrast-125 brightness-95 opacity-90"
          />
        </div>

        {/* Bottom-Right Brush2 Splash */}
        <div className="absolute bottom-20 right-1 sm:right-8 md:right-10 lg:right-100 w-60 sm:w-[260px] md:w-[310px] h-48 sm:h-[210px] md:h-[250px]">
          <img
            src={brush2Img}
            alt=""
            className="w-full h-full object-contain object-right-bottom filter contrast-125 brightness-95 opacity-85"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative min-h-[560px] lg:min-h-[640px] flex items-center justify-center">

        {/* LAYER 2: DEAD-CENTER MANDALA ARTWORK (z-20) - IN FRONT OF BRUSHES */}
        <div className="relative z-20 w-[300px] sm:w-[400px] md:w-[480px] lg:w-[520px] aspect-square flex items-center justify-center my-6 lg:my-0">
          <img
            src={mandalaImg}
            alt="Living Mandala Artwork"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          />
        </div>

        {/* LAYER 3: TEXT & INTERACTIVE CONTENT (z-30) - IN FRONT OF EVERYTHING */}
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 md:p-8">
          
          {/* Top Row: Left Header & Right Upper Heading */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 pointer-events-auto">
            {/* Top-Left Header */}
            <div className="space-y-1">
              <span className="font-kanit text-sm md:text-base font-semibold text-[#7BA641] tracking-wide block">
                what we believe
              </span>
              <h2 className="font-reem text-xl sm:text-3xl md:text-3xl lg:text-[35px] font-normal text-black tracking-wider uppercase leading-none">
                LIVING MANDALAS
              </h2>
            </div>

            {/* Top-Right Upper Heading */}
            <div className="text-left space-y-0.5 max-w-xs md:max-w-sm lg:mt-4">
              <h3 className="font-kanit text-xl sm:text-2xl md:text-3xl font-bold text-[#4B6B2E] tracking-tight leading-tight">
                A quest to
              </h3>
              <h3 className="font-kanit text-xl sm:text-2xl md:text-3xl font-bold text-[#4B6B2E] tracking-tight leading-tight">
                expose the principles of
              </h3>
              <div className="font-larken text-4xl sm:text-5xl text-[#4B6B2E] font-normal italic tracking-normal transform -translate-y-1">
                mandala
              </div>
            </div>
          </div>

          {/* Bottom Row: Right Lower Text & Explore Button */}
          <div className="flex justify-end items-end pointer-events-auto">
            <div className="max-w-xs md:max-w-sm space-y-4 text-left">
              <div className="font-kanit text-[11px] sm:text-xs md:text-[13px] font-bold tracking-wider text-zinc-800 uppercase leading-snug space-y-0.5">
                <div>LIQUID LANDSCAPES MIRRORED IN MINDFUL ART,</div>
                <div>A LIVING MANDALA'S HEART.</div>
              </div>

              {/* Explore Button */}
              <button
                onClick={() => {
                  const elem = document.getElementById('mandala-details');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-3 text-zinc-700 hover:text-[#4B6B2E] transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden">
                  <img
                    src={ellipseBtnImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                  />
                  <span className="relative z-10 text-lg font-light text-zinc-700 group-hover:text-[#4B6B2E]">
                    +
                  </span>
                </div>
                <span className="font-kanit text-sm font-normal tracking-wide lowercase text-zinc-700 group-hover:text-[#4B6B2E]">
                  explore the mandala
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default LivingMandalasSection;
