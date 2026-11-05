import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export default function useTimedCarousel(count, interval = 6000) {
  const frameRef = useRef(null);
  const lastChange = useRef(-Infinity);
  const [slide, setSlide] = useState({ index: 0, direction: 1 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const reduceMotion = useReducedMotion();
  const inView = useInView(frameRef, { amount: 0.3 });
  const index = Math.min(slide.index, Math.max(0, count - 1));

  const select = useCallback((next, direction = 1) => {
    if (count < 2 || (!reduceMotion && performance.now() - lastChange.current < 900)) return;
    lastChange.current = performance.now();
    setSlide({ index: ((next % count) + count) % count, direction });
  }, [count, reduceMotion]);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (count < 2 || !inView || !pageVisible || hovered || focused || reduceMotion) return;
    const timer = window.setTimeout(() => select(index + 1), interval);
    return () => window.clearTimeout(timer);
  }, [count, inView, pageVisible, hovered, focused, reduceMotion, index, interval, select, slide]);

  return {
    frameRef,
    index,
    direction: slide.direction,
    reduceMotion,
    select,
    previous: () => select(index - 1, -1),
    next: () => select(index + 1, 1),
    frameEvents: {
      onPointerEnter: (event) => { if (event.pointerType === 'mouse') setHovered(true); },
      onPointerLeave: () => setHovered(false),
      onFocusCapture: (event) => setFocused(event.target.matches(':focus-visible')),
      onBlurCapture: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      },
      onKeyDown: (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        select(index + direction, direction);
      },
    },
  };
}
