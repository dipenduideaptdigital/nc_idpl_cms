import { LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

export default function CarouselSlide({ active, image = false, children }) {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        aria-hidden={!active}
        inert={active ? undefined : ''}
        className={`col-start-1 row-start-1 min-w-0 ${active ? 'relative z-10' : 'pointer-events-none'}`}
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
          x: reduceMotion || !image || active ? 0 : 28,
          y: reduceMotion || image || active ? 0 : 18,
        }}
        transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
