import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

// Inherits the entrance state from PanelEntrance's LazyMotion boundary.
export default function CarouselOption({ active, order, children, ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <m.button
      {...props}
      type="button"
      aria-pressed={active}
      className="relative isolate w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden bg-[#5a8a36] text-white rounded-xs cursor-pointer font-reem font-bold text-sm sm:text-base tracking-wider focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e2129]"
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.2 + order * 0.1 },
        },
      }}
      whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.2 } }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      whileFocus={{ opacity: 1, x: 0, transition: { duration: 0 } }}
    >
      <m.span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom bg-[#6CAB44]"
        initial={false}
        animate={{ scaleY: active ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <span className="relative z-10">{children}</span>
    </m.button>
  );
}
