export function isPublicScrollRoute(pathname) {
  return !/^\/(admin(?:\/|$)|login\/?$|register\/?$|forgot-password\/?$|reset-password\/?$|admin-setup\/?$)/.test(pathname);
}

export function cancelScrollMomentum(lenis) {
  if (lenis?.isScrolling === 'smooth') {
    lenis.scrollTo(lenis.actualScroll, { immediate: true });
  }
}

export function createSmoothScrollOptions(getLenis) {
  return {
    autoRaf: true,
    // Shorter settling time keeps the glide responsive to wheel input.
    lerp: 0.14,
    wheelMultiplier: 1,
    smoothWheel: true,
    syncTouch: false,
    respectReducedMotion: true,
    anchors: true,
    stopInertiaOnNavigate: true,
    // Explicit native regions avoid per-ancestor computed-style/layout checks on wheel events.
    allowNestedScroll: false,
    prevent: (node) => {
      const nativeScroll = node.hasAttribute('data-lenis-prevent')
        || node.tagName === 'TEXTAREA' || node.tagName === 'SELECT';
      if (nativeScroll) cancelScrollMomentum(getLenis());
      return nativeScroll;
    },
    virtualScroll: ({ event, deltaX, deltaY }) => {
      // Local carousel/gallery listeners run first. Yield only while they consume the wheel.
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey
        || Math.abs(deltaX) > Math.abs(deltaY)) {
        cancelScrollMomentum(getLenis());
        return false;
      }
      return true;
    },
  };
}
