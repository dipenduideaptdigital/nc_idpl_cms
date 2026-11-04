import { Children, useEffect, useRef, useState } from 'react';
import { LazyMotion, domAnimation, useReducedMotion, useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';

const EDGE_SPACING = 12;

function entryProgress(progress, index, count) {
  if (index === 0) return 1;
  const start = (index - 0.55) / count;
  const end = (index + 0.35) / count;
  const value = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  return value * value * (3 - 2 * value);
}

function StackLayer({ children, index, count, progress, cardHeight }) {
  const coveredBy = (value) => {
    let layers = 0;
    for (let next = index + 1; next < count; next += 1) layers += entryProgress(value, next, count);
    return layers;
  };
  const y = useTransform(progress, value =>
    (1 - entryProgress(value, index, count)) * (cardHeight + 80) + coveredBy(value) * EDGE_SPACING);
  const scale = useTransform(progress, value => 1 - coveredBy(value) * 0.025);

  return (
    <m.div
      className="absolute inset-x-0 top-0 w-full origin-bottom"
      style={{ y, scale, height: cardHeight, zIndex: index + 1 }}
    >
      {children}
    </m.div>
  );
}

function PinnedStack({ cards, layout }) {
  const trackRef = useRef(null);
  const stageHeight = layout.cardHeight + (cards.length - 1) * EDGE_SPACING + 24;
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${layout.top}px`, `end ${layout.top + stageHeight}px`],
  });

  return (
    <div ref={trackRef} className="relative" style={{ height: stageHeight + cards.length * layout.travel }}>
      <div className="sticky w-full overflow-hidden" style={{ top: layout.top, height: stageHeight }}>
        <LazyMotion features={domAnimation} strict>
          {cards.map((card, index) => (
            <StackLayer key={card.key ?? index} index={index} count={cards.length} progress={scrollYProgress} cardHeight={layout.cardHeight}>
              {card}
            </StackLayer>
          ))}
        </LazyMotion>
      </div>
    </div>
  );
}

export default function ScrollCardStack({ children }) {
  const frameRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [layout, setLayout] = useState(null);
  const cards = Children.toArray(children);

  useEffect(() => {
    const frame = frameRef.current;
    const measure = () => {
      // Pin behind the fixed navbar, with room for the real stacked edges below.
      const top = 16;
      const cardHeight = window.innerHeight - top - (cards.length - 1) * EDGE_SPACING - 40;
      // Keep every service readable on phones, short windows, and with reduced motion.
      const next = window.innerWidth >= 1024 && cardHeight >= 460
        ? { top, cardHeight, travel: window.innerHeight * 0.8 } : null;
      setLayout(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [cards.length]);

  return (
    <div ref={frameRef} className="w-full min-w-0">
      {layout && !reduceMotion && cards.length > 1
        ? <PinnedStack cards={cards} layout={layout} />
        : <div className="space-y-8">{cards}</div>}
    </div>
  );
}
