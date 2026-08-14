import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import naturecubeLogo from '../../assets/nc_logo/naturecube.png';

const AboutHeroPanel = ({ data }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headlineLine1 = data?.headlineLine1 || "LOOK DEEP INTO NATURE, AND THEN YOU WILL";
  const headlineLine2 = data?.headlineLine2 || "UNDERSTAND EVERYTHING BETTER";
  const subtext = data?.subtext || "We are evolving the landscape of how nature and science bringing peace in your inner world.";
  const yearsExp = data?.yearsExp || "25+";
  const sinceYear = data?.sinceYear || "SINCE 2010";
  const clientCount = data?.clientCount || "+100K SATISFIED CLIENTS";

  const navLinks = [
    { name: 'PHILOSOPHY', href: '#philosophy' },
    { name: 'OFFERINGS', href: '#offerings' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'WHO WE ARE', href: '/about' },
    { name: 'KNOWLEDGE', href: '/blog' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  return (
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-900 flex-shrink-0 relative flex flex-col justify-between pt-6 sm:pt-8 pb-12 sm:pb-16 px-6 sm:px-12 lg:px-20 z-10 select-none font-kanit">

      <div className="w-full flex items-center justify-between pt-2 pb-4 relative z-30">
        <Link to="/" className="flex items-center group">
          <img
            src={naturecubeLogo}
            alt="NatureCube"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-12">
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-xs font-bold tracking-[0.18em] text-[#000000] hover:text-[#7BA641] transition-colors uppercase py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#000000] transition-all duration-300 group-hover:w-full" />
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold tracking-[0.18em] text-[#000000] hover:text-[#7BA641] transition-colors uppercase py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#000000] transition-all duration-300 group-hover:w-full" />
              </a>
            )
          ))}
        </nav>

        {/* Store CTA Button */}
        <div className="hidden lg:block">
          <a
            href="#store"
            className="inline-flex items-center justify-center bg-[#7BA641] hover:bg-[#6b9337] text-white font-semibold text-xs tracking-[0.18em] px-7 py-2.5 rounded-sm shadow-md transition-all duration-300 hover:shadow-[0_4px_15px_rgba(123,166,65,0.4)] uppercase"
          >
            STORE
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#000000] p-2 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-6 right-6 bg-white/98 text-zinc-900 p-6 rounded-lg border border-zinc-200 shadow-xl space-y-4 font-kanit z-50">
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold tracking-widest text-[#000000] hover:text-[#7BA641] uppercase"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold tracking-widest text-[#000000] hover:text-[#7BA641] uppercase"
              >
                {link.name}
              </a>
            )
          ))}
        </div>
      )}

      {/* Top Headline & Subtext */}
      <div className="max-w-4xl space-y-4 my-auto">
        <h1 className="leading-tight">
          <span className="font-reem-fun text-[#6A6A6A] font-semibold text-2xl sm:text-3xl lg:text-[34px] tracking-tight block uppercase">
            {headlineLine1}
          </span>
          <span className="font-reem-fun text-[#1E293B] font-bold text-3xl sm:text-5xl lg:text-[56px] tracking-tight block uppercase mt-1 leading-none">
            {headlineLine2}
          </span>
        </h1>

        <div 
          className="text-[#6A6A6A] font-medium text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed pt-2 [&>p]:mb-0 tiptap-content"
          dangerouslySetInnerHTML={{ __html: subtext }}
        />
      </div>

      {/* Bottom Left Badges */}
      <div className="flex items-center gap-6 sm:gap-10 mb-4 sm:mb-8">
        <div className="bg-[#7BA641] text-white p-6 sm:p-8 w-44 sm:w-52 aspect-square flex flex-col justify-center shadow-lg flex-shrink-0">
          <span className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-none">
            {yearsExp}
          </span>
          <span className="font-bold text-xs sm:text-sm tracking-wider uppercase mt-3">
            YEARS OF
          </span>
          <span className="font-bold text-xs sm:text-sm tracking-wider uppercase">
            EXPERIENCE
          </span>
        </div>

        <div className="flex flex-col justify-center space-y-1">
          <span className="text-[#1E293B] font-bold text-lg sm:text-xl lg:text-2xl tracking-wide uppercase">
            {sinceYear}
          </span>
          <span className="text-[#7BA641] font-bold text-base sm:text-lg lg:text-xl tracking-wide uppercase">
            {clientCount}
          </span>
        </div>
      </div>

    </div>
  );
};

export default AboutHeroPanel;