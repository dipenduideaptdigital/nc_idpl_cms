import React, { useState,useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import naturecubeLogo from '../../assets/nc_logo/naturecube.png';
import leaveIcon from '../../assets/nc_logo/leave.png';
import OfferingsMegaMenu from '../layout/OfferingsMegaMenu';
import apiClient from '../../api/client';

const NatureNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOfferingsOpen, setIsOfferingsOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);

  const [dynamicPaths, setDynamicPaths] = useState({
    about: '/about',
    mandala: '/mandala'
  });

  useEffect(() => {
    const fetchDynamicNavbarSlugs = async () => {
      try {
        const res = await apiClient.get('/pages/public'); 
        const pages = res.data?.data || res.data || [];
        const newPaths = { ...dynamicPaths };

        pages.forEach(page => {
          if (page.template === 'about-page') newPaths.about = `/${page.slug}`;
          if (page.template === 'mandala-page') newPaths.mandala = `/${page.slug}`;
        });

        setDynamicPaths(newPaths);
      } catch (error) {
        console.error("Failed to fetch dynamic slugs for navbar", error);
      }
    };
    fetchDynamicNavbarSlugs();
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOfferingsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOfferingsOpen(false);
    }, 150);
  };

  const lightPages = [dynamicPaths.about, dynamicPaths.mandala, '/living-mandalas', '/contact', '/services', '/projects', '/blog'];
  const isLightPage = lightPages.includes(location.pathname) || lightPages.some(p => p !== '/' && location.pathname.startsWith(p));

  const navLinks = [
    { name: 'PHILOSOPHY', href: '#philosophy' },
    { name: 'OFFERINGS', href: '#offerings', isMega: true },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'WHO WE ARE', href: dynamicPaths.about },
    { name: 'KNOWLEDGE', href: '#knowledge' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  // Light Background Navbar Layout
  if (isLightPage) {
    return (
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent pt-6 pb-4 px-6 md:px-12 transition-all font-kanit">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={naturecubeLogo}
              alt="NatureCube"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10">
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
                      onClick={() => setIsOfferingsOpen(!isOfferingsOpen)}
                      className="text-xs font-bold tracking-[0.18em] text-[#000000] hover:text-[#7BA641] transition-colors uppercase py-1 relative flex items-center gap-1 cursor-pointer"
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOfferingsOpen ? 'rotate-180 text-[#7BA641]' : ''}`} />
                      <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#000000] transition-all duration-300 group-hover:w-full" />
                    </button>

                    {isOfferingsOpen && (
                      <OfferingsMegaMenu onClose={() => setIsOfferingsOpen(false)} />
                    )}
                  </div>
                );
              }

              return link.href.startsWith('/') ? (
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
              );
            })}
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
          <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-md rounded-lg p-6 border border-zinc-200 shadow-xl space-y-4 font-kanit">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold tracking-widest text-[#000000] hover:text-[#7BA641] transition-colors uppercase"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold tracking-widest text-[#000000] hover:text-[#7BA641] transition-colors uppercase"
                >
                  {link.name}
                </a>
              )
            ))}
            <a
              href="#store"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-[#7BA641] text-white font-semibold text-xs tracking-widest px-6 py-3 rounded-sm uppercase mt-4"
            >
              STORE
            </a>
          </div>
        )}
      </header>
    );
  }

  // Dark Background Navbar Layout (for Home page & dark theme pages)
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent pt-6 pb-4 px-6 md:px-12 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <div className="flex items-center tracking-[0.12em] text-white uppercase font-kanit">
              <span className="text-2xl md:text-3xl font-light">NATURE</span>
              <span className="text-2xl md:text-3xl font-normal ml-0.5">C</span>
              <img
                src={leaveIcon}
                alt="NatureCube Leaf"
                className="w-5 h-5 md:w-6 md:h-6 object-contain inline-block mx-0.5 filter brightness-110 contrast-125"
              />
              <span className="text-2xl md:text-3xl font-normal">BE</span>
            </div>
            <span className="font-kanit text-[8px] md:text-[9.5px] tracking-[0.26em] text-zinc-300 font-light uppercase mt-0.5 text-center">
              LIVING ART UNDER WATER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
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
                    onClick={() => setIsOfferingsOpen(!isOfferingsOpen)}
                    className="font-kanit text-xs font-normal tracking-[0.18em] text-zinc-100 hover:text-emerald-400 transition-colors uppercase py-1 relative flex items-center gap-1 cursor-pointer"
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOfferingsOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                  </button>

                  {isOfferingsOpen && (
                    <OfferingsMegaMenu onClose={() => setIsOfferingsOpen(false)} />
                  )}
                </div>
              );
            }

            return link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                className="font-kanit text-xs font-normal tracking-[0.18em] text-zinc-100 hover:text-emerald-400 transition-colors uppercase py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-emerald-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="font-kanit text-xs font-normal tracking-[0.18em] text-zinc-100 hover:text-emerald-400 transition-colors uppercase py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-emerald-400 transition-all duration-300 group-hover:w-full" />
              </a>
            );
          })}
        </nav>

        {/* Store CTA Button */}
        <div className="hidden lg:block">
          <a
            href="#store"
            className="font-kanit inline-flex items-center justify-center bg-[#7BA641] hover:bg-[#6b9337] text-white font-medium text-xs tracking-[0.18em] px-6 py-2.5 rounded-sm shadow-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(123,166,65,0.4)] uppercase"
          >
            STORE
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white p-2 focus:outline-none"
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
        <div className="lg:hidden mt-4 bg-zinc-950/95 backdrop-blur-md rounded-lg p-6 border border-zinc-800 space-y-4 font-kanit">
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-normal tracking-widest text-zinc-200 hover:text-emerald-400 transition-colors uppercase"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-normal tracking-widest text-zinc-200 hover:text-emerald-400 transition-colors uppercase"
              >
                {link.name}
              </a>
            )
          ))}
          <a
            href="#store"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center bg-[#7BA641] text-white font-medium text-xs tracking-widest px-6 py-3 rounded-sm uppercase mt-4 font-kanit"
          >
            STORE
          </a>
        </div>
      )}
    </header>
  );
};

export default NatureNavbar;