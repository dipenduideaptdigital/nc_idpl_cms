import { useRef } from 'react';
import { LazyMotion, domAnimation, useInView, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

export default function Typewriter({ text, className = '', triggerRef, amount = 0.3 }) {
  const containerRef = useRef(null);
  const inactiveRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const showImmediately = reduceMotion || typeof IntersectionObserver === 'undefined';
  const isInView = useInView(showImmediately ? inactiveRef : (triggerRef ?? containerRef), {
    once: true,
    amount,
  });

  return (
    <span ref={containerRef} className={className}>
      {/* Reserve the full text width and expose one complete label to screen readers. */}
      <span className="sr-only">{text}</span>
      <LazyMotion features={domAnimation} strict>
        <m.span
          aria-hidden="true"
          className="whitespace-pre-wrap"
          initial={showImmediately ? false : 'hidden'}
          animate={showImmediately || isInView ? 'visible' : 'hidden'}
        >
          {Array.from(text).map((character, index) => (
            <m.span
              key={`${index}-${character}`}
              variants={{ hidden: { visibility: 'hidden' }, visible: { visibility: 'visible' } }}
              transition={{ duration: 0, delay: showImmediately ? 0 : index * 0.09 }}
            >
              {character}
            </m.span>
          ))}
        </m.span>
      </LazyMotion>
    </span>
  );
}
