import React from 'react';
import personImg from '../../assets/nc_home/person.png';
import ellipseBtnImg from '../../assets/nc_logo/Ellipse_plus_btn.png';

const RipplesIntroSection = ({ data }) => {
  return (
    <section className="w-full bg-white select-none font-kanit pb-16 md:pb-24 overflow-hidden">
      {/* Top Part: White Background Content */}
      <div className="max-w-7xl mx-auto pt-20 md:pt-28 pb-4 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          
          {/* Left Column: Big Bold Title */}
          <div className="lg:col-span-7 pr-0 lg:pr-6">
            <h2 className="font-kanit text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-[#333333] leading-[1.16] tracking-tight whitespace-pre-line">
              {data?.mainTitle || 'It is a long established fact that a reader will be distracted.'}
            </h2>
          </div>

          {/* Right Column: Secondary Heading, Paragraph & Explore CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-kanit text-lg sm:text-xl md:text-[22px] font-bold text-[#4a4a4a] leading-snug whitespace-pre-line">
              {data?.subTitle || 'It is a long established fact that a reader will be distracted.'}
            </h3>

            <p className="font-kanit text-sm sm:text-base font-light text-[#666666] leading-relaxed max-w-lg whitespace-pre-line">
              {data?.description || "Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India. Specializing in setting up 'Nature Aquariums' and 'Biotopes' that mimic actual fish habitats, we offer international quality brands and exceptional customer service, helping you build and maintain your dream aquarium."}
            </p>

            {/* Explore Button */}
            <div className="pt-2">
              <button 
                onClick={() => {
                  const event = new CustomEvent('open-consultation-modal');
                  window.dispatchEvent(event);
                }}
                className="group inline-flex items-center gap-3 text-zinc-700 hover:text-[#7BA641] transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center relative overflow-hidden bg-[#eaf2e3] group-hover:bg-[#7BA641] transition-colors">
                  <img
                    src={ellipseBtnImg}
                    alt="+"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-kanit text-xs sm:text-sm font-semibold tracking-wide lowercase text-zinc-800 group-hover:text-[#7BA641]">
                  explore
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Part: Dark Navy Banner with Symmetrically Overlapping Person Image */}
      <div className="w-full bg-[#0e222b] mt-24 md:mt-36 mb-12 md:mb-16 py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side: Takashi Amano Image extending BOTH top and bottom of banner */}
            <div className="lg:col-span-6 relative z-10 flex justify-center lg:justify-start -my-14 sm:-my-20 md:-my-28 lg:-my-32">
              <div className="w-[280px] sm:w-[380px] md:w-[460px] lg:w-[500px] overflow-hidden shadow-2xl rounded-xs border border-white/10">
                <img
                  src={data?.personImage || personImg}
                  alt={data?.authorName || "Takashi Amano"}
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>

            {/* Right Side: Quote & Author Signature */}
            <div className="lg:col-span-6 space-y-4 py-8 lg:py-12 pl-0 lg:pl-4 text-white">
              <blockquote className="font-kanit text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-normal leading-tight tracking-wide whitespace-pre-line">
                {data?.quote || '“To know Mother Nature is to love her smallest creations.”'}
              </blockquote>
              <p className="font-kanit text-lg sm:text-xl md:text-2xl font-normal italic tracking-wide text-zinc-200 whitespace-pre-line">
                {data?.authorName || '–Takashi Amano'}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default RipplesIntroSection;