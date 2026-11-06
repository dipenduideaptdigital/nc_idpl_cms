import { useEffect, useState } from 'react';

export default function useNavbarAppearance(headerRef, fallbackDark, routeKey) {
  const [appearance, setAppearance] = useState({ scrolled: false, dark: fallbackDark });

  useEffect(() => {
    const row = headerRef.current?.querySelector('[data-navbar-content]');
    if (!row) return;
    const root = document.documentElement;
    const previousPadding = root.style.scrollPaddingTop;
    // Native anchor scrolling and Lenis both respect this clearance.
    // Measure the navigation row so opening the mobile menu cannot inflate it.
    const updateClearance = () => {
      root.style.scrollPaddingTop = `${row.offsetTop + row.offsetHeight + 24}px`;
    };
    updateClearance();
    const observer = new ResizeObserver(updateClearance);
    observer.observe(row);
    window.addEventListener('resize', updateClearance);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateClearance);
      root.style.scrollPaddingTop = previousPadding;
    };
  }, [headerRef, fallbackDark, routeKey]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrolled = window.scrollY > 8;
      let dark = fallbackDark;

      // The fixed navbar remains transparent, so sample the section beneath it
      // to preserve readable white-on-dark and black-on-light navigation text.
      if (headerRef.current) {
        const bounds = headerRef.current.getBoundingClientRect();
        const y = Math.max(0, Math.min(window.innerHeight - 1, bounds.top + 40));
        const layers = document.elementsFromPoint(window.innerWidth / 2, y);
        for (const element of layers) {
          if (headerRef.current.contains(element)) continue;
          const declaredTheme = element.closest('[data-nav-theme]')?.dataset.navTheme;
          if (declaredTheme === 'dark' || declaredTheme === 'light') {
            dark = declaredTheme === 'dark';
            break;
          }
          // Photo/video heroes retain their configured contrast instead of sampling pixels.
          if (element.matches('img, video')) break;
          const style = getComputedStyle(element);
          if (style.backgroundImage.includes('url(')) break;
          const rgba = style.backgroundColor.match(/[\d.]+/g)?.map(Number);
          if (rgba?.length >= 3 && (rgba[3] ?? 1) >= 0.85) {
            dark = (rgba[0] * 0.2126 + rgba[1] * 0.7152 + rgba[2] * 0.0722) < 150;
            break;
          }
        }
      }

      setAppearance((previous) => previous.scrolled === scrolled && previous.dark === dark
        ? previous
        : { scrolled, dark });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [headerRef, fallbackDark, routeKey]);

  return appearance;
}
