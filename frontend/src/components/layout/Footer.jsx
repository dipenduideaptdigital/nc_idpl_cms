import React from 'react';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-8 px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Logo & Info */}
          <div className="space-y-8">
            <div className="flex flex-col items-start cursor-pointer">
              <div className="text-4xl font-light tracking-widest relative pb-1">
                subh<span className="font-medium">AA</span>kritee
                <span className="absolute top-1 -right-5 text-sm">&trade;</span>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></div>
              </div>
              <div className="text-[10px] tracking-[0.2em] mt-1.5 uppercase font-medium">
                Interior Architecture
              </div>
              <div className="text-[8px] tracking-[0.3em] uppercase opacity-70 mt-0.5">
                The Design People
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs font-light">
              We transform your vision into beautifully crafted spaces.
            </p>
            
            <div className="space-y-3 pt-2">
              <h4 className="text-lg font-bold">Kolkata</h4>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[200px] font-light">
                Office: AG 40 , Sector II, Salt Lake City,<br />
                Kolkata: 700091
              </p>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="lg:pl-8">
            <ul className="space-y-5 text-gray-300 font-light text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 3: Links */}
          <div>
            <ul className="space-y-5 text-gray-300 font-light text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Our Project</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Partners Program</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Affiliate Program</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support Center</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">+91 9831-637-409</h3>
              <p className="text-gray-300 text-sm font-light">Subhaakritee@Hotmail.Com</p>
            </div>
            
            <div className="flex space-x-4 pt-12">
              <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-blue-600 transition-colors">
                <FaInstagram className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-blue-600 transition-colors">
                <FaTwitter className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-blue-600 transition-colors">
                <FaFacebookF className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
          
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-gray-400 font-light">
          <p>&copy; Copyright Subhaakritee - All Rights Reserved.</p>
          <p className="mt-4 md:mt-0">Designed & Developed By IdeaptDigital</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

