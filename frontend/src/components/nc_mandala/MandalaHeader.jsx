import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import naturecubeLogo from '../../assets/nc_logo/naturecube.png';
import OfferingsMegaMenu from '../layout/OfferingsMegaMenu';
import { resolveAssetUrl } from '../../utils/assetResolver';

const MandalaHeader = ({ data }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOfferingsOpen, setIsOfferingsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const location = useLocation();

  const handleLinkClick = (e) => {
    if (document.body.classList.contains('puck-mode')) {
      e.preventDefault();
    } else {
      setMobileMenuOpen(false);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOfferingsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOfferingsOpen(false);
    }, 150);
  };

  const isLinkActive = (href) => {
    if (!href || href.startsWith('#')) return false;
    if (href === '/') return location.pathname === '/';
    return location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
  };

  const navLinks = [
    { name: 'PHILOSOPHY', href: '/mandala' },
    { name: 'OFFERINGS', href: '#offerings', isMega: true },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'WHO WE ARE', href: '/about' },
    { name: 'KNOWLEDGE', href: '/blog' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent pt-6 pb-4 px-6 md:px-12 font-kanit pointer-events-auto">
      <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" onClick={handleLinkClick} className="flex items-center group">
          <img
            src={data?.logo ? resolveAssetUrl(data.logo) : naturecubeLogo}
            alt="NatureCube"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10 font-kanit">
          {navLinks.map((link) => {
            if (link.isMega) {
              return (
                <div
                  key={link.name}
                  className="relative group py-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={(e) => {
                      if (document.body.classList.contains('puck-mode')) e.preventDefault();
                      setIsOfferingsOpen(!isOfferingsOpen);
                    }}
                    className="font-kanit text-sm font-medium tracking-wide text-[#000000] hover:text-[#6CA844] transition-colors uppercase py-1 relative flex items-center gap-1 cursor-pointer"
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOfferingsOpen ? 'rotate-180 text-[#6CA844]' : ''}`} />
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#6CA844] transition-all duration-300 group-hover:w-full" />
                  </button>

                  {isOfferingsOpen && (
                    <OfferingsMegaMenu onClose={() => setIsOfferingsOpen(false)} />
                  )}
                </div>
              );
            }

            const isActive = isLinkActive(link.href);

            return link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                onClick={handleLinkClick}
                className={`font-kanit text-sm tracking-wide transition-colors uppercase py-1 relative group ${
                  isActive ? 'text-[#6CA844] font-semibold' : 'text-[#000000] hover:text-[#6CA844] font-medium'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[#6CA844] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={`font-kanit text-sm tracking-wide transition-colors uppercase py-1 relative group ${
                  isActive ? 'text-[#6CA844] font-semibold' : 'text-[#000000] hover:text-[#6CA844] font-medium'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[1.5px] bg-[#6CA844] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            );
          })}
        </nav>

        {/* Store CTA Button */}
        <div className="hidden lg:block">
          <a
            href="#store"
            onClick={handleLinkClick}
            className="font-kanit inline-flex items-center justify-center bg-[#6CA844] hover:bg-[#5f973a] text-white font-medium text-xs tracking-wider px-7 py-2.5 rounded-sm shadow-md transition-all duration-300 hover:shadow-[0_4px_15px_rgba(108,168,68,0.4)] uppercase"
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

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-6 right-6 bg-white/95 backdrop-blur-md text-zinc-900 p-6 rounded-lg border border-zinc-200 shadow-xl space-y-4 font-kanit z-50">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            return link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                onClick={handleLinkClick}
                className={`block text-sm tracking-widest uppercase ${
                  isActive ? 'text-[#6CA844] font-extrabold' : 'text-[#000000] hover:text-[#6CA844] font-bold'
                }`}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={`block text-sm tracking-widest uppercase ${
                  isActive ? 'text-[#6CA844] font-extrabold' : 'text-[#000000] hover:text-[#6CA844] font-bold'
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <a
            href="#store"
            onClick={handleLinkClick}
            className="block text-center bg-[#6CA844] hover:bg-[#5f973a] text-white font-bold text-xs tracking-widest px-6 py-3 rounded-sm uppercase mt-4"
          >
            STORE
          </a>
        </div>
      )}
    </header>
  );
};

export default MandalaHeader;