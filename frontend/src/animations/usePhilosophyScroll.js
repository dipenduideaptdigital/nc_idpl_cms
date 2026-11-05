import { useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import attachPhilosophyPaging from './attachPhilosophyPaging';

export default function usePhilosophyScroll(containerRef, panelCount) {
  const reducedMotion = useReducedMotion();
  const controller = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const paging = attachPhilosophyPaging(containerRef.current, reducedMotion);
    controller.current = paging;
    return () => { paging.destroy(); controller.current = null; };
  }, [containerRef, panelCount, reducedMotion]);

  const scrollToPanel = useCallback(index => controller.current?.scrollToPanel(index), []);
  const step = useCallback(direction => controller.current?.step(direction), []);
  return { scrollToPanel, step };
}
