import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import about_img from "../../assets/homepage/about_img.png"
const AboutSection = () => {
  return (
    <section className="py-24 bg-[#1a1a1a] overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="text-white max-w-xl fadeInLeft">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-600 mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
              <span className="text-[10px] uppercase tracking-widest font-medium text-gray-300">
                STARTED IN 1991
              </span>
            </div>
            
            {/* Headline */}
            <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-10 tracking-tight">
              Where Spaces Inspire, And <span className="text-primary">Design Comes Alive</span>
            </h2>
            
            {/* Checkmarks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-10">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-primary" strokeWidth={3} />
                <span className="font-semibold text-sm">Latest Technologies</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-primary" strokeWidth={3} />
                <span className="font-semibold text-sm">High-Quality Designs</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-primary" strokeWidth={3} />
                <span className="font-semibold text-sm">10 Years Warranty</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-primary" strokeWidth={3} />
                <span className="font-semibold text-sm">Residential Design</span>
              </div>
            </div>
            
            {/* Paragraph Text */}
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-10 max-w-md">
              Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life. Our numbers speak better than words:
            </p>
            
            {/* CTA Button */}
            <button className="group inline-flex items-center space-x-6 rounded-full border border-gray-500 hover:border-white transition-all pl-6 pr-2 py-2">
              <span className="text-sm font-medium tracking-wide">More About Us</span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-lg">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Right Column: Image */}
          <div className="relative h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl fadeInRight">
            <img 
              src={about_img} 
              alt="Modern Residential Exterior" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
