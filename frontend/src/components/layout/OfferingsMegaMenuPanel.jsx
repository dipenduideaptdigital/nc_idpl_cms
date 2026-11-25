import React from 'react';
import { Link } from 'react-router-dom';
import rippleImage from '../../assets/nc_home/aqua2.png';
import gulmoImage from '../../assets/nc_mandala/gulmo_tank.png';
import prakritiCardImage from '../../assets/nc_mandala/prakriti-lab-card.png';

export default function OfferingsMegaMenuPanel({ links, onClose, onMouseEnter, onMouseLeave }) {
  return (
    <div
      id="offerings-mega-menu"
      className="absolute inset-x-0 top-full z-[100] max-h-[calc(100dvh-88px)] overflow-y-auto overscroll-contain border-t-2 border-[#6ca844] bg-[#f6faef] font-outfit text-[#24383b] shadow-[0_16px_24px_rgb(0_0_0_/_8%)] motion-safe:animate-offerings-menu-reveal max-lg:hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label="Offerings"
    >
      <div className="mx-auto grid w-[89.4%] max-w-[1600px] grid-cols-[1fr_1.16fr_1.02fr] items-stretch gap-[clamp(28px,5.5vw,88px)] py-[clamp(32px,3.8vw,64px)] lg:max-xl:w-[92%] lg:max-xl:grid-cols-[1fr_1.1fr_1fr] lg:max-xl:gap-7">
        <div className="flex flex-col items-start">
          <span className="h-[5px] w-[86px] bg-[#6ca844]" aria-hidden="true" />
          <p className="mb-[34px] mt-11 text-[17px] font-medium lg:max-xl:mb-[22px] lg:max-xl:mt-7">OFFERINGS</p>
          <h2 className="m-0 text-[clamp(26px,2.25vw,38px)] font-normal leading-[1.5] text-[#363636] lg:max-xl:text-[26px]"><strong className="font-semibold">Lorem Ipsum Dolor</strong><br />Sit Amet, Consectetur</h2>
          <p className="mt-[30px] text-[clamp(15px,1.15vw,19px)] font-medium leading-[1.5]">
            Liquid landscapes mirrored in mindful art,<br />a living mandala&apos;s heart.
          </p>
          <p className="mt-auto pt-9 text-[clamp(14px,1.1vw,18px)] font-semibold tracking-[0.025em] text-[#4a712e]">RESET . RENEW . REBUILD</p>
        </div>

        <div className="grid grid-rows-2 gap-[clamp(24px,2.4vw,38px)]">
          {[
            { label: 'Ripple', href: links.ripple, image: rippleImage },
            { label: 'Gulmo', href: links.gulmo, image: gulmoImage },
          ].map(({ label, href, image }) => (
            <Link key={label} to={href} onClick={onClose} className="grid min-h-[138px] grid-cols-[56.3%_1fr] overflow-hidden rounded-[3px] bg-white text-[#24383b] no-underline shadow-[0_2px_12px_rgb(0_0_0_/_24%)] transition-[box-shadow,color] duration-[250ms] ease-in-out hover:text-[#4a712e] hover:shadow-[0_4px_16px_rgb(0_0_0_/_28%)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844] motion-reduce:transition-none">
              <div className="relative min-w-0 after:absolute after:inset-0 after:bg-[linear-gradient(110deg,transparent_35%,rgb(6_35_43_/_70%))]">
                <img src={image} alt="" className="absolute size-full object-cover" />
              </div>
              <span className="flex items-center justify-center p-5 text-lg">{label}</span>
            </Link>
          ))}
        </div>

        <div className="relative isolate flex flex-col justify-between gap-12 overflow-hidden rounded-[3px] bg-[#06232b] p-[clamp(28px,3.3vw,54px)] text-white lg:max-xl:p-7">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <img src={prakritiCardImage} alt="" className="size-full object-cover object-center brightness-[.58]" />
          </div>
          <div className="flex flex-col items-start">
            <Link to={links.prakriti} onClick={onClose} className="text-[clamp(25px,2vw,34px)] font-semibold leading-[1.25] text-inherit no-underline transition-colors duration-[250ms] hover:text-[#a4cf86] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844] motion-reduce:transition-none">Prakriti LAB</Link>
            {/* <Link to={links.workshop} onClick={onClose} className="mt-[3px] text-[19px] font-light text-inherit no-underline transition-colors duration-[250ms] hover:text-[#a4cf86] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844] motion-reduce:transition-none">Workshop</Link> */}
          </div>
          <p className="m-0 text-[clamp(18px,1.45vw,24px)] font-light leading-[1.4] tracking-[0.025em] text-[#d1dcdd]">Elevate your indoor spaces with lush, green gardens tailored to thrive in various home environments.</p>
        </div>
      </div>
    </div>
  );
}
