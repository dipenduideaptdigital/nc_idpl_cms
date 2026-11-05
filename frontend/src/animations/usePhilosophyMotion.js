import { useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export default function usePhilosophyMotion(scrollRoot) {
  const panelRef = useRef(null);
  // Half-screen transition stops must not trigger the next scene's entrance.
  const inView = useInView(panelRef, { root: scrollRoot, amount: 0.95, once: true });
  const reducedMotion = useReducedMotion();
  const immediate = reducedMotion || (typeof document !== 'undefined' && document.body.classList.contains('puck-mode'));
  const reveal = (from, delay = 0) => ({
    initial: immediate ? false : from,
    animate: immediate || inView ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 } : from,
    transition: { duration: immediate ? 0 : 1.15, delay: immediate ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  });

  return {
    panelRef,
    fade: (delay = 0) => reveal({ opacity: 0 }, delay),
    text: (delay = 0) => reveal({ x: 90, opacity: 0 }, delay),
    artwork: (delay = 0) => reveal({ x: -100, opacity: 0 }, delay),
    fish: (delay = 0) => reveal({ x: 160, y: -18, rotate: -5, opacity: 0 }, delay),
  };
}
