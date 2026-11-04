import { useEffect, useRef, useState } from 'react';
import { animate, LazyMotion, domAnimation, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

const SLIDE_INTERVAL_MS = 5000;

export default function ImageCarousel({ images }) {
  const frameRef = useRef(null);
  const trackRef = useRef(null);
  const inactiveRef = useRef(null);
  const x = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const canObserve = typeof IntersectionObserver !== 'undefined';
  const inView = useInView(canObserve ? frameRef : inactiveRef, { amount: 0.5 });
  const [step, setStep] = useState(0);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const measureStep = () => {
      const track = trackRef.current;
      const card = track?.firstElementChild;
      if (card) setStep(card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap));
    };
    measureStep();
    const observer = new ResizeObserver(measureStep);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    x.set(0);
    if (reduceMotion || !pageVisible || (canObserve && !inView) || !step || images.length < 2) return;

    let index = 0;
    let cancelled = false;
    let playback;
    const timer = setInterval(() => {
      index += 1;
      playback = animate(x, -index * step, { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] });
      playback.then(() => {
        // The duplicate row is identical, so resetting here is invisible.
        if (!cancelled && index === images.length) {
          index = 0;
          x.set(0);
        }
      });
    }, SLIDE_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
      playback?.stop();
    };
  }, [canObserve, inView, pageVisible, reduceMotion, step, images.length, x]);

  return (
    <div className="overflow-x-auto hide-scrollbar px-4 sm:px-0">
      <div className="min-w-[650px] lg:min-w-0 pb-4 sm:pb-0 pr-4 sm:pr-0 lg:pr-2">
        <div ref={frameRef} className="overflow-hidden" role="region" aria-label="NatureCube image gallery">
          <LazyMotion features={domAnimation} strict>
            <m.div ref={trackRef} style={{ x }} className="flex gap-3 sm:gap-5 lg:gap-6">
              {[...images, ...images].map((src, index) => (
                <div
                  key={index}
                  aria-hidden={index >= images.length ? true : undefined}
                  className="shrink-0 basis-[calc((100%-1.5rem)/3)] sm:basis-[calc((100%-2.5rem)/3)] lg:basis-[calc((100%-3rem)/3)] aspect-square overflow-hidden rounded-xs shadow-lg border border-zinc-200/50"
                >
                  <img src={src} alt={index >= images.length ? '' : `Gallery ${index + 1}`} decoding="async" className="w-full h-full object-cover" />
                </div>
              ))}
            </m.div>
          </LazyMotion>
        </div>
      </div>
    </div>
  );
}
