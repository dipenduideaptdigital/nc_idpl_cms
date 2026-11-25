import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import NatureNavbar from '../components/nature_homepage/NatureNavbar';
import SEOHead from '../components/shared/SEOHead';
import SiteBreadcrumb from '../components/shared/SiteBreadcrumb';
import aquascape from '../assets/shop/aquascape.png';

export default function ShopComingSoon() {
  return (
    <div
      className="flex min-h-[100svh] flex-col bg-[#f6faef] pt-[100px] font-kanit text-[#363636] [&>header]:!border-[#6CA844] [&>header]:!bg-[#f6faef] [&>header]:!shadow-none max-[480px]:pt-[88px]"
      data-nav-theme="light"
    >
      <SEOHead data={{
        title: 'Shop — Coming Soon',
        metaDescription: 'Good things take root. The NatureCube online store is growing. Living art for your space is on its way.',
      }} />
      <NatureNavbar solidBackground />
      <SiteBreadcrumb />

      <main
        className="mx-auto grid w-full max-w-[1536px] flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] items-center gap-2 px-[clamp(24px,4vw,64px)] py-[clamp(40px,5vw,80px)] max-[900px]:grid-cols-1 max-[900px]:gap-9 max-[900px]:pt-11 max-[480px]:gap-8 max-[480px]:px-5 max-[480px]:py-8"
        aria-labelledby="shop-heading"
      >
        <div className="relative z-10 max-[900px]:text-center">
          <p className="mb-8 inline-flex max-w-full items-center gap-3 rounded-full border border-[#6CA844] px-[18px] py-2.5 text-[clamp(10px,1vw,14px)] font-medium uppercase leading-normal tracking-[0.15em] text-[#363636] max-[900px]:mb-6 max-[480px]:gap-2 max-[480px]:px-3 max-[480px]:py-[9px] max-[480px]:text-[9px] max-[480px]:tracking-[0.1em]">
            <span className="size-2.5 shrink-0 rounded-full bg-[#6CA844]" aria-hidden="true" />
            Our online store is growing
          </p>
          <h1 id="shop-heading" className="m-0 font-kanit text-[clamp(58px,6.65vw,102px)] font-medium leading-[1.04] tracking-[-0.055em] text-[#06232B] max-[900px]:text-[clamp(56px,10vw,88px)] max-[480px]:text-[clamp(48px,13vw,62px)]">
            Good things
            <em className="mt-1.5 block font-kanit text-[1.13em] font-light italic tracking-[-0.04em] text-[#6CA844]">take root.</em>
          </h1>
          <p className="mt-[30px] text-[clamp(14px,1.6vw,22px)] font-medium uppercase tracking-[0.18em] text-[#363636] max-[480px]:mt-6 max-[480px]:text-xs">
            Shop <span className="mx-[5px]" aria-hidden="true">&middot;</span> Coming soon
          </p>
          <p className="mt-7 text-[clamp(16px,1.55vw,22px)] font-light leading-[1.65] text-[#657168] max-[480px]:mt-5 max-[480px]:text-[15px]">
            A little more nature. A little more wonder.<br />
            Living art for your space is on its way.
          </p>
          <div className="mt-[38px] flex flex-wrap items-center gap-x-8 gap-y-6 text-[clamp(16px,1.4vw,20px)] max-[900px]:mt-7 max-[900px]:justify-center max-[480px]:flex-col max-[480px]:gap-3">
            <Link
              to="/"
              state={{ scrollToTop: true }}
              className="inline-flex items-center justify-center gap-6 rounded-sm bg-[#06232B] px-6 py-4 font-medium text-white transition-colors duration-200 hover:bg-[#0b3843] focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-[#6CA844] max-[480px]:w-full max-[480px]:max-w-[300px]"
            >
              Explore NatureCube <ArrowRight size={23} aria-hidden="true" />
            </Link>
            <Link to="/contact" className="py-2.5 font-medium underline decoration-[#6CA844] decoration-[1px] underline-offset-[7px] hover:text-[#6CA844] focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-[#6CA844]">Get in touch</Link>
          </div>
        </div>

        <figure className="relative m-0 isolate max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[560px]">
          <div className="absolute inset-[0_3%_9%] -z-10 rounded-[50%] border border-[#6CA844]/25 [background:radial-gradient(ellipse,#e4edcf80,transparent_70%)]" aria-hidden="true" />
          <img
            src={aquascape}
            alt="A lush glass aquascape with ferns, moss, driftwood and small fish on a limestone plinth"
            width="1254"
            height="1254"
            fetchPriority="high"
            className="block h-auto w-full mix-blend-multiply"
          />
          <figcaption className="absolute bottom-[8%] right-0 flex items-center gap-3.5 rounded-sm border border-[#6CA844]/20 bg-white/90 px-6 py-4 font-kanit text-[clamp(21px,2vw,30px)] font-light italic text-[#06232B] shadow-[0_16px_32px_#06232b14] max-[480px]:bottom-[3%] max-[480px]:gap-2.5 max-[480px]:px-3.5 max-[480px]:py-2.5 max-[480px]:text-[22px]">
            <Leaf className="shrink-0 text-[#6CA844] max-[480px]:size-6" size={32} strokeWidth={1.2} aria-hidden="true" />
            A world of green.
          </figcaption>
        </figure>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[#6CA844] px-[clamp(24px,4vw,64px)] py-6 text-xs font-medium tracking-[0.16em] text-[#363636] max-[900px]:justify-center max-[900px]:text-center max-[480px]:text-[10px] max-[480px]:tracking-[0.12em]">
        <p className="m-0 uppercase">Nature, closer than ever.</p>
        <ul className="m-0 flex flex-wrap gap-4 p-0 [&>li+li]:before:mr-4 [&>li+li]:before:text-[#6CA844] [&>li+li]:before:content-['/'] max-[480px]:gap-2.5 max-[480px]:[&>li+li]:before:mr-2.5" aria-label="Living art collections">
          <li>Aquascapes</li>
          <li>Terrariums</li>
          <li>Living art</li>
        </ul>
      </footer>
    </div>
  );
}
