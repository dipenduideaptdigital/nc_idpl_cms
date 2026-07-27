import React from 'react';
import heroBg from '../../assets/nc_home/hero.jpg';
import NatureFeaturesBar from './NatureFeaturesBar';

const NatureHero = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between bg-black text-white overflow-hidden pt-28 md:pt-36">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="NatureCube Aquascape"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
        />
        {/* Dark radial and linear gradients for contrast and atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060e05] via-transparent to-black/60" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Typography */}
        <div className="lg:col-span-7 space-y-3 md:space-y-4">
          <h1 className="font-reem text-3xl sm:text-5xl lg:text-6xl tracking-[0.08em] leading-[1.15] text-white uppercase font-light drop-shadow-lg">
            <div>NATURE HAS</div>
            <div>ALWAYS BEEN CALLING.</div>
          </h1>

          <div className="pt-4 md:pt-6 space-y-1">
            <h2 className="font-reem text-2xl sm:text-4xl lg:text-5xl tracking-[0.08em] leading-[1.15] text-white uppercase font-light">
              WE SIMPLY HELP YOU
            </h2>
            <div className="font-larken text-5xl sm:text-7xl lg:text-8xl text-zinc-100 font-normal italic tracking-normal transform -translate-y-2 select-none">
              answer
            </div>
          </div>
        </div>

        {/* Right Column: Empty space so hero.jpg's embedded 3D wireframe box is clearly visible */}
        <div className="hidden lg:block lg:col-span-5" />
      </div>

      {/* Bottom Features Highlight Bar */}
      <div className="relative z-20 w-full mt-auto">
        <NatureFeaturesBar />
      </div>
    </section>
  );
};

export default NatureHero;
