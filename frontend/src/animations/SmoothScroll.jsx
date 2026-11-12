import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { cancelScrollMomentum, createSmoothScrollOptions, isPublicScrollRoute } from './smoothScrollOptions';
import attachSectionPaging from './attachSectionPaging';

export default function SmoothScroll() {
  const { pathname, key } = useLocation();

  useEffect(() => {
    if (!isPublicScrollRoute(pathname)) return;

    const root = document.documentElement;
    root.classList.add('public-scrollbar-hidden');
    // Lenis supplies the easing; disable the existing CSS smooth-scroll while it is mounted.
    const hadScrollAuto = root.classList.contains('scroll-auto!');
    root.classList.add('scroll-auto!');
    let lenis;
    lenis = new Lenis(createSmoothScrollOptions(() => lenis));
    const detachSectionPaging = attachSectionPaging(lenis);

    const cancelMomentum = () => cancelScrollMomentum(lenis);
    const onKeyDown = (event) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
        cancelMomentum();
      }
    };
    // Existing form modals lock body scrolling; stop the smoother at the same time.
    const syncBodyLock = () => {
      const overflow = getComputedStyle(document.body).overflowY;
      if (overflow === 'hidden' || overflow === 'clip') lenis.stop();
      else lenis.start();
    };
    const bodyObserver = new MutationObserver(syncBodyLock);
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    syncBodyLock();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', cancelMomentum, { passive: true });

    return () => {
      detachSectionPaging();
      bodyObserver.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', cancelMomentum);
      lenis.destroy();
      root.classList.remove('public-scrollbar-hidden');
      if (!hadScrollAuto) root.classList.remove('scroll-auto!');
    };
  }, [pathname, key]);

  return null;
}
