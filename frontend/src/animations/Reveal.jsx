import { useRef, useState } from 'react';
import { LazyMotion, domAnimation, useInView, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

const startingPositions = {
  up: { x: '0%', y: '100%' },
  right: { x: '-100%', y: '0%' },
  left: { x: '100%', y: '0%' },
};

// Delay uses seconds, matching Motion's transition API.
export default function Reveal({
  direction = 'up',
  amount = 0.5,
  delay = 0,
  duration = 1.5,
  triggerRef,
  className = '',
  contentClassName = '',
  children,
  onFocusCapture,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const inactiveRef = useRef(null);
  const [hasFocused, setHasFocused] = useState(false);
  const showImmediately = reduceMotion || hasFocused || typeof IntersectionObserver === 'undefined';
  // Observe the stationary frame, never the translated content.
  const isInView = useInView(showImmediately ? inactiveRef : (triggerRef ?? containerRef), {
    once: true,
    amount,
  });

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onFocusCapture={(event) => {
        setHasFocused(true);
        onFocusCapture?.(event);
      }}
    >
      <LazyMotion features={domAnimation} strict>
        <m.div
          {...props}
          className={contentClassName}
          initial={showImmediately ? false : 'hidden'}
          animate={showImmediately || isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: startingPositions[direction],
            visible: { x: '0%', y: '0%' },
          }}
          transition={showImmediately
            ? { duration: 0, delay: 0 }
            : { duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </m.div>
      </LazyMotion>
    </div>
  );
}
