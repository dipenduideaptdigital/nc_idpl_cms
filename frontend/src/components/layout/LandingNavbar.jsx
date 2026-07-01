import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logos/logo2.svg';

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${targetId}`);
    }
  };

  const handleCtaClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    window.dispatchEvent(new Event('open-consultation-modal'));
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between text-white bg-gradient-to-b from-black/50 to-transparent font-sans">
      {/* Logo Section */}
      <Link to="/" className="flex items-center cursor-pointer">
        <img 
          src={logo} 
          alt="Subhaakritee Logo" 
          className="h-10 md:h-12 w-auto object-contain" 
        />
      </Link>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center space-x-12 text-base font-light text-white">
        <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="hover:text-gray-300 transition-colors">
          Services
        </a>
        <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:text-gray-300 transition-colors">
          Projects
        </a>
        <a href="#process" onClick={(e) => handleNavClick(e, 'process')} className="hover:text-gray-300 transition-colors">
          Process
        </a>
        <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-gray-300 transition-colors">
          About
        </a>
        <a href="#blog" onClick={(e) => handleNavClick(e, 'blog')} className="hover:text-gray-300 transition-colors">
          Blog
        </a>
      </div>

      {/* Desktop CTA */}
      <div className="hidden lg:block">
        <button 
          onClick={handleCtaClick} 
          className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/30 cursor-pointer"
        >
          Book A Free Consultation
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden text-white hover:text-gray-300 transition-colors focus:outline-none p-1 z-50 cursor-pointer"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-zinc-950/98 backdrop-blur-lg flex flex-col justify-center items-center space-y-8 z-40 transition-transform duration-500 lg:hidden ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col items-center space-y-6 text-xl font-medium text-white">
          <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="hover:text-gray-300 transition-colors">
            Services
          </a>
          <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:text-gray-300 transition-colors">
            Projects
          </a>
          <a href="#process" onClick={(e) => handleNavClick(e, 'process')} className="hover:text-gray-300 transition-colors">
            Process
          </a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-gray-300 transition-colors">
            About
          </a>
          <a href="#blog" onClick={(e) => handleNavClick(e, 'blog')} className="hover:text-gray-300 transition-colors">
            Blog
          </a>
          <button 
            onClick={handleCtaClick} 
            className="mt-4 bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-blue-500/30 cursor-pointer"
          >
            Book A Free Consultation
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;