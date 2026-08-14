import React from 'react';
import leaveIcon from '../../assets/nc_logo/leave.png';
import bushBg from '../../assets/nc_logo/bush3.png';

const NatureFooter = () => {
  const col1Links = [
    { name: 'OFFERINGS', href: '#offerings' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'PHILOSOPHY', href: '/mandala' },
    { name: 'WHO WE ARE', href: '/about' },
    { name: 'KNOWLEDGE', href: '/blog' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  const col2Links = [
    { name: 'OUR PROJECTS', href: '/projects' },
    { name: 'RESOURCES', href: '#resources' },
    { name: 'OUR STORY', href: '/about' },
    { name: 'CONTACT US', href: '/contact' },
    { name: 'FAQS', href: '#faqs' },
  ];

  const socialLinks = [
    { name: 'INSTAGRAM', href: 'https://instagram.com' },
    { name: 'FACEBOOK', href: 'https://facebook.com' },
    { name: 'YOUTUBE', href: 'https://youtube.com' },
    { name: 'LINKEDIN', href: 'https://linkedin.com' },
  ];

  return (
    <footer className="relative w-full bg-[#08171d] text-white pt-12 sm:pt-16 lg:pt-20 pb-10 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      <div className="absolute -bottom-15 -left-35 w-[380px] sm:w-[520px] lg:w-[400px] h-auto pointer-events-none z-0 opacity-25">
        <img
          src={bushBg}
          alt=""
          className="w-full h-auto object-contain object-left-bottom filter brightness-125 transform rotate-180"
        />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-start pb-12 sm:pb-16">
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            
            {/* NatureCube Logo */}
            <a href="/" className="inline-flex flex-col group mb-6">
              <div className="flex items-center tracking-[0.12em] text-white uppercase font-kanit">
                <span className="text-2xl sm:text-3xl font-light">NATURE</span>
                <span className="text-2xl sm:text-3xl font-normal ml-0.5">C</span>
                <img
                  src={leaveIcon}
                  alt="NatureCube Leaf"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain inline-block mx-0.5 filter brightness-110 contrast-125 transition-transform duration-300 group-hover:rotate-12"
                />
                <span className="text-2xl sm:text-3xl font-normal">BE</span>
              </div>
              <span className="font-kanit text-[8px] sm:text-[9.5px] tracking-[0.26em] text-zinc-300 font-light uppercase mt-0.5 text-center">
                LIVING ART UNDER WATER
              </span>
            </a>

            {/* Description */}
            <p 
              className="font-reem font-normal text-sm sm:text-base text-[#E5EEE8] leading-[135%] tracking-[0%] align-middle max-w-[400px]"
            >
              It is a long established fact that a reader will be distracted. It is a long established fact that a reader will be distracted.
            </p>

          </div>

          <div className="lg:col-span-8 flex flex-col space-y-8 sm:space-y-10">
            {/* Nav Links Grid */}
            <div className="grid grid-cols-2 gap-8 sm:gap-12 items-start">
              
              {/* Column 1 */}
              <div className="flex flex-col space-y-3.5 sm:space-y-4">
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
              <div className="flex flex-col space-y-3.5 sm:space-y-4">
                {col2Links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    className="font-kanit text-sm sm:text-base font-normal tracking-wider text-zinc-200 hover:text-[#7BA641] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}

                {/* Store Button below FAQS */}
                <div className="pt-2 sm:pt-3">
                  <a
                    href="#store"
                    className="w-[130px] sm:w-[145px] h-[38px] sm:h-[42px] bg-[#6CA844] hover:bg-[#5f973a] text-white font-kanit font-normal text-base sm:text-lg uppercase rounded-md transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    STORE
                  </a>
                </div>
              </div>

            </div>

            {/* Social Media Links in Same Row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-2 sm:pt-4">
              {socialLinks.map((link, idx) => (
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
                className="hover:text-white transition-colors"
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