import React, { useState, useEffect } from 'react';
import leaveIcon from '../../assets/nc_logo/leave.png';
import bushBg from '../../assets/nc_logo/bush3.png';
import apiClient from '../../api/client';

const isFaqLink = (link) => /^faqs?$/i.test(link.label?.trim() || '') || /^[/#]faqs?\/?$/i.test(link.url || '');
const resolveFooterUrl = (link) => {
  if (isFaqLink(link)) return '/faq';
  if (/^(shop|store)$/i.test(link.label?.trim() || '') || /^[/#](shop|store)\/?$/i.test(link.url || '')) return '/shop';
  return link.url;
};

const NatureFooter = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_footer');
        if (res.data?.data?.content) {
          setFooterData(res.data.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch footer data", error);
      }
    };
    fetchFooterData();
  }, []);


  const col1Links = footerData?.links1?.length > 0 ? footerData.links1 : [
    { id: '1', label: 'PHILOSOPHY', url: '/mandala' },
    { id: '2', label: 'OFFERINGS', url: '#offerings' },
    { id: '3', label: 'PROJECTS', url: '/projects' },
    { id: '4', label: 'WHO WE ARE', url: '/about' },
    { id: '5', label: 'KNOWLEDGE', url: '/blog' },
    { id: '6', label: 'CONTACT US', url: '/contact' },
  ];

  // Column 2 Links
  const savedCol2Links = footerData?.links2?.length > 0 ? footerData.links2 : [
    { id: '1', label: 'OUR PROJECTS', url: '/projects' },
    { id: '2', label: 'RESOURCES', url: '#resources' },
    { id: '3', label: 'OUR STORY', url: '/about' },
    { id: '4', label: 'CONTACT US', url: '/contact' },
    { id: '5', label: 'FAQS', url: '/faq' },
  ];
  const col2Links = [...col1Links, ...savedCol2Links].some(isFaqLink)
    ? savedCol2Links
    : [...savedCol2Links, { id: 'static-faq', label: 'FAQS', url: '/faq' }];

  // Dynamic Social Links (Uses the new Drag & Drop array from backend)
  const socialLinks = footerData?.socialLinks?.length > 0 ? footerData.socialLinks : [
    { id: '1', label: 'INSTAGRAM', url: 'https://instagram.com' },
    { id: '2', label: 'FACEBOOK', url: 'https://facebook.com' },
    { id: '3', label: 'YOUTUBE', url: 'https://youtube.com' },
    { id: '4', label: 'LINKEDIN', url: 'https://linkedin.com' }
  ];

  // Texts & Legal Links (Cleaned up generic/interior design fallbacks)
  const description = footerData?.description || "At NatureCube, we bring the beauty and tranquility of nature right into your living spaces through bespoke aquascapes, terrariums, and living art.";
  const copyrightText = footerData?.copyrightText || "© NATURECUBE 2026. ALL RIGHTS RESERVED.";
  const privacyUrl = footerData?.privacyUrl || "/privacy";
  const termsUrl = footerData?.termsUrl || "/terms";
  const sitemapUrl = footerData?.sitemapUrl || "/sitemap";

  return (
    <footer className="relative w-full bg-[#06232B] text-white pt-12 sm:pt-16 lg:pt-20 pb-10 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      {/* Background Bush Decorative Image */}
      <div className="absolute -bottom-4 -left-[200px] w-[380px] sm:w-[500px] lg:w-[360px]  pointer-events-none z-0 opacity-95">
        <img
          src={bushBg}
          alt=""
          className="w-full h-auto object-contain  filter brightness-70 transform rotate-310"
        />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-start pb-12 sm:pb-16">

          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            {/* NatureCube Logo */}
            <a href="/" aria-label="NatureCube home" className="inline-flex flex-col mb-6 group">
              <div className="flex items-center text-white uppercase font-century-gothic tracking-[0.055em]">
                <span className="text-2xl sm:text-3xl font-light">NATURE</span>
                <span className="text-2xl sm:text-3xl font-normal ml-0.5">C</span>
                <img
                  src={leaveIcon}
                  alt=""
                  aria-hidden="true"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain inline-block mx-0.5 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                />
                <span className="text-2xl sm:text-3xl font-normal">BE</span>
                <sup className="relative -top-2 ml-px text-[7px] sm:text-[8px] font-normal leading-none normal-case">™</sup>
              </div>
              <span className="self-end -mt-px mr-2 font-century-gothic text-[7px] sm:text-[8px] tracking-[0.06em] text-white/90 font-normal uppercase leading-none whitespace-nowrap">
                LIVING ART UNDER WATER
              </span>
              {/*
              <img src={natureCubeLogo} alt="NatureCube — Living Art Under Water" className="h-12 sm:h-14 w-auto object-contain" />
              */}
            </a>

            {/* Description */}
            <p className="font-reem font-normal text-sm sm:text-base text-[#E5EEE8] leading-[135%] tracking-[0%] align-middle max-w-[400px]">
              {description}
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col space-y-8 sm:space-y-10">
            {/* Nav Links Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 items-start">

              {/* Column 1 */}
              <div className="flex flex-col space-y-3.5 sm:space-y-4">
                {col1Links.map((link) => (
                  <a
                    key={link.id}
                    href={resolveFooterUrl(link)}
                    className="font-kanit text-sm sm:text-base font-normal tracking-wider text-zinc-200 hover:text-[#6CA844] transition-colors uppercase"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col space-y-3.5 sm:space-y-4">
                {col2Links.map((link) => (
                  <a
                    key={link.id}
                    href={resolveFooterUrl(link)}
                    className="font-kanit text-sm sm:text-base font-normal tracking-wider text-zinc-200 hover:text-[#6CA844] transition-colors uppercase"
                  >
                    {link.label}
                  </a>
                ))}

                {/* Store Button below Column 2 links */}
                <div className="pt-2 sm:pt-3">
                  <a
                    href="/shop"
                    className="w-[130px] sm:w-[145px] h-[38px] sm:h-[42px] bg-[#6CA844] hover:bg-[#5f973a] text-white font-kanit font-normal text-base sm:text-lg uppercase rounded-md transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    STORE
                  </a>
                </div>
              </div>

              {/* Column 3 - Social Links */}
              <div className="flex flex-col space-y-3.5 sm:space-y-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-kanit text-sm sm:text-base font-normal tracking-wider text-zinc-200 hover:text-[#6CA844] transition-colors uppercase"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="border-t border-zinc-800/80 pt-8 flex flex-col lg:flex-row items-center lg:items-end justify-evenly gap-6 text-xs sm:text-sm text-zinc-400 font-kanit font-light">

          {/* Left Copyright */}
          <div className="flex flex-col items-center lg:items-start gap-1 sm:gap-1.5 text-center sm:text-left uppercase">
            <span>{copyrightText}</span>
            <span>
              DESIGNED & DEVELOPED BY{' '}
              <a
                href="https://ideaptdigital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-2"
              >
                IDEAPTDIGITAL
              </a>
            </span>
          </div>

          {/* Right Legal Links */}
          <div className="flex items-center gap-6 sm:gap-8 tracking-wider mt-4 lg:mt-0">
            <a href={privacyUrl} className="hover:text-white transition-colors uppercase">
              PRIVACY POLICY
            </a>
            <a href={termsUrl} className="hover:text-white transition-colors uppercase">
              TERMS & CONDITIONS
            </a>
            <a href={sitemapUrl} className="hover:text-white transition-colors uppercase">
              SITEMAP
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default NatureFooter;
