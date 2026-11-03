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
      className={`min-w-0 px-2 ${reduceMotion ? '' : 'aspect-[1/2.6] overflow-hidden'} ${className}`}
    >
      <div ref={trackRef}>
        {/* Identical groups, including bottom spacing, make the 50% loop seamless. */}
        {Array.from({ length: reduceMotion ? 1 : 2 }, (_, copy) => (
          <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex flex-col gap-4 lg:gap-6 pb-4 lg:pb-6">
            {logos.map((logoUrl, index) => (
              <div
                key={index}
                className="bg-white rounded-[10px] p-4 sm:p-6 lg:p-8 flex items-center justify-center aspect-square shadow-[4px_4px_14.5px_-3px_#00000026]"
              >
                <img
                  src={logoUrl}
                  alt={copy === 1 ? '' : 'Partner logo'}
                  loading="lazy"
                  decoding="async"
                  className="max-h-12 sm:max-h-20 lg:max-h-24 w-auto max-w-[85%] object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
