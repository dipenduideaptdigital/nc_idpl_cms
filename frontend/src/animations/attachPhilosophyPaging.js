// Each pair of scenes has a quiet half-screen stop between them.
export default function attachPhilosophyPaging(el, reducedMotion = false) {
  let frame = 0;
  let destination = el.scrollLeft;
  let lastWheelAt = -Infinity;
  let gestureUsed = false;
  let distance = 0;
  let width = el.clientWidth;
  const panels = () => [...el.querySelectorAll('[data-philosophy-panel]')];
  const stops = () => panels().flatMap((panel, index, all) =>
    index < all.length - 1
      ? [panel.offsetLeft, (panel.offsetLeft + all[index + 1].offsetLeft) / 2]
      : [panel.offsetLeft]);
  const cancel = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    destination = el.scrollLeft;
  };
  const moveTo = (position) => {
    cancel();
    destination = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, position));
    if (reducedMotion) { el.scrollLeft = destination; return; }
    const start = el.scrollLeft;
    const startedAt = performance.now();
    const tick = (time) => {
      const progress = Math.min(1, (time - startedAt) / 1050);
      el.scrollLeft = start + (destination - start) * (1 - Math.pow(1 - progress, 3));
      frame = progress < 1 ? requestAnimationFrame(tick) : 0;
    };
    frame = requestAnimationFrame(tick);
  };
  const step = (direction) => {
    const position = frame ? destination : el.scrollLeft;
    const positions = stops();
    const next = direction > 0
      ? positions.find(value => value > position + 2)
      : positions.findLast(value => value < position - 2);
    if (next === undefined) return false;
    moveTo(next);
    return true;
  };
  const onWheel = (event) => {
    if (document.body.classList.contains('puck-mode') || event.ctrlKey || event.metaKey
      || event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!raw || panels().length < 2) return;
    const now = performance.now();
    if (now - lastWheelAt > 220) { gestureUsed = false; distance = 0; }
    lastWheelAt = now;
    // Consume trackpad momentum so one gesture cannot skip the intermediate view.
    if (frame || gestureUsed) { event.preventDefault(); gestureUsed = true; return; }
    const direction = Math.sign(raw);
    const positions = stops();
    if ((direction < 0 && el.scrollLeft <= positions[0] + 2)
      || (direction > 0 && el.scrollLeft >= positions.at(-1) - 2)) return;
    event.preventDefault();
    const delta = raw * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientWidth : 1);
    distance = Math.sign(distance) === direction ? distance + delta : delta;
    if (Math.abs(distance) < 24) return;
    gestureUsed = step(direction);
  };
  const interrupt = () => { cancel(); gestureUsed = false; distance = 0; lastWheelAt = -Infinity; };
  const resize = () => {
    const previous = el.scrollLeft;
    const oldWidth = width;
    interrupt();
    width = el.clientWidth;
    el.scrollLeft = oldWidth ? previous / oldWidth * width : 0;
    destination = el.scrollLeft;
  };
  el.addEventListener('wheel', onWheel, { passive: false });
  el.addEventListener('pointerdown', interrupt, { passive: true });
  window.addEventListener('resize', resize);
  return {
    step,
    scrollToPanel: index => { const panel = panels()[index]; if (panel) moveTo(panel.offsetLeft); },
    destroy: () => {
      cancel();
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', interrupt);
      window.removeEventListener('resize', resize);
    },
  };
}
