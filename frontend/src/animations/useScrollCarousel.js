import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { createWheelStepper } from './scrollCarouselWheel';

export default function useScrollCarousel(count, enabled = true) {
  const panelRef = useRef(null);
  const inactiveRef = useRef(null);
  const indexRef = useRef(0);
  const wheelRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const reduceMotion = useReducedMotion();
  const index = Math.min(selectedIndex, Math.max(0, count - 1));
  const canObserve = typeof IntersectionObserver !== 'undefined';
  const inView = useInView(canObserve ? panelRef : inactiveRef, { amount: 0.5 });

  const select = useCallback((next) => {
    const bounded = Math.max(0, Math.min(next, count - 1));
    indexRef.current = bounded;
    setSelectedIndex(bounded);
  }, [count]);

  useEffect(() => { indexRef.current = index; }, [index]);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!enabled || !panel) return;
    const wheel = createWheelStepper();
    wheelRef.current = wheel;
    const onWheel = (event) => {
      // Let the page reach the entrance threshold before capturing carousel scrolls.
      if (canObserve && !inView) return;
      if (!event.cancelable || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      const result = wheel.step(event, indexRef.current, count, performance.now(), window.innerHeight);
      if (result.preventScroll) event.preventDefault();
      if (result.index !== indexRef.current) select(result.index);
    };
    // React's delegated wheel listener is passive; only this panel needs cancellation.
    panel.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      panel.removeEventListener('wheel', onWheel);
      wheelRef.current = null;
    };
  }, [count, enabled, select, canObserve, inView]);

  useEffect(() => {
    if (!enabled || count < 2 || !pageVisible || (canObserve && !inView)
      || hovered || focused || reduceMotion) return;
    const timer = window.setTimeout(() => select((index + 1) % count), 6000);
    return () => window.clearTimeout(timer);
  }, [enabled, count, pageVisible, canObserve, inView, hovered, focused, reduceMotion, index, select]);

  return {
    panelRef,
    index,
    select,
    panelEvents: {
      onPointerEnter: (event) => { if (event.pointerType === 'mouse') setHovered(true); },
      onPointerLeave: () => {
        setHovered(false);
        wheelRef.current?.reset();
      },
      // Keyboard focus pauses autoplay; a mouse click must not keep it paused after leaving.
      onFocusCapture: (event) => setFocused(event.target.matches(':focus-visible')),
      onBlurCapture: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      },
      onKeyDown: (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey
          || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
        const directions = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (!(event.key in directions)) return;
        event.preventDefault();
        wheelRef.current?.reset();
        select(indexRef.current + directions[event.key]);
      },
    },
  };
}
