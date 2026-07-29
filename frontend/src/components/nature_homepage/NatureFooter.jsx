import React from 'react';
import leaveIcon from '../../assets/nc_logo/leave.png';
import bushBg from '../../assets/nc_logo/bush3.png';

const NatureFooter = () => {
  const col1Links = [
    { name: 'OFFERINGS', href: '#offerings' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'PHILOSOPHY', href: '#philosophy' },
    { name: 'WHO WE ARE', href: '/about' },
    { name: 'KNOWLEDGE', href: '#knowledge' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  const col2Links = [
    { name: 'OUR PROJECTS', href: '/projects' },
    { name: 'RESOURCES', href: '#resources' },
    { name: 'OUR STORY', href: '/about' },
    { name: 'CONTACT US', href: '/contact' },
    { name: 'FAQS', href: '#faqs' },
  ];

  const col3Links = [
    { name: 'INSTAGRAM', href: 'https://instagram.com' },
    { name: 'FACEBOOK', href: 'https://facebook.com' },
    { name: 'YOUTUBE', href: 'https://youtube.com' },
    { name: 'LINKEDIN', href: 'https://linkedin.com' },
  ];

  return (
    <footer className="relative w-full bg-[#08171d] text-white pt-20 pb-10 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      
      {/* Soft Green Watercolor Splash Bottom-Left */}
      <div className="absolute -bottom-15 -left-35 w-[380px] sm:w-[520px] lg:w-[400px] h-auto pointer-events-none z-0 opacity-25">
        <img
          src={bushBg}
          alt=""
          className="w-full h-auto object-contain object-left-bottom filter brightness-125 transform rotate-180"
        />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Main Footer Navigation Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-16">
          
          {/* Brand Info (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            
            {/* NatureCube Logo */}
            <a href="/" className="inline-flex flex-col group mb-6">
              <div className="flex items-center tracking-[0.12em] text-white uppercase font-kanit">
                <span className="text-2xl sm:text-3xl font-light">NATURE</span>
                <span className="text-2xl sm:text-3xl font-normal ml-0.5">C</span>
                <img
                  src={leaveIcon}
                  alt="NatureCube Leaf"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain inline-block mx-0.5 filter brightness-110 contrast-125"
                />
                <span className="text-2xl sm:text-3xl font-normal">BE</span>
              </div>
              <span className="font-kanit text-[8px] sm:text-[9.5px] tracking-[0.26em] text-zinc-300 font-light uppercase mt-0.5 text-center">
                LIVING ART UNDER WATER
              </span>
            </a>

            {/* Description */}
            <p 
              className="font-reem font-normal text-sm sm:text-base text-[#E5EEE8] leading-[123%] tracking-[0%] align-middle max-w-[400px]"
              style={{ fontWeight: 400, lineHeight: '123%', letterSpacing: '0%', verticalAlign: 'middle', color: '#E5EEE8' }}
            >
              It is a long established fact that a reader will be distracted. It is a long established fact that a reader will be distracted.
            </p>

          </div>

          {/* Nav Links & Store Button (8 Columns) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            
            {/* Column 1 */}
            <div className="flex flex-col space-y-4">
              {col1Links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="font-kanit text-sm sm:text-base font-normal tracking-wider text-zinc-200 hover:text-[#7BA641] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-4">
              {col2Links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="font-kanit text-sm sm:text-base font-normal tracking-wider text-zinc-200 hover:text-[#7BA641] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Column 3 & Store Button */}
            <div className="flex flex-col justify-between">
              <div className="flex flex-col space-y-4 mb-8">
                {col3Links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-kanit text-sm sm:text-base font-normal tracking-wider text-zinc-200 hover:text-[#7BA641] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Store Button */}
              <div className="pt-2">
                <a
                  href="#store"
                  className="w-full    sm:w-[175px] h-[52px] bg-[#6CA844] hover:bg-[#5f973a] text-white font-kanit font-normal text-xl sm:text-2xl leading-[100%] tracking-[0%] uppercase align-middle rounded-md transition-colors flex items-center justify-center shadow-md opacity-100"
                  style={{ fontWeight: 400, lineHeight: '100%', letterSpacing: '0%', verticalAlign: 'middle' }}
                >
                  STORE
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="border-t border-zinc-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm text-zinc-400 font-kanit font-light">
          
          {/* Left Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
            <span>&copy; NATURECUBE 2026. ALL RIGHTS RESERVED.</span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span>
              DESIGNED & DEVELOPED BY{' '}
              <a
                href="https://ideaptdigital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white transition-colors"
              >
                IDEAPTDIGITAL
              </a>
            </span>
          </div>

          {/* Right Legal Links */}
          <div className="flex items-center gap-6 sm:gap-8 tracking-wider">
            <a href="/privacy" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              TERMS & CONDITIONS
            </a>
            <a href="/sitemap" className="hover:text-white transition-colors">
              SITEMAP
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default NatureFooter;
