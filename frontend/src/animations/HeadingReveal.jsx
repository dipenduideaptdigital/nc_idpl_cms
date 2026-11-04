import { useRef } from 'react';
import { LazyMotion, domAnimation, useInView, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

export default function HeadingReveal({ children, className }) {
  const headingRef = useRef(null);
  const inactiveRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const showImmediately = reduceMotion || typeof IntersectionObserver === 'undefined';
  // Observe the heading's full box; clipping the observed element prevents entry detection.
  const isInView = useInView(showImmediately ? inactiveRef : headingRef, { once: true, amount: 0.5 });
  return (
    <h2 ref={headingRef} className={className}>
      <LazyMotion features={domAnimation} strict>
        <m.span
          className="block"
          initial={showImmediately ? false : { clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: showImmediately || isInView ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
          transition={{ duration: showImmediately ? 0 : 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </m.span>
      </LazyMotion>
    </h2>
  );
}
