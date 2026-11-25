import React from 'react';
import { resolveAssetUrl } from '../../utils/assetResolver';
import { mergeMegaMenu } from '../../config/offeringsMegaMenu';
import { Link } from 'react-router-dom';
import rippleImage from '../../assets/nc_home/aqua2.png';
import gulmoImage from '../../assets/nc_mandala/gulmo_tank.png';
import prakritiCardImage from '../../assets/nc_mandala/prakriti-lab-card.png';

function FallbackImage({ image, fallback, className }) {
  return <img src={resolveAssetUrl(image, fallback)} alt="" className={className}
    onError={event => { if (event.currentTarget.getAttribute('src') !== fallback) event.currentTarget.src = fallback; }} />;
}

const safePath = (value, fallback) => /^\/(?![\/\\])[^\\\s]*$/.test(value || '') ? value : fallback;

export default function OfferingsMegaMenuPanel({ links, content, onClose, onMouseEnter, onMouseLeave }) {
  const menu = mergeMegaMenu(content);
  return (
    <div
      id="offerings-mega-menu"
      className="absolute inset-x-0 top-full z-[100] max-h-[calc(100dvh-88px)] overflow-y-auto overscroll-contain border-t-2 border-[#6ca844] bg-[#f6faef] font-outfit text-[#24383b] shadow-[0_16px_24px_rgb(0_0_0_/_8%)] motion-safe:animate-offerings-menu-reveal max-lg:hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={menu.label}
    >
      <div className="mx-auto grid w-[89.4%] max-w-[1600px] grid-cols-[1fr_1.16fr_1.02fr] items-stretch gap-[clamp(28px,5.5vw,88px)] py-[clamp(32px,3.8vw,64px)] lg:max-xl:w-[92%] lg:max-xl:grid-cols-[1fr_1.1fr_1fr] lg:max-xl:gap-7">
        <div className="flex flex-col items-start">
          <span className="h-[5px] w-[86px] bg-[#6ca844]" aria-hidden="true" />
          <p className="mb-[34px] mt-11 text-[17px] font-medium lg:max-xl:mb-[22px] lg:max-xl:mt-7">{menu.label}</p>
          <h2 className="m-0 text-[clamp(26px,2.25vw,38px)] font-normal leading-[1.5] text-[#363636] lg:max-xl:text-[26px]"><strong className="font-semibold">{menu.headingLine1}</strong><br />{menu.headingLine2}</h2>
          <p className="mt-[30px] whitespace-pre-line text-[clamp(15px,1.15vw,19px)] font-medium leading-[1.5]">
            {menu.description}
          </p>
          <p className="mt-auto pt-9 text-[clamp(14px,1.1vw,18px)] font-semibold tracking-[0.025em] text-[#4a712e]">{menu.tagline}</p>
        </div>

        <div className="grid grid-rows-2 gap-[clamp(24px,2.4vw,38px)]">
          {[
            { id: 'ripple', label: menu.ripple.title, href: safePath(menu.ripple.href, links.ripple), image: menu.ripple.image, fallback: rippleImage },
            { id: 'gulmo', label: menu.gulmo.title, href: safePath(menu.gulmo.href, links.gulmo), image: menu.gulmo.image, fallback: gulmoImage },
          ].map(({ id, label, href, image, fallback }) => (
            <Link key={id} to={href} onClick={onClose} className="grid min-h-[138px] grid-cols-[56.3%_1fr] overflow-hidden rounded-[3px] bg-white text-[#24383b] no-underline shadow-[0_2px_12px_rgb(0_0_0_/_24%)] transition-[box-shadow,color] duration-[250ms] ease-in-out hover:text-[#4a712e] hover:shadow-[0_4px_16px_rgb(0_0_0_/_28%)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844] motion-reduce:transition-none">
              <div className="relative min-w-0 after:absolute after:inset-0 after:bg-[linear-gradient(110deg,transparent_35%,rgb(6_35_43_/_70%))]">
                <FallbackImage image={image} fallback={fallback} className="absolute size-full object-cover" />
              </div>
              <span className="flex items-center justify-center p-5 text-lg">{label}</span>
            </Link>
          ))}
        </div>

        <div className="relative isolate flex flex-col justify-between gap-12 overflow-hidden rounded-[3px] bg-[#06232b] p-[clamp(28px,3.3vw,54px)] text-white lg:max-xl:p-7">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <FallbackImage image={menu.prakriti.image} fallback={prakritiCardImage} className="size-full object-cover object-center brightness-[.58]" />
          </div>
          <div className="flex flex-col items-start">
            <Link to={safePath(menu.prakriti.href, links.prakriti)} onClick={onClose} className="text-[clamp(25px,2vw,34px)] font-semibold leading-[1.25] text-inherit no-underline transition-colors duration-[250ms] hover:text-[#a4cf86] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844] motion-reduce:transition-none">{menu.prakriti.title}</Link>
            {/* <Link to={links.workshop} onClick={onClose} className="mt-[3px] text-[19px] font-light text-inherit no-underline transition-colors duration-[250ms] hover:text-[#a4cf86] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844] motion-reduce:transition-none">Workshop</Link> */}
          </div>
          <p className="m-0 text-[clamp(18px,1.45vw,24px)] font-light leading-[1.4] tracking-[0.025em] text-[#d1dcdd]">{menu.prakriti.description}</p>
        </div>
      </div>
    </div>
  );
}
