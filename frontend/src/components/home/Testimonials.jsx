import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  return (
    <section className="py-15 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          {/* Left: Badge */}
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                OUR CLIENTS SAY
              </span>
            </div>
          </div>
          
          {/* Right: Heading & Description */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Here's What <span className="text-primary">Warm Words</span> <br className="hidden md:block" />
              <span className="text-primary">Our Clients</span> Say
            </h2>
            <p className="text-gray-500 max-w-2xl font-light text-sm leading-relaxed">
              Our portfolio showcases a diverse range of projects, from beautifully crafted
              residential spaces functional and stylish commercial interiors
            </p>
          </div>
        </div>

        {/* Middle Section: Image and Review */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24 items-center">
          
          {/* Left: Image */}
          <div className="w-full h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
              alt="Office Interior" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Testimonial Content */}
          <div className="flex flex-col">
            
            {/* Rating Stats row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="text-6xl font-bold text-gray-900 tracking-tighter">4.80</div>
              
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="bg-primary text-white flex space-x-1 px-3 py-1.5 rounded-full shadow-md">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-white" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-900 pl-1">2,688 Reviews</span>
              </div>
              
              <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-[250px] sm:pl-4 sm:border-l border-gray-200">
                From Concept To Reality, The Team Turned My Vision Into A Stunning, Livable Space. I Couldn't Be Happier With This!
              </p>
            </div>
            
            <div className="w-full h-[1px] bg-gray-200 mb-8"></div>

            {/* Testimonial Quote */}
            <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg">
              "I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!"
            </p>

            {/* Author */}
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop" 
                alt="Morgan Dufresne" 
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Morgan Dufresne</span>
                <span className="text-[10px] text-gray-400">Company owner</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Logos */}
        <div className="pt-8">
          {/* Divider Text */}
          <div className="flex items-center justify-center mb-16">
            <div className="h-px bg-gray-200 flex-grow max-w-[200px] lg:max-w-[400px]"></div>
            <h3 className="px-6 text-xl md:text-2xl font-bold text-gray-900 whitespace-nowrap">
              Our Website <span className="text-primary">75000+</span> VIP Customer
            </h3>
            <div className="h-px bg-gray-200 flex-grow max-w-[200px] lg:max-w-[400px]"></div>
          </div>

          {/* Logos Grid */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-80">
            {['LOGO 01', 'LOGO 02', 'LOGO 03', 'LOGO 04', 'LOGO 04'].map((logo, index) => (
              <h4 key={index} className="text-2xl font-black text-gray-900 tracking-tighter">
                {logo}
              </h4>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
