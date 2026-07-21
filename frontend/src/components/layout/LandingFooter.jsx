import React, { useState, useEffect } from 'react';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';

const LandingFooter = () => {
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

  const defaultInteriorDesigners = [
    { label: "Interior Designers In New Town", url: "#" },
    { label: "Interior Designer Kolkata", url: "#" },
    { label: "Interior Designers In Kolkata", url: "#" },
    { label: "Office Interior Designers Kolkata", url: "#" },
    { label: "Architecture In Kolkata", url: "#" },
    { label: "Commercial Interior Designers Kolkata", url: "#" },
    { label: "Interior Designers Bhubaneswar", url: "#" },
    { label: "Architecture & Interior Designers Ranchi", url: "#" },
    { label: "Interior Architecture Kolkata", url: "#" },
    { label: "Interior Designer In Saltlake, Kolkata", url: "#" },
    { label: "Hotel Interior And Architecture Designer", url: "#" }
  ];

  const address = footerData?.address || "Office: AG 40 , Sector II, Salt Lake City, Kolkata: 700091";
  const email = footerData?.email || "Info@Subhaakritee.Com";
  const email2 = footerData?.email2 || "Subhaakritee@Hotmail.Com";
  const phone = footerData?.phone || "+91 9831-637-409 / 7980-913-189.";
  const phone2 = footerData?.phone2 || "+91 9831-015-534";
  
  const instagram = footerData?.instagram || "#";
  const twitter = footerData?.twitter || "#";
  const facebook = footerData?.facebook || "#";

  const linksTitle1 = footerData?.linksTitle1 || "Interior Designers";
  const links1 = footerData?.links1 || defaultInteriorDesigners;

  const copyrightText = footerData?.copyrightText || "Copyright Subhaakritee - All Rights Reserved.";

  return (
    <footer className="bg-[#f7f8f7] w-full pt-16 text-left">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1: Logo & Socials */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex flex-col items-center mb-10 cursor-pointer">
              <div className="text-[38px] md:text-[46px] font-light tracking-wide relative leading-none mb-1 text-[#f39c5b]">
                subh<span className="font-medium text-[#25456f]">AA</span>kritee
                <span className="absolute top-2 -right-4 text-[10px] text-[#555]">&trade;</span>
                <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#f39c5b]"></div>
              </div>
              <div className="flex flex-col items-center mt-3 text-[#25456f]">
                <div className="text-[11px] md:text-[13px] font-bold tracking-widest opacity-90 leading-tight">
                  Interior Architecture
                </div>
                <div className="text-[9px] md:text-[10px] font-medium tracking-[0.25em] uppercase opacity-80 leading-tight">
                  The Design People
                </div>
              </div>
            </Link>

            <div className="flex space-x-6 ml-4">
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#f39c5b] flex items-center justify-center hover:bg-[#e68a47] transition-colors shadow-sm">
                <FaInstagram className="w-5 h-5 text-white" />
              </a>
              <a href={twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#f39c5b] flex items-center justify-center hover:bg-[#e68a47] transition-colors shadow-sm">
                <FaTwitter className="w-5 h-5 text-white" />
              </a>
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#f39c5b] flex items-center justify-center hover:bg-[#e68a47] transition-colors shadow-sm">
                <FaFacebookF className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Interior Designers */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-black mb-6">{linksTitle1}</h3>
            <ul className="space-y-3.5">
              {links1.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.url} className="text-[#555] hover:text-black text-[14px] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <h3 className="text-xl font-bold text-black mb-4">Kolkata</h3>
              <div className="space-y-3 text-[#555] text-[14px] whitespace-pre-line">
                <p>{address}</p>
                <p>E-Mail: {email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black mb-4">Contacts</h3>
              <div className="space-y-3 text-[#555] text-[14px]">
                <p>Phone No. : {phone}</p>
                {phone2 && <p>Mobile No. : {phone2}</p>}
                {email && <p>{email}</p>}
                {email2 && <p>{email2}</p>}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl flex flex-col md:flex-row justify-between items-center text-[#ddd] text-[15px]">
          <p className="mb-4 md:mb-0">&copy; {copyrightText}</p>
          <p>
            Designed & Developed By{' '}
            <a href="#" className="underline hover:text-white transition-colors">
              IdeaptDigital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;