import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import splash from '../../assets/nc_logo/bush3.png';
import fallbackImage from '../../assets/nc_home/gallery1.png';

const resolveImage = (image) => {
  const path = typeof image === 'object' ? image?.url || image?.src || image?.path : image;
  if (!path || typeof path !== 'string') return fallbackImage;
  if (/^(https?:|data:|\/src\/|\/assets\/|\/@fs\/)/.test(path)) return path;
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api/v1', '').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function PrakritiUpcomingEventsSection({ data = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    const onChange = (event) => setDesktop(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const event = (data.workshops || data.cards || data.items || [])[0] || {};
  const eventTitle = event.title || 'TERRARIUM WORKSHOP';
  const heading = !data.heading || data.heading.toUpperCase() === 'UPCOMING WORKSHOPS' ? 'UPCOMING EVENTS' : data.heading;
  const customText = data.subtext && !data.subtext.includes('It is a long') ? data.subtext : '';
  const active = isInView || reduceMotion;
  const cardTransition = reduceMotion ? { duration: 0 } : { duration: 3, times: [0, 0.45, 0.65, 1], ease: 'easeInOut', delay: 0.5 };
  const detailMotion = (delay) => ({ initial: reduceMotion ? false : { opacity: 0, y: 16 }, animate: active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }, transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay } });

  return (
    <section ref={ref} data-prakriti-step="workshops" data-nav-theme="light" className="relative overflow-hidden bg-white px-6 py-20 sm:px-12 lg:px-20 lg:py-28 font-kanit">
      <img src={splash} alt="" aria-hidden="true" className="pointer-events-none absolute -left-24 top-4 w-[500px] max-w-none sm:w-[620px] opacity-90" />
      <div className="relative mx-auto max-w-7xl">
        <motion.h2 initial={reduceMotion ? false : { y: -60, opacity: 0 }} animate={active ? { y: 0, opacity: 1 } : { y: -60, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 1.2, ease: 'easeOut' }} className="text-3xl sm:text-4xl font-semibold uppercase text-[#09242b]">{heading}</motion.h2>
        <div className="mt-12 grid items-stretch gap-0 md:grid-cols-2 md:px-8">
          <motion.div className="relative aspect-square" initial={reduceMotion ? false : { x: -140, opacity: 0 }} animate={active ? (reduceMotion ? { x: 0, y: desktop ? -24 : 0, opacity: 1 } : { x: [-140, 0, 0, 0], y: [0, 0, 0, desktop ? -24 : 0], opacity: [0, 1, 1, 1] }) : { x: -140, y: 0, opacity: 0 }} transition={cardTransition}>
            <img src={resolveImage(event.image)} alt={eventTitle} className="h-full w-full object-cover" />
          </motion.div>
          <motion.div className="relative min-h-[340px] md:min-h-0 md:aspect-square bg-[#06252c] text-white p-6 lg:p-12 flex flex-col justify-center" initial={reduceMotion ? false : { x: 140, opacity: 0 }} animate={active ? (reduceMotion ? { x: 0, y: desktop ? 24 : 0, opacity: 1 } : { x: [140, 0, 0, 0], y: [0, 0, 0, desktop ? 24 : 0], opacity: [0, 1, 1, 1] }) : { x: 140, y: 0, opacity: 0 }} transition={cardTransition}>
            <motion.h3 {...detailMotion(2.3)} className="text-xl sm:text-2xl lg:text-3xl font-medium uppercase leading-tight max-w-xs">{eventTitle}</motion.h3>
            <motion.div {...detailMotion(2.6)} className="mt-5 lg:mt-8 space-y-4 text-sm md:text-xs lg:text-base leading-snug text-white/75">
              {customText ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(customText) }} /> : <><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><p>When designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset’s Body Type sheets.</p></>}
            </motion.div>
            <motion.div {...detailMotion(2.9)} className="mt-5 lg:mt-8 flex flex-wrap gap-3">
              <Link to="/prakriti-lab/activities/expert-led-nature-workshops" className="bg-[#6CA844] px-5 py-2 text-sm text-white transition-colors hover:bg-[#568c36]">Explore</Link>
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-consultation-modal'))} className="bg-[#6CA844] px-5 py-2 text-sm text-white transition-colors hover:bg-[#568c36]">Book your Seat</button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
