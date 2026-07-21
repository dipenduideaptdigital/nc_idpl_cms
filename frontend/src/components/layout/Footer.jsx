import React, { useState, useEffect } from 'react';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/logo2.svg';
import apiClient from '../../api/client';

const defaultCompanyLinks = [
  { label: "About Us", url: "/about" },
  { label: "Services", url: "/services" },
  { label: "Careers", url: "/careers" },
  { label: "Our Team", url: "/team" },
  { label: "Blog", url: "/blog" },
  { label: "Contact Us", url: "/contact" }
];

const defaultSupportLinks = [
  { label: "Our Project", url: "/projects" },
  { label: "Partners", url: "/partners" },
  { label: "Partners Program", url: "/partners-program" },
  { label: "Affiliate Program", url: "/affiliate-program" },
  { label: "Terms & Conditions", url: "/terms" },
  { label: "Support Center", url: "/support" }
];

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_footer');
        if (res.data?.success && res.data?.data?.content) {
          setFooterData(res.data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch footer settings:', error);
      }
    };
    fetchFooter();
  }, []);

  const description = footerData?.description || "We transform your vision into beautifully crafted spaces.";
  const address = footerData?.address || "Office: AG 40 , Sector II, Salt Lake City,\nKolkata: 700091";
  const phone = footerData?.phone || "+91 9831-637-409";
  const email = footerData?.email || "Subhaakritee@Hotmail.Com";
  
  const instagram = footerData?.instagram || "#";
  const twitter = footerData?.twitter || "#";
  const facebook = footerData?.facebook || "#";
  const linkedin = footerData?.linkedin || "#";

  const linksTitle1 = footerData?.linksTitle1 || "Support";
  const linksTitle2 = footerData?.linksTitle2 || "Company";

  const links1 = footerData?.links1 || defaultSupportLinks;
  const links2 = footerData?.links2 || defaultCompanyLinks;

  const copyrightText = footerData?.copyrightText || `Copyright Subhaakritee - All Rights Reserved.`;

  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-8 px-6 text-left">
      <div className="container mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Logo & Info */}
          <div className="space-y-6 flex flex-col items-start text-left sm:items-center sm:text-center lg:items-start lg:text-left">
            <Link to="/" className="flex items-center cursor-pointer transition-transform hover:scale-105">
              <img 
                src={logo} 
                alt="Subhaakritee Logo" 
                className="h-10 md:h-12 w-auto object-contain" 
              />
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] font-light">
              {description}
            </p>
            
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-semibold tracking-wider text-gray-200 uppercase">Kolkata</h4>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[200px] font-light mx-0 sm:mx-auto lg:mx-0 whitespace-pre-line">
                {address}
              </p>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="col-span-1 lg:pl-8 flex flex-col items-start text-left sm:items-center sm:text-center lg:items-start lg:text-left">
            <ul className="space-y-3 text-gray-400 font-light text-sm flex flex-col items-start sm:items-center lg:items-start">
              {links2.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.url} className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div className="col-span-1 flex flex-col items-start text-left sm:items-center sm:text-center lg:items-start lg:text-left">
            <ul className="space-y-3 text-gray-400 font-light text-sm flex flex-col items-start sm:items-center lg:items-start">
              {links1.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.url} className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-8 flex flex-col items-start text-left sm:items-center sm:text-center lg:items-start lg:text-left">
            <div>
              <h3 className="text-2xl font-light mb-2 hover:text-blue-500 transition-colors cursor-pointer">{phone}</h3>
              <a href={`mailto:${email}`} className="text-blue-400 text-sm font-light hover:text-blue-300 transition-colors">
                {email}
              </a>
            </div>
            
            <div>
              <div className="flex space-x-4">
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group">
                  <FaInstagram className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href={twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group">
                  <FaTwitter className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group">
                  <FaFacebookF className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group">
                  <FaLinkedinIn className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-800/50 text-xs text-gray-500 font-light space-y-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} {copyrightText}</p>
          <p className="flex items-center gap-1">
            Designed & Developed By <a href="#" className="text-gray-300 font-medium hover:text-white transition-colors">IdeaptDigital</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;