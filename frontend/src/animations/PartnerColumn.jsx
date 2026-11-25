import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { animate } from 'motion/mini';

export default function PartnerColumn({ logos, direction = 'up', className = '' }) {
  const frameRef = useRef(null);
  const trackRef = useRef(null);
  const inactiveRef = useRef(null);
  const animationRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const canObserve = typeof IntersectionObserver !== 'undefined';
  const inView = useInView(canObserve ? frameRef : inactiveRef, { amount: 0.1 });

  useEffect(() => {
    if (reduceMotion || !trackRef.current) return;
    const positions = ['translateY(0%)', 'translateY(-50%)'];
    const controls = animate(trackRef.current, {
      transform: direction === 'down' ? [...positions].reverse() : positions,
    }, { duration: 40, ease: 'linear', repeat: Infinity });
    controls.pause();
    animationRef.current = controls;
    return () => {
      controls.cancel();
      animationRef.current = null;
    };
  }, [direction, reduceMotion, logos.length]);

  useEffect(() => {
    const updatePlayback = () => {
      if ((inView || !canObserve) && !document.hidden && !reduceMotion) animationRef.current?.play();
      else animationRef.current?.pause();
    };
    updatePlayback();
    document.addEventListener('visibilitychange', updatePlayback);
    return () => document.removeEventListener('visibilitychange', updatePlayback);
  }, [inView, canObserve, reduceMotion, direction, logos.length]);

  return (
    <div
      ref={frameRef}
      className={`min-w-0 px-1 min-[360px]:px-1.5 sm:px-2 ${reduceMotion ? '' : 'aspect-[1/2.35] overflow-hidden sm:aspect-[1/2.6]'} ${className}`}
    >
      <div ref={trackRef}>
        {/* Identical groups, including bottom spacing, make the 50% loop seamless. */}
        {Array.from({ length: reduceMotion ? 1 : 2 }, (_, copy) => (
          <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex flex-col gap-3 min-[360px]:gap-4 lg:gap-6 pb-3 min-[360px]:pb-4 lg:pb-6">
            {logos.map((logoUrl, index) => (
              <div
                key={index}
                className="flex items-center justify-center aspect-square"
              >
                <img
                  src={logoUrl}
                  alt={copy === 1 ? '' : 'Partner logo'}
                  loading="lazy"
                  decoding="async"
                  className="max-h-16 min-[360px]:max-h-20 sm:max-h-28 lg:max-h-32 w-auto max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
