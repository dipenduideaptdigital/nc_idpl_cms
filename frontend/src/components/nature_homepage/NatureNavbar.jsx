import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import navbarLogo from '../../assets/nc_logo/NCWhite.png';
// Previous navbar logo retained for an easy rollback:
// import naturecubeLogo from '../../assets/nc_logo/naturecube.png';
import OfferingsMegaMenu from '../layout/OfferingsMegaMenu';
import apiClient from '../../api/client';
import useNavbarAppearance from '../../animations/useNavbarAppearance';

const NatureNavbar = ({ forceDark = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // States for Mega Menu (Hardcoded fallback)
  const [isOfferingsOpen, setIsOfferingsOpen] = useState(false);
  
  // States for Dynamic Menu
  const [dbMenu, setDbMenu] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null); // Tracks which dynamic desktop dropdown is open
  const [openMobileDropdownId, setOpenMobileDropdownId] = useState(null); // Tracks mobile nested menus

  const location = useLocation();
  const timeoutRef = useRef(null);
  const headerRef = useRef(null);

  const [dynamicPaths, setDynamicPaths] = useState({
    about: '/about',
    mandala: '/mandala',
    ripple: '/ripples',
    gulmo: '/gulmo',
    prakriti: '/prakriti-lab',
    workshop: '/workshop'
  });

  // Fetch Dynamic Slugs for Fallback
  useEffect(() => {
    const fetchDynamicNavbarSlugs = async () => {
      try {
        const res = await apiClient.get('/pages/public'); 
        const pages = res.data?.data || res.data || [];
        const newPaths = { about: '/about', mandala: '/mandala', ripple: '/ripples', gulmo: '/gulmo', prakriti: '/prakriti-lab', workshop: '/workshop' };

        pages.forEach(page => {
          if (page.template === 'about-page') newPaths.about = `/${page.slug}`;
          if (page.template === 'mandala-page') newPaths.mandala = `/${page.slug}`;
          if (page.template === 'ripple-page') newPaths.ripple = `/${page.slug}`;
          if (page.template === 'gulmo-page') newPaths.gulmo = `/${page.slug}`;
          if (page.template === 'prakriti-page') newPaths.prakriti = `/${page.slug}`;
          if (page.template === 'workshop-page') newPaths.workshop = `/${page.slug}`;
        });

        setDynamicPaths(newPaths);
      } catch (error) {
        console.error("Failed to fetch dynamic slugs for navbar", error);
      }
    };
    fetchDynamicNavbarSlugs();
  }, []);

  //Fetch Dynamic Header Menu from DB
  useEffect(() => {
    const fetchDynamicMenu = async () => {
      try {
        const res = await apiClient.get('/cms/section/global_header_menu');
        const menuItems = res.data?.data?.content?.menuItems;
        if (Array.isArray(menuItems) && menuItems.length > 0) {
          setDbMenu(menuItems);
        }
      } catch (error) {
        console.error("Failed to fetch dynamic menu, using fallback.", error);
      }
    };
    fetchDynamicMenu();
  }, []);

  const handleMouseEnter = (menuType, id = null) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (menuType === 'mega') {
      setIsOfferingsOpen(true);
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
      setIsOfferingsOpen(false);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOfferingsOpen(false);
      setOpenDropdownId(null);
    }, 150);
  };

  const lightPages = [dynamicPaths.about, dynamicPaths.mandala, '/living-mandalas','/services'];
  const isLightPage = !forceDark && (lightPages.includes(location.pathname) || lightPages.some(p => p !== '/' && location.pathname.startsWith(p)));

  const { scrolled, dark } = useNavbarAppearance(headerRef, !isLightPage, location.key);
  const lightText = !scrolled && dark;

  // Final Menu Calculation (Use DB if exists, otherwise Fallback)
  const finalMenu = (dbMenu || [
    { id: 'f1', label: 'PHILOSOPHY', url: dynamicPaths.mandala },
    { id: 'f2', label: 'OFFERINGS', url: '#offerings', isMega: true },
    { id: 'f3', label: 'PROJECTS', url: '/projects' },
    { id: 'f4', label: 'WHO WE ARE', url: dynamicPaths.about },
    { id: 'f5', label: 'KNOWLEDGE', url: '/blog' },
    { id: 'f6', label: 'CONTACT US', url: '/contact' },
  ]).map((link) => {
    // The CMS menu schema does not store isMega. Restore the built-in
    // Offerings menu when a saved item has no custom submenu.
    if ((link.isMega || link.label?.trim().toLowerCase() === 'offerings') && !link.children?.length) {
      return {
        ...link,
        isMega: true,
        children: [
          { id: 'offer-ripple', label: 'Ripple', url: dynamicPaths.ripple },
          { id: 'offer-gulmo', label: 'Gulmo', url: dynamicPaths.gulmo },
          { id: 'offer-prakriti', label: 'Prakriti Lab', url: dynamicPaths.prakriti },
          { id: 'offer-workshop', label: 'Workshop', url: dynamicPaths.workshop },
        ],
      };
    }
    return link;
  });

  // LIGHT BACKGROUND NAVBAR 
  if (isLightPage) {
    return (
      <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 pt-6 pb-4 px-6 md:px-12 font-kanit motion-safe:transition-colors motion-safe:duration-500 ${scrolled ? 'bg-white' : 'bg-transparent'}`}>
        <div data-navbar-content className="relative isolate max-w-7xl min-[1921px]:max-w-[70vw] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src={navbarLogo} alt="NatureCube" className="h-10 sm:h-12 w-auto object-contain brightness-0" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-kanit">
            {finalMenu.map((link) => {
              // A. Fallback Mega Menu
              if (link.isMega) {
                return (
                  <div key={link.id} className="relative group py-2" onMouseEnter={() => handleMouseEnter('mega')} onMouseLeave={handleMouseLeave}>
                    <button onClick={() => setIsOfferingsOpen(!isOfferingsOpen)} className="font-kanit text-sm font-medium tracking-wide text-[#000000] hover:text-[#7BA641] transition-colors uppercase py-1 relative flex items-center gap-1 cursor-pointer">
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOfferingsOpen ? 'rotate-180 text-[#7BA641]' : ''}`} />
                      <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#000000] transition-all duration-300 group-hover:w-full" />
                    </button>
                    {isOfferingsOpen && <OfferingsMegaMenu onClose={() => setIsOfferingsOpen(false)} />}
                  </div>
                );
              }

              // Dynamic Sub-Menu (From DB)
              if (link.children && link.children.length > 0) {
                return (
                  <div key={link.id} className="relative group py-2" onMouseEnter={() => handleMouseEnter('dynamic', link.id)} onMouseLeave={handleMouseLeave}>
                    <button onClick={() => setOpenDropdownId(openDropdownId === link.id ? null : link.id)} aria-expanded={openDropdownId === link.id} className="font-kanit text-sm font-medium tracking-wide text-[#000000] hover:text-[#7BA641] transition-colors uppercase py-1 relative flex items-center gap-1 cursor-pointer">
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdownId === link.id ? 'rotate-180 text-[#7BA641]' : ''}`} />
                      <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#000000] transition-all duration-300 group-hover:w-full" />
                    </button>
                    {openDropdownId === link.id && (
                      <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-zinc-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                        {link.children.map(child => (
                          <Link key={child.id} to={child.url} onClick={() => setOpenDropdownId(null)} className="block px-4 py-2.5 text-sm font-medium tracking-wide uppercase rounded-lg transition-colors text-zinc-700 hover:text-[#7BA641] hover:bg-zinc-50">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Standard Links
              return link.url.startsWith('/') ? (
                <Link key={link.id} to={link.url} className="font-kanit text-sm font-medium tracking-wide text-[#000000] hover:text-[#7BA641] transition-colors uppercase py-1 relative group">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#000000] transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="font-kanit text-sm font-medium tracking-wide text-[#000000] hover:text-[#7BA641] transition-colors uppercase py-1 relative group">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#000000] transition-all duration-300 group-hover:w-full" />
                </a>
              );
            })}
          </nav>

          {/* Store CTA Button */}
          <div className="hidden lg:block">
            <a href="#store" className="font-kanit inline-flex items-center justify-center bg-[#7BA641] hover:bg-[#6b9337] text-white font-medium text-xs tracking-wider px-7 py-2.5 rounded-sm shadow-md transition-all duration-300 hover:shadow-[0_4px_15px_rgba(123,166,65,0.4)] uppercase">
              STORE
            </a>
          </div>

          {/* Mobile Hamburger / Close Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-[#000000] p-2 focus:outline-none cursor-pointer transition-transform duration-300 transform active:scale-90" aria-label="Toggle Menu">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <Menu className={`w-6 h-6 absolute inset-0 transition-all duration-300 ease-out transform ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`w-6 h-6 absolute inset-0 transition-all duration-300 ease-out transform ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
            </div>
          </button>

        </div>

        {/* Mobile Menu Dropdown Slider */}
        <div className={`lg:hidden grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'grid-rows-[1fr] opacity-100 mt-4 pointer-events-auto' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
          <div className="overflow-hidden">
            <div className={`transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-4 scale-95'} bg-white/75 backdrop-blur-2xl rounded-2xl p-6 border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.8)] space-y-2 font-kanit`}>
              {finalMenu.map((link, idx) => {
                if (link.children && link.children.length > 0) {
                  return (
                    <div key={link.id} className="w-full" style={{ transitionDelay: `${idx * 30}ms` }}>
                      <button onClick={() => setOpenMobileDropdownId(openMobileDropdownId === link.id ? null : link.id)} className="w-full flex items-center justify-between text-sm font-medium tracking-wide text-[#000000] hover:text-[#7BA641] hover:bg-black/5 px-4 py-3 rounded-xl transition-all duration-200 uppercase">
                        {link.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openMobileDropdownId === link.id ? 'rotate-180' : ''}`} />
                      </button>
                      {openMobileDropdownId === link.id && (
                        <div className="pl-6 border-l-2 border-zinc-200 ml-6 my-2 space-y-1 animate-in fade-in slide-in-from-top-1">
                          {link.children.map(child => (
                            <Link key={child.id} to={child.url} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-medium tracking-wide text-zinc-600 hover:text-[#7BA641] uppercase">
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return link.url.startsWith('/') ? (
                  <Link key={link.id} to={link.url} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium tracking-wide text-[#000000] hover:text-[#7BA641] hover:bg-black/5 px-4 py-3 rounded-xl border border-transparent hover:border-black/5 transition-all duration-200 uppercase" style={{ transitionDelay: `${idx * 30}ms` }}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.id} href={link.url} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium tracking-wide text-[#000000] hover:text-[#7BA641] hover:bg-black/5 px-4 py-3 rounded-xl border border-transparent hover:border-black/5 transition-all duration-200 uppercase" style={{ transitionDelay: `${idx * 30}ms` }}>
                    {link.label}
                  </a>
                );
              })}
              <a href="#store" onClick={() => setMobileMenuOpen(false)} className="block text-center bg-[#7BA641]/90 hover:bg-[#7BA641] text-white font-medium text-xs tracking-wider px-6 py-3.5 rounded-xl shadow-[0_4px_15px_rgba(123,166,65,0.4)] backdrop-blur-md transition-all duration-300 uppercase mt-4">
                STORE
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ================= DARK BACKGROUND NAVBAR =================
  return (
    <header ref={headerRef} className={'fixed isolate top-0 left-0 right-0 z-50 pt-6 pb-4 px-6 md:px-12 motion-safe:transition-colors motion-safe:duration-500 ' + (scrolled ? 'bg-white text-black' : lightText ? 'bg-transparent text-white' : 'bg-transparent text-black')}>
      <div aria-hidden="true" className={'absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none motion-safe:transition-opacity motion-safe:duration-500 ' + (lightText ? 'opacity-100' : 'opacity-0')} />
      <div data-navbar-content className="relative isolate max-w-7xl min-[1921px]:max-w-[70vw] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src={navbarLogo}
            alt="NatureCube"
            className={'h-10 sm:h-12 w-auto object-contain motion-safe:transition-[filter] motion-safe:duration-500 ' + (lightText ? '' : 'brightness-0')}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden lg:flex items-center space-x-8 xl:space-x-10 font-kanit ${scrolled ? '[&_a]:!transition-none [&_button]:!transition-none' : ''}`}>
          {finalMenu.map((link) => {
            // A. Fallback Mega Menu
            if (link.isMega) {
              return (
                <div key={link.id} className="relative group py-2" onMouseEnter={() => handleMouseEnter('mega')} onMouseLeave={handleMouseLeave}>
                  <button onClick={() => setIsOfferingsOpen(!isOfferingsOpen)} className="font-kanit text-sm font-medium tracking-wide text-inherit hover:text-[#7BA641] transition-colors uppercase py-1 relative flex items-center gap-1 cursor-pointer">
                    <span>{link.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOfferingsOpen ? 'rotate-180 text-[#7BA641]' : ''}`} />
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#7BA641] transition-all duration-300 group-hover:w-full" />
                  </button>
                  {isOfferingsOpen && <OfferingsMegaMenu onClose={() => setIsOfferingsOpen(false)} />}
                </div>
              );
            }

            // Dynamic Sub-Menu (From DB)
            if (link.children && link.children.length > 0) {
              return (
                <div key={link.id} className="relative group py-2" onMouseEnter={() => handleMouseEnter('dynamic', link.id)} onMouseLeave={handleMouseLeave}>
                    <button onClick={() => setOpenDropdownId(openDropdownId === link.id ? null : link.id)} aria-expanded={openDropdownId === link.id} className="font-kanit text-sm font-medium tracking-wide text-inherit hover:text-[#7BA641] transition-colors uppercase py-1 relative flex items-center gap-1 cursor-pointer">
                    <span>{link.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdownId === link.id ? 'rotate-180 text-[#7BA641]' : ''}`} />
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#7BA641] transition-all duration-300 group-hover:w-full" />
                  </button>
                  {openDropdownId === link.id && (
                    <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-[#070e06]/95 backdrop-blur-md rounded-xl shadow-xl border border-zinc-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      {link.children.map(child => (
                        <Link key={child.id} to={child.url} onClick={() => setOpenDropdownId(null)} className="block px-4 py-2.5 text-sm font-medium tracking-wide uppercase rounded-lg transition-colors text-zinc-300 hover:text-[#7BA641] hover:bg-zinc-800/80">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Standard Links
            return link.url.startsWith('/') ? (
              <Link key={link.id} to={link.url} className="font-kanit text-sm font-medium tracking-wide text-inherit hover:text-[#7BA641] transition-colors uppercase py-1 relative group">
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#7BA641] transition-all duration-300 group-hover:w-full" />
              </Link>
            ) : (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="font-kanit text-sm font-medium tracking-wide text-inherit hover:text-[#7BA641] transition-colors uppercase py-1 relative group">
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#7BA641] transition-all duration-300 group-hover:w-full" />
              </a>
            );
          })}
        </nav>

        {/* Store CTA Button */}
        <div className="hidden lg:block">
          <a href="#store" className="font-kanit inline-flex items-center justify-center bg-[#7BA641] hover:bg-[#6b9337] text-white font-medium text-xs tracking-wider px-6 py-2.5 rounded-sm shadow-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(123,166,65,0.4)] uppercase">
            STORE
          </a>
        </div>

        {/* Mobile Hamburger / Close Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-inherit p-2 focus:outline-none cursor-pointer transition-transform duration-300 transform active:scale-90" aria-label="Toggle Menu">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <Menu className={`w-6 h-6 absolute inset-0 transition-all duration-300 ease-out transform ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
            <X className={`w-6 h-6 absolute inset-0 transition-all duration-300 ease-out transform ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown Slider */}
      <div className={`lg:hidden grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'grid-rows-[1fr] opacity-100 mt-4 pointer-events-auto' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
        <div className="overflow-hidden">
          <div className={`transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-4 scale-95'} bg-[#070e06]/75 backdrop-blur-2xl rounded-2xl p-6 border border-[#7BA641]/25 shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.15)] space-y-2 font-kanit`}>
            {finalMenu.map((link, idx) => {
              if (link.children && link.children.length > 0) {
                return (
                  <div key={link.id} className="w-full" style={{ transitionDelay: `${idx * 30}ms` }}>
                    <button onClick={() => setOpenMobileDropdownId(openMobileDropdownId === link.id ? null : link.id)} className="w-full flex items-center justify-between text-sm font-medium tracking-wide text-zinc-100 hover:text-[#7BA641] hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-200 uppercase">
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openMobileDropdownId === link.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openMobileDropdownId === link.id && (
                      <div className="pl-6 border-l-2 border-zinc-800 ml-6 my-2 space-y-1 animate-in fade-in slide-in-from-top-1">
                        {link.children.map(child => (
                          <Link key={child.id} to={child.url} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-medium tracking-wide text-zinc-400 hover:text-[#7BA641] uppercase transition-colors">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return link.url.startsWith('/') ? (
                <Link key={link.id} to={link.url} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium tracking-wide text-zinc-100 hover:text-[#7BA641] hover:bg-white/10 px-4 py-3 rounded-xl border border-transparent hover:border-[#7BA641]/20 transition-all duration-200 uppercase" style={{ transitionDelay: `${idx * 30}ms` }}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.id} href={link.url} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium tracking-wide text-zinc-100 hover:text-[#7BA641] hover:bg-white/10 px-4 py-3 rounded-xl border border-transparent hover:border-[#7BA641]/20 transition-all duration-200 uppercase" style={{ transitionDelay: `${idx * 30}ms` }}>
                  {link.label}
                </a>
              );
            })}
            <a href="#store" onClick={() => setMobileMenuOpen(false)} className="block text-center bg-[#7BA641]/90 hover:bg-[#7BA641] text-white font-medium text-xs tracking-wider px-6 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(123,166,65,0.4)] backdrop-blur-md transition-all duration-300 border border-[#7BA641]/30 uppercase mt-4 font-kanit">
              STORE
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NatureNavbar;
