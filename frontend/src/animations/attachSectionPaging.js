// This pager activates only where Prakriti's marked sections are mounted.
export default function attachSectionPaging(lenis) {
  const desktop = window.matchMedia('(min-width: 1024px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animating = false;
  let lastWheelAt = -Infinity;
  let distance = 0;
  let gestureUsed = false;
  let disposed = false;

  const onWheel = (event) => {
    if (!desktop.matches || reducedMotion.matches || lenis.isStopped || event.defaultPrevented
      || event.ctrlKey || event.metaKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)
      || event.target.closest?.('input, textarea, select, button, [contenteditable="true"], [data-lenis-prevent], [role="dialog"]')) return;

    const sections = [...document.querySelectorAll('[data-prakriti-step]')];
    if (sections.length < 2) return;
    const positions = sections.map(section => ({
      top: Math.max(0, section.getBoundingClientRect().top + window.scrollY),
      height: section.getBoundingClientRect().height,
    }));
    const scrollY = window.scrollY;
    if (scrollY < positions[0].top - 4 || scrollY > positions.at(-1).top + 4) return;

    const now = performance.now();
    const sameGesture = now - lastWheelAt < 220;
    lastWheelAt = now;
    if (!sameGesture) { distance = 0; gestureUsed = false; }

    const consume = () => {
      event.preventDefault();
      // Lenis must not treat this gesture as another smooth-wheel request.
      event.stopImmediatePropagation();
    };
    if (animating || (sameGesture && gestureUsed)) { consume(); return; }

    const direction = Math.sign(event.deltaY);
    if (!direction) return;
    const current = positions.reduce((nearest, section, index) =>
      Math.abs(section.top - scrollY) < Math.abs(positions[nearest].top - scrollY) ? index : nearest, 0);
    const next = current + direction;
    // Allow natural scrolling beyond the fourth screen and through oversized content.
    if (next < 0 || next >= positions.length || positions[current].height > window.innerHeight + 4
      || positions[next].height > window.innerHeight + 4) return;

    consume();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
    distance = Math.sign(distance) === direction ? distance + delta : delta;
    if (Math.abs(distance) < 30) return;
    gestureUsed = true;
    animating = true;
    lenis.scrollTo(positions[next].top, {
      duration: 1.1,
      lerp: 0,
      easing: value => 1 - Math.pow(1 - value, 3),
      onComplete: () => { if (!disposed) animating = false; },
    });
  };

  const release = () => {
    if (animating) lenis.scrollTo(lenis.actualScroll, { immediate: true });
    animating = false;
    gestureUsed = false;
    distance = 0;
  };
  window.addEventListener('wheel', onWheel, { passive: false, capture: true });
  window.addEventListener('pointerdown', release);
  window.addEventListener('keydown', release);
  window.addEventListener('resize', release);
  return () => {
    disposed = true;
    release();
    window.removeEventListener('wheel', onWheel, true);
    window.removeEventListener('pointerdown', release);
    window.removeEventListener('keydown', release);
    window.removeEventListener('resize', release);
  };
}
