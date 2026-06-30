import React from 'react';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/logo2.svg';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-8 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Logo & Info */}
          <div className="space-y-6 flex flex-col items-center text-center lg:items-start lg:text-left">
            <Link to="/" className="flex items-center cursor-pointer transition-transform hover:scale-105">
              <img 
                src={logo} 
                alt="Subhaakritee Logo" 
                className="h-10 md:h-12 w-auto object-contain" 
              />
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-light">
              We transform your vision into beautifully crafted, highly functional living and working spaces.
            </p>
            
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-semibold tracking-wider text-gray-200 uppercase">Kolkata</h4>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[200px] font-light mx-auto lg:mx-0">
                Office: AG 40, Sector II, Salt Lake City,<br />
                Kolkata: 700091
              </p>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="col-span-1 lg:pl-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <h4 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-5">Company</h4>
            <ul className="space-y-3 text-gray-400 font-light text-sm flex flex-col items-center lg:items-start">
              <li><Link to="/about" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">About Us</Link></li>
              <li><Link to="/services" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">Services</Link></li>
              <li><Link to="/careers" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">Careers</Link></li>
              <li><Link to="/team" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">Our Team</Link></li>
              <li><Link to="/blog" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div className="col-span-1 flex flex-col items-center text-center lg:items-start lg:text-left">
            <h4 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-5">Support</h4>
            <ul className="space-y-3 text-gray-400 font-light text-sm flex flex-col items-center lg:items-start">
              <li><Link to="/projects" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">Our Projects</Link></li>
              <li><Link to="/partners" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">Partners</Link></li>
              <li><Link to="/terms" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">Terms & Conditions</Link></li>
              <li><Link to="/support" className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">Support Center</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-5">Get in Touch</h4>
              <h3 className="text-2xl font-light mb-2 hover:text-blue-500 transition-colors cursor-pointer">+91 9831-637-409</h3>
              <a href="mailto:Subhaakritee@Hotmail.Com" className="text-blue-400 text-sm font-light hover:text-blue-300 transition-colors">
                Subhaakritee@Hotmail.Com
              </a>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group">
                  <FaInstagram className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group">
                  <FaTwitter className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group">
                  <FaFacebookF className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group">
                  <FaLinkedinIn className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-800/50 text-xs text-gray-500 font-light space-y-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} Subhaakritee. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Designed & Developed By <a href="#" className="text-gray-300 font-medium hover:text-white transition-colors">IdeaptDigital</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;