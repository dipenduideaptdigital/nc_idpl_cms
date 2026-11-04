import { useRef, useState } from 'react';
import { LazyMotion, domAnimation, useInView, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

export default function PanelEntrance({ triggerRef, children }) {
  const inactiveRef = useRef(null);
  const [hasFocused, setHasFocused] = useState(false);
  const reduceMotion = useReducedMotion();
  const showImmediately = reduceMotion || hasFocused || typeof IntersectionObserver === 'undefined';
  // The carousel's stationary outer column controls the entrance, not the moving panel.
  const isInView = useInView(showImmediately ? inactiveRef : triggerRef, { once: true, amount: 0.5 });

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className="relative flex flex-1 flex-col min-w-0"
        initial={showImmediately ? false : 'hidden'}
        animate={showImmediately || isInView ? 'visible' : 'hidden'}
        variants={{ hidden: { opacity: 0, x: 96 }, visible: { opacity: 1, x: 0 } }}
        transition={{ duration: showImmediately ? 0 : 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        onFocusCapture={() => setHasFocused(true)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
