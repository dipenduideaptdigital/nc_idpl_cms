import React, { useState, useEffect } from 'react';
import { ChevronDown, Phone, Search } from 'lucide-react';
import { pagesApi } from '../../api/pages';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logos/logo2.svg'; 

const Navbar = () => {
  const [pages, setPages] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await pagesApi.getPublicPages();
        setPages(response.data || []);
      } catch (err) {
        console.error('Failed to load navbar pages:', err);
      }
    };
    fetchPages();
  }, [location.pathname]);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between text-white bg-gradient-to-b from-black/50 to-transparent">
      {/* Logo Section */}
      <Link to="/" className="flex items-center cursor-pointer">
        <img 
          src={logo} 
          alt="Subhaakritee Logo" 
          className="h-10 md:h-12 w-auto object-contain" 
        />
      </Link>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center space-x-8 text-sm font-light">
        <a href="#" className="flex items-center hover:text-gray-300 transition-colors">
          Home <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </a>
        <a href="#" className="flex items-center hover:text-gray-300 transition-colors">
          Services <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </a>
        <a href="#" className="flex items-center hover:text-gray-300 transition-colors">
          Projects <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </a>
        
        {/* Dynamic Pages Dropdown */}
        <div className="relative group">
          <button className="flex items-center hover:text-gray-300 transition-colors py-2">
            Pages <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>
          
          <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 overflow-hidden text-gray-800 font-normal">
            {pages.length > 0 ? (
              <ul className="py-2">
                {pages.map((page) => (
                  <li key={page.id}>
                    <Link
                      to={page.fullPath ? (page.fullPath.startsWith('/') ? page.fullPath : `/${page.fullPath}`) : `/${page.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 italic">No pages found</div>
            )}
          </div>
        </div>

        <Link to="/blog" className="hover:text-gray-300 transition-colors py-2">
          Blog
        </Link>
        <Link to="/contact" className="hover:text-gray-300 transition-colors py-2">
          Contact Us
        </Link>
      </div>

      {/* Right Actions */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-white" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Contact Us</span>
            <span className="text-[10px] opacity-80">+91 9831-637-409</span>
          </div>
        </div>
        
        <button className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/30">
          Get A Quote!
        </button>

        <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all">
          <Search className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;