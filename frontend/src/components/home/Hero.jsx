import React from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-900">
      {/* Main Background Image */}
      {/* <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")',
        }}
      > */}
        {/* Dark overlay for readability */}
        {/* <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div> */}

      <div className="container mx-auto px-8 relative z-10 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content Area */}
          <div className="text-white max-w-2xl">
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
          <div className="relative hidden lg:block h-[500px]">
            {/* Glass Card */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[320px] bg-[#3a3532]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl z-20">
              <h2 className="text-4xl font-bold text-white mb-2">250+</h2>
              <p className="text-sm text-gray-300 font-light mb-12">
                go for go
              </p>
              
              <div className="w-8 h-[1px] bg-gray-500 mb-6"></div>
              
              <p className="text-xl text-white font-medium leading-tight">
                There Is No One Who Loves Pain Itself
              </p>
            </div>

            {/* Overlapping Image Card */}
            {/* <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 w-[300px] h-[380px] rounded-3xl overflow-hidden shadow-2xl z-10 border-4 border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1964&auto=format&fit=crop" 
                alt="Modern Interior" 
                className="w-full h-full object-cover"
              />
            </div> */}
          </div>
          
        </div>
      </div>

      {/* Bottom Arrow Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          <ArrowDown className="w-6 h-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Hero;
