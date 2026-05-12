import React from 'react';
import { ChevronDown, Phone, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between text-white bg-gradient-to-b from-black/50 to-transparent">
      {/* Logo */}
      <div className="flex flex-col items-center cursor-pointer">
        <div className="text-3xl font-light tracking-widest relative">
          subh<span className="font-medium">AA</span>kritee
          <span className="absolute top-1 -right-4 text-[10px]">&trade;</span>
          <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-white/70"></div>
        </div>
        <div className="text-[10px] tracking-[0.2em] mt-1.5 uppercase opacity-80">
          The Design People
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center space-x-8 text-sm font-light">
        <a href="#" className="flex items-center hover:text-gray-300 transition-colors">
          Home <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </a>
        <a href="#" className="flex items-center hover:text-gray-300 transition-colors">
          Services <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </a>
        <a href="#" className="flex items-center hover:text-gray-300 transition-colors">
          Projects <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </a>
        <a href="#" className="hover:text-gray-300 transition-colors">
          Blog
        </a>
        <a href="#" className="hover:text-gray-300 transition-colors">
          Contact Us
        </a>
      </div>

      {/* Right Actions */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-white" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Contact Us</span>
            <span className="text-[10px] opacity-80">+91 9831-637-409</span>
          </div>
        </div>
        
        <button className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/30">
          Get A Quote!
        </button>

        <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all">
          <Search className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
