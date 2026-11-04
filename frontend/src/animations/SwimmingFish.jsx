import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { animate } from 'motion/mini';

const swimPaths = {
  foreground: [
    'translate3d(0, 0, 0) rotate(0deg)',
    'translate3d(-18px, -8px, 0) rotate(1.5deg)',
    'translate3d(-32px, 0, 0) rotate(-1deg)',
    'translate3d(-12px, 6px, 0) rotate(-0.5deg)',
    'translate3d(0, 0, 0) rotate(0deg)',
  ],
  background: [
    'translate3d(0, 0, 0) rotate(0deg)',
    'translate3d(10px, 5px, 0) rotate(-1deg)',
    'translate3d(20px, -4px, 0) rotate(1deg)',
    'translate3d(8px, -8px, 0) rotate(0.5deg)',
    'translate3d(0, 0, 0) rotate(0deg)',
  ],
};

export default function SwimmingFish({ children, depth = 'foreground', className = '' }) {
  const frameRef = useRef(null);
  const fishRef = useRef(null);
  const inactiveRef = useRef(null);
  const animationRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const canObserve = typeof IntersectionObserver !== 'undefined';
  const inView = useInView(canObserve ? frameRef : inactiveRef, { amount: 0.15 });

  useEffect(() => {
    if (reduceMotion) return;
    // Animate an inner layer so the existing fish orientation and placement are preserved.
    const controls = animate(fishRef.current, { transform: swimPaths[depth] }, {
      duration: depth === 'background' ? 11 : 8,
      ease: 'easeInOut',
      repeat: Infinity,
    });
    controls.pause();
    animationRef.current = controls;
    return () => {
      controls.cancel();
      animationRef.current = null;
    };
  }, [depth, reduceMotion]);

  useEffect(() => {
    const syncPlayback = () => {
      if ((inView || !canObserve) && !document.hidden && !reduceMotion) animationRef.current?.play();
      else animationRef.current?.pause();
    };
    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => document.removeEventListener('visibilitychange', syncPlayback);
  }, [inView, canObserve, depth, reduceMotion]);

  return <div ref={frameRef} className={className}><div ref={fishRef}>{children}</div></div>;
}
