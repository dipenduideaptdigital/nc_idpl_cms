import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-8 lg:px-16 py-6 flex items-center justify-between text-white bg-transparent">
      {/* Logo */}
      <Link to="/" className="flex flex-col items-center cursor-pointer">
        <div className="text-[32px] md:text-[38px] font-light tracking-wide relative leading-none mb-1">
          subh<span className="font-medium">AA</span>kritee
          <span className="absolute top-1 -right-3 text-[10px]">&trade;</span>
          <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white"></div>
        </div>
        <div className="flex flex-col items-center mt-3">
          <div className="text-[9px] md:text-[11px] font-medium tracking-widest uppercase opacity-90 leading-tight">
            Interior Architecture
          </div>
          <div className="text-[8px] md:text-[9px] font-light tracking-[0.25em] uppercase opacity-80 leading-tight">
            The Design People
          </div>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center space-x-12 text-[16px] font-medium text-white/95">
        <Link to="/about-us" className="hover:text-white hover:opacity-80 transition-opacity">
          About Us
        </Link>
        <Link to="/services" className="hover:text-white hover:opacity-80 transition-opacity">
          Services
        </Link>
        <Link to="/gallery" className="hover:text-white hover:opacity-80 transition-opacity">
          Gallery
        </Link>
        <Link to="/contacts" className="hover:text-white hover:opacity-80 transition-opacity">
          Contacts
        </Link>
      </div>

      {/* Right Action */}
      <div className="hidden md:flex items-center">
        <button className="bg-[#da7b2f] hover:bg-[#c46d29] text-white px-8 py-3 rounded text-[16px] font-medium transition-all shadow-sm">
          Get Free Estimated
        </button>
      </div>
      
      {/* Mobile Menu Icon (optional simple fallback) */}
      <div className="lg:hidden flex items-center">
        <button className="text-white hover:text-gray-300 focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default LandingNavbar;
