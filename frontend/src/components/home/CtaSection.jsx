import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8 max-w-7xl flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8 fadeInLeft">
          <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
          <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
            GET IN TOUCH
          </span>
        </div>
        
        {/* Headline */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-12 max-w-4xl fadeInRight">
          Have A Project In <span className="text-primary">Mind? Let's Make</span> It Happen
        </h2>
        
        {/* CTA Button */}
        <button className="group inline-flex items-center space-x-4 rounded-full border border-gray-300 hover:border-primary transition-colors pl-6 pr-2 py-2 opal-move-up">
          <span className="text-sm font-bold tracking-wide text-gray-700 group-hover:text-primary transition-colors">
            BOOK A FREE CONSULTATION
          </span>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md">
            <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </button>

      </div>
    </section>
  );
};

export default CtaSection;