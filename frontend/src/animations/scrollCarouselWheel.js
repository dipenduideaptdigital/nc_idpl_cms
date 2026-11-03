// One deliberate wheel step per transition, scoped to the carousel panel.
export function createWheelStepper() {
  let distance = 0;
  let lastEventAt = -Infinity;
  let blockedUntil = 0;

  return {
    reset() {
      distance = 0;
      lastEventAt = -Infinity;
      blockedUntil = 0;
    },
    step(event, index, count, now, viewportHeight) {
      const unchanged = { preventScroll: false, index };
      if (count < 2 || event.ctrlKey || event.metaKey || event.shiftKey
        || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return unchanged;

      const direction = Math.sign(event.deltaY);
      if (now < blockedUntil) return { preventScroll: true, index };
      const next = index + direction;
      if (next < 0 || next >= count) {
        distance = 0;
        return unchanged;
      }

      if (now - lastEventAt > 180 || Math.sign(distance) !== direction) distance = 0;
      lastEventAt = now;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewportHeight : 1;
      distance += event.deltaY * unit;
      if (Math.abs(distance) < 48) return { preventScroll: true, index };

      distance = 0;
      blockedUntil = now + 900;
      return { preventScroll: true, index: next };
    },
  };
}
