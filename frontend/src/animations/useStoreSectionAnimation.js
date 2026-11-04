import { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export default function useStoreSectionAnimation() {
  const sectionRef = useRef(null);
  const inactiveRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const canObserve = typeof IntersectionObserver !== 'undefined';
  const inView = useInView(canObserve ? sectionRef : inactiveRef, { once: true, amount: 0.4 });
  const immediate = reduceMotion || focused || !canObserve;
  const visible = immediate || inView;

  const slide = (delay = 0, from = '-100vw') => ({
    initial: immediate ? false : { x: from },
    animate: { x: visible ? 0 : from },
    transition: { duration: immediate ? 0 : 1.4, delay: immediate ? 0 : delay, ease: [0.25, 0.1, 0.25, 1] },
  });
  const appear = {
    initial: immediate ? false : { opacity: 0 },
    animate: { opacity: visible ? 1 : 0 },
    transition: { duration: immediate ? 0 : 0.7, delay: immediate ? 0 : 0.5 },
  };

  return { sectionRef, slide, appear, revealOnFocus: () => setFocused(true) };
}
