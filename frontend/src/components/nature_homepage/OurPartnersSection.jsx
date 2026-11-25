import DOMPurify from 'dompurify';
import HeadingReveal from '../../animations/HeadingReveal';
import Reveal from '../../animations/Reveal';
import PartnerColumn from '../../animations/PartnerColumn';

import juwelLogo from '../../assets/nc_logo/juwel.png';
import ntlabsLogo from '../../assets/nc_logo/ntlabs.png';
import oaseLogo from '../../assets/nc_logo/oase.png';
import adaLogo from '../../assets/nc_logo/ada.jpg';
import swaLogo from '../../assets/nc_logo/rsz_swa_logo.png';
import aquaticLogo from '../../assets/nc_logo/aquatic.png';
import brushBg from '../../assets/nc_logo/bush3.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';
  return baseUrl + path;
};

// Keep the CMS's source slots intact; swap JUWEL (0) and ADA (4) when displaying them.
const defaultPartnerLogos = [juwelLogo, oaseLogo, swaLogo, ntlabsLogo, adaLogo, aquaticLogo];

const OurPartnersSection = ({ data }) => {
  const mainTitle1 = data?.mainTitle1 || 'OUR';
  const italicTitle = data?.italicTitle || 'partners';
  const headline = data?.headline || 'Trusted by Leading<br />Innovators in Web3.';
  const paragraph = data?.paragraph || 'If you use this site regularly and would like to help keep the site on the Internet, please consider donating a small sum to help pay for the hosting and bandwidth bill.';
  const buttonText = data?.buttonText || 'STORE';
  const buttonLink = /^(shop|store)$/i.test(buttonText.trim()) || !data?.buttonLink || data.buttonLink === '#store'
    ? '/shop'
    : data.buttonLink;

  const getLogo = (index) => data?.partnerLogos?.[index]
    ? getAssetUrl(data.partnerLogos[index])
    : defaultPartnerLogos[index];
  const column1Partners = [getLogo(4), getLogo(1), getLogo(2)];
  const column2Partners = [getLogo(3), getLogo(0), getLogo(5)];

  if (data?.isVisible === false) return null;

  return (
    <section className="relative w-full min-w-0 overflow-hidden bg-white px-4 py-12 select-none min-[360px]:px-5 sm:px-8 sm:py-16 lg:px-20 lg:py-20">
      <div className="absolute bottom-[12%] left-[-5%] w-[250px] sm:w-[300px] lg:w-[500px] pointer-events-none z-0 opacity-100 transform -scale-y-100">
        <img src={brushBg} alt="" loading="lazy" decoding="async" className="w-full h-auto object-contain" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1200px] min-w-0 grid-cols-1 items-start gap-8 min-[360px]:gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex min-w-0 flex-col items-start pt-0 pr-0 lg:col-span-5 lg:pt-1 lg:pr-6">
          <HeadingReveal className="mb-6 sm:mb-8">
            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-reem text-[28px] font-bold uppercase leading-[0.9] text-black min-[360px]:text-3xl sm:text-4xl lg:text-[42px]">
                {mainTitle1}
              </span>
              <span className="font-larken text-[34px] font-normal italic lowercase leading-none text-[#6CAB44] min-[360px]:text-4xl sm:text-5xl lg:text-[56px]">
                {italicTitle}
              </span>
            </span>
          </HeadingReveal>

          <Reveal
            className="mt-2 mb-6 max-w-lg break-words font-kanit text-[26px] font-medium leading-[1.18] text-[#363636] min-[360px]:text-[28px] sm:mt-4 sm:mb-8 sm:text-4xl lg:text-[40px] lg:leading-[111%] [&_*]:max-w-full [&_*]:break-words"
            contentClassName="[&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(headline) }}
          />
          <Reveal
            delay={0.15}
            className="mb-6 max-w-lg break-words font-kanit text-[15px] font-light leading-relaxed text-[#6A6A6A] min-[360px]:text-base sm:mb-8 sm:text-xl lg:text-[22px] lg:leading-[34px] [&_*]:max-w-full [&_*]:break-words"
            contentClassName="[&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraph) }}
          />
          <Reveal delay={0.2} className="px-1 pb-1 -mx-1">
            <a
              href={buttonLink}
              className="inline-flex items-center gap-3 bg-[#6CA844] hover:bg-[#5a9436] text-white px-5 py-2.5 mt-1 sm:mt-2 rounded-xs transition-colors shadow-sm group"
            >
              <span className="font-kanit font-bold text-xs sm:text-sm tracking-wider uppercase">{buttonText}</span>
              <span className="w-6 h-6 rounded-full bg-[#1b2b16] flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </a>
          </Reveal>
        </div>

        <div className="mt-1 w-full min-w-0 lg:col-span-7 lg:-mt-6">
          <div className="mx-auto grid w-full max-w-[600px] min-w-0 grid-cols-2 items-start gap-x-0 min-[360px]:gap-x-1 sm:gap-x-4 lg:mx-0 lg:gap-x-2 xl:ml-auto">
            <PartnerColumn logos={column1Partners} direction="up" />
            <PartnerColumn logos={column2Partners} direction="down" className="mt-10 lg:mt-16" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPartnersSection;
