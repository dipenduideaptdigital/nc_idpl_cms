import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import bigImg from '../../assets/aboutUs/big.png';
import sm1 from '../../assets/aboutUs/sm1.png';
import sm2 from '../../assets/aboutUs/sm2.png';
import sm3 from '../../assets/aboutUs/sm3.png';
import sm4 from '../../assets/aboutUs/sm4.png';

const GALLERY_DATA = [
  { id: 1, src: sm1, title: 'Title' },
  { id: 2, src: sm2, title: 'Title' },
  { id: 3, src: sm3, title: 'Title' },
  { id: 4, src: sm4, title: 'Title' },
];

const AboutGallery = () => {
  return (
    <section className="relative w-full min-h-[950px] font-helvetica overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={bigImg}
          alt="Gallery Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-stretch gap-12">

          {/* LEFT */}
          <div className="w-full lg:w-[30%] flex flex-col">

            {/* Badge  */}
            <div className="inline-flex items-center gap-2 border border-white/40 rounded-full px-4 py-1.5 mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white">
                OUR GALLERY
              </span>
            </div>

            <div className="flex-1">
              <h2 className="text-[68px] md:text-[82px] lg:text-[76px] font-black text-white font-helvetica leading-[1] tracking-[-0.02em] mb-6">
                Interior <br />
                Design
              </h2>

              <p className="text-[15px] lg:text-[16px] text-white/85 leading-[1.8] max-w-[420px]">
                Discover our curated collection of stunning interior spaces,
                crafted with passion, precision, and an eye for timeless design.
              </p>
            </div>

            {/* Buttons */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
              <button
                aria-label="Previous"
                className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white/15 transition"
              >
                <ArrowLeft size={22} />
              </button>

              <button
                aria-label="Next"
                className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white/15 transition"
              >
                <ArrowRight size={22} />
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-[1.4]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-start">

              {GALLERY_DATA.map((item) => (
                <div
                key={item.id}
                className="flex flex-col group cursor-pointer"
              >
                  {/* Image */}
                  <div className="overflow-hidden rounded-[20px]">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Title */}
                  <h4 className="text-center text-white font-bold text-[16px] lg:text-[18px] mt-3">
                    {item.title}
                  </h4>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutGallery;