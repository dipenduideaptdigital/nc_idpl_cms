import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import leaveIcon from '../../assets/nc_logo/leave.png';

const NatureNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'PHILOSOPHY', href: '#philosophy' },
    { name: 'OFFERINGS', href: '#offerings' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'WHO WE ARE', href: '/about' },
    { name: 'KNOWLEDGE', href: '#knowledge' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent pt-6 pb-4 px-6 md:px-12 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <div className="flex items-center tracking-[0.12em] text-white uppercase font-kanit">
              <span className="text-2xl md:text-3xl font-light">NATURE</span>
              <span className="text-2xl md:text-3xl font-normal ml-0.5">C</span>
              {/* Imported Leaf Logo Icon from nc_logo */}
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
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
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
            )
          ))}
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
