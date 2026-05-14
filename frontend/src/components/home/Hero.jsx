import React from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import heroback from '../../assets/homepage/banner_back.png'
import herofront from '../../assets/homepage/banner_front.png'

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-900">
      {/* Main Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroback})`,
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content Area */}
          <div className="text-white max-w-2xl fadeInLeft">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-white/90">
                Fast and Reliable
              </span>
            </div>
            
            {/* Headlines */}
            <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
              End-To-End <br /> Office Interiors
            </h1>
            
            <p className="text-lg text-gray-200 mb-10 max-w-md font-light leading-relaxed">
              We specialize in transforming visions into reality.
              Explore our portfolio of innovative architectural and interior design projects crafted with precision.
            </p>
            
            {/* CTA Button */}
            <button className="group inline-flex items-center space-x-6 rounded-full border border-white/40 hover:border-white transition-all pl-6 pr-2 py-2">
              <span className="text-sm font-medium tracking-wide">BOOK A FREE CONSULTATION</span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Right Content Area - Glassmorphism Cards */}
          <div className="hidden lg:flex h-[500px] items-end justify-end gap-6 pb-4 fadeInRight">
            {/* Glass Card */}
            <div className="w-[280px] h-[280px] bg-[#3a3532]/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl z-20 flex flex-col justify-between shrink-0">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">250+</h2>
                <p className="text-xs text-gray-300 font-light">
                  My Design of art
                </p>
              </div>
              
              <div>
                <div className="w-8 h-[1px] bg-gray-500 mb-4"></div>
                <p className="text-lg text-white font-medium leading-tight">
                  There Is No One Who Loves Pain Itself
                </p>
              </div>
            </div>

            {/* Image Card */}
            <div className="w-[280px] h-[280px] rounded-[2rem] overflow-hidden shadow-2xl z-10 border-4 border-white/10 shrink-0">
              <img 
                src={herofront} 
                alt="Modern Interior" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Arrow Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 opal-move-up">
        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          <ArrowDown className="w-6 h-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Hero;
