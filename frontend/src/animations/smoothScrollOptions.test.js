import test from 'node:test';
import assert from 'node:assert/strict';
import { cancelScrollMomentum, createSmoothScrollOptions, isPublicScrollRoute } from './smoothScrollOptions.js';
import { createWheelStepper } from './scrollCarouselWheel.js';

test('enables public pages and excludes admin and authentication routes', () => {
  for (const path of ['/', '/about', '/projects/aquarium', '/blog', '/preview/token']) {
    assert.equal(isPublicScrollRoute(path), true, path);
  }
  for (const path of ['/admin', '/admin/home-customization', '/login', '/register/', '/reset-password', '/forgot-password', '/admin-setup']) {
    assert.equal(isPublicScrollRoute(path), false, path);
  }
});

test('carousel owns scrolling until its last option, then smoothing resumes', () => {
  const stoppedAt = [];
  const lenis = { isScrolling: 'smooth', actualScroll: 420, scrollTo: (...args) => stoppedAt.push(args) };
  const options = createSmoothScrollOptions(() => lenis);
  const wheel = createWheelStepper();
  let index = 0;
  for (let time = 0; time < 3000; time += 1000) {
    const event = { deltaX: 0, deltaY: 120, deltaMode: 0, defaultPrevented: false };
    const result = wheel.step(event, index, 4, time, 800);
    index = result.index;
    event.defaultPrevented = result.preventScroll;
    assert.equal(options.virtualScroll({ event, deltaX: 0, deltaY: 120 }), false);
  }
  assert.equal(index, 3);
  assert.deepEqual(stoppedAt[0], [420, { immediate: true }]);
  const boundary = wheel.step({ deltaX: 0, deltaY: 120, deltaMode: 0 }, index, 4, 4000, 800);
  assert.equal(options.virtualScroll({ event: { defaultPrevented: boundary.preventScroll }, deltaX: 0, deltaY: 120 }), true);
});

test('preserves native touch, nested scrolling, and reduced motion', () => {
  const options = createSmoothScrollOptions(() => null);
  assert.equal(options.syncTouch, false);
  assert.equal(options.respectReducedMotion, true);
  assert.equal(options.allowNestedScroll, false);
  for (const event of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { defaultPrevented: true }]) {
    assert.equal(options.virtualScroll({ event, deltaX: 0, deltaY: 50 }), false);
  }
  assert.equal(options.virtualScroll({ event: {}, deltaX: 100, deltaY: 5 }), false);
});

test('leaves native scrolling alone when cancelling momentum', () => {
  cancelScrollMomentum(null);
  cancelScrollMomentum({ isScrolling: 'native', scrollTo: () => assert.fail('Native scroll must not be interrupted') });
});

test('native regions and form fields bypass smoothing without reading layout', () => {
  const stoppedAt = [];
  const lenis = { isScrolling: 'smooth', actualScroll: 420, scrollTo: (...args) => stoppedAt.push(args) };
  const options = createSmoothScrollOptions(() => lenis);
  const node = (tagName, marked = false) => ({
    tagName,
    hasAttribute: (attribute) => marked && attribute === 'data-lenis-prevent',
    get scrollHeight() { return assert.fail('Native scroll detection must not read layout'); },
    get clientHeight() { return assert.fail('Native scroll detection must not read layout'); },
  });
  assert.equal(options.prevent(node('DIV')), false);
  assert.equal(options.prevent(node('DIV', true)), true);
  assert.equal(options.prevent(node('TEXTAREA')), true);
  assert.equal(options.prevent(node('SELECT')), true);
  assert.equal(stoppedAt.length, 3);
  assert.deepEqual(stoppedAt[0], [420, { immediate: true }]);
});
