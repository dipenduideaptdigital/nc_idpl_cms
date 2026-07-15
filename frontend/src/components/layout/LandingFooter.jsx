import React from 'react';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  const interiorDesignersList = [
    "Interior Designers In New Town",
    "Interior Designer Kolkata",
    "Interior Designers In Kolkata",
    "Office Interior Designers Kolkata",
    "Architecture In Kolkata",
    "Commercial Interior Designers Kolkata",
    "Interior Designers Bhubaneswar",
    "Architecture & Interior Designers Ranchi",
    "Interior Architecture Kolkata",
    "Interior Designer In Saltlake, Kolkata",
    "Hotel Interior And Architecture Designer"
  ];

  return (
    <footer className="bg-[#f7f8f7] w-full pt-16">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1: Logo & Socials */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex flex-col items-center mb-10 cursor-pointer">
              <div className="text-[38px] md:text-[46px] font-light tracking-wide relative leading-none mb-1 text-[#f39c5b]">
                subh<span className="font-medium text-[#25456f]">AA</span>kritee
                <span className="absolute top-2 -right-4 text-[10px] text-[#555]">&trade;</span>
                <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#f39c5b]"></div>
              </div>
              <div className="flex flex-col items-center mt-3 text-[#25456f]">
                <div className="text-[11px] md:text-[13px] font-bold tracking-widest opacity-90 leading-tight">
                  Interior Architecture
                </div>
                <div className="text-[9px] md:text-[10px] font-medium tracking-[0.25em] uppercase opacity-80 leading-tight">
                  The Design People
                </div>
              </div>
            </Link>

            <div className="flex space-x-6 ml-4">
              <a href="#" className="w-12 h-12 rounded-full bg-[#f39c5b] flex items-center justify-center hover:bg-[#e68a47] transition-colors shadow-sm">
                <FaInstagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#f39c5b] flex items-center justify-center hover:bg-[#e68a47] transition-colors shadow-sm">
                <FaTwitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#f39c5b] flex items-center justify-center hover:bg-[#e68a47] transition-colors shadow-sm">
                <FaFacebookF className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Interior Designers */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-black mb-6">Interior Designers</h3>
            <ul className="space-y-3.5">
              {interiorDesignersList.map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-[#555] hover:text-black text-[14px] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <h3 className="text-xl font-bold text-black mb-4">Kolkata</h3>
              <div className="space-y-3 text-[#555] text-[14px]">
                <p>Office: AG 40 , Sector II, Salt Lake City, Kolkata: 700091</p>
                <p>E-Mail: Info@Subhaakritee.Com</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-4">Contacts</h3>
              <div className="space-y-3 text-[#555] text-[14px]">
                <p>Phone No. : +91 9831-637-409 / 7980-913-189.</p>
                <p>Mobile No. : +91 9831-015-534</p>
                <p>Subhaakritee@Hotmail.Com</p>
                <p>Subhaakritee@Gmail.Com</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl flex flex-col md:flex-row justify-between items-center text-[#ddd] text-[15px]">
          <p className="mb-4 md:mb-0">&copy; Copyright Subhaakritee - All Rights Reserved.</p>
          <p>
            Designed & Developed By{' '}
            <a href="#" className="underline hover:text-white transition-colors">
              IdeaptDigital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
