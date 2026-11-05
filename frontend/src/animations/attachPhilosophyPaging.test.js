import test from 'node:test';
import assert from 'node:assert/strict';
import attachPhilosophyPaging from './attachPhilosophyPaging.js';

function setup(t, { reduced = false, count = 3 } = {}) {
  let now = 0;
  let nextFrame = 0;
  const frames = new Map();
  const listeners = new Map();
  const windowListeners = new Map();
  const saved = new Map(['window', 'document', 'requestAnimationFrame', 'cancelAnimationFrame']
    .map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  globalThis.window = {
    addEventListener: (name, fn) => windowListeners.set(name, fn),
    removeEventListener: name => windowListeners.delete(name),
  };
  globalThis.document = { body: { classList: { contains: () => false } } };
  globalThis.requestAnimationFrame = fn => { frames.set(++nextFrame, fn); return nextFrame; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  t.mock.method(performance, 'now', () => now);
  const el = {
    scrollLeft: 0, clientWidth: 1000, scrollWidth: count * 1000,
    querySelectorAll: () => Array.from({ length: count }, (_, index) => ({ offsetLeft: index * el.clientWidth })),
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: name => listeners.delete(name),
  };
  const paging = attachPhilosophyPaging(el, reduced);
  t.after(() => {
    paging.destroy();
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const advance = milliseconds => {
    now += milliseconds;
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach(fn => fn(now));
  };
  const wheel = (deltaY = 100, extra = {}) => {
    let prevented = false;
    listeners.get('wheel')({ deltaX: 0, deltaY, deltaMode: 0, target: { closest: () => false },
      preventDefault: () => { prevented = true; }, ...extra });
    return prevented;
  };
  return { el, paging, advance, wheel, frames, listeners, windowListeners };
}

test('four fresh scroll gestures reach the four stops after the opening view, then release the page', t => {
  const { el, advance, wheel } = setup(t);
  for (const destination of [500, 1000, 1500, 2000]) {
    assert.equal(wheel(), true);
    advance(1100);
    assert.equal(el.scrollLeft, destination);
  }
  assert.equal(wheel(), false);
  advance(300);
  assert.equal(wheel(-100), true);
  advance(1100);
  assert.equal(el.scrollLeft, 1500);
});

test('fast wheel input and a long trackpad tail cannot skip the tree stop', t => {
  const { el, advance, wheel } = setup(t);
  wheel(2000);
  advance(300);
  assert.ok(el.scrollLeft > 0 && el.scrollLeft < 500);
  for (let i = 0; i < 15; i++) { wheel(30); advance(100); }
  assert.equal(el.scrollLeft, 500);
  advance(300);
  wheel();
  advance(1100);
  assert.equal(el.scrollLeft, 1000);
});

test('reduced motion uses the same stops immediately; dots jump to a complete scene', t => {
  const { el, paging, wheel, frames } = setup(t, { reduced: true });
  wheel();
  assert.equal(el.scrollLeft, 500);
  assert.equal(frames.size, 0);
  paging.scrollToPanel(2);
  assert.equal(el.scrollLeft, 2000);
  paging.step(-1);
  assert.equal(el.scrollLeft, 1500);
});

test('zoom passes through, pointer input cancels easing, and cleanup removes callbacks', t => {
  const { el, paging, advance, wheel, frames, listeners, windowListeners } = setup(t);
  assert.equal(wheel(100, { ctrlKey: true }), false);
  wheel();
  advance(200);
  listeners.get('pointerdown')();
  const position = el.scrollLeft;
  advance(1100);
  assert.equal(el.scrollLeft, position);
  paging.step(1);
  paging.destroy();
  assert.equal(frames.size, 0);
  assert.equal(listeners.size, 0);
  assert.equal(windowListeners.size, 0);
});

test('hidden panels produce only valid stops, and a single panel does not trap scrolling', t => {
  const { el, paging, advance } = setup(t, { count: 2 });
  paging.step(1);
  advance(1100);
  assert.equal(el.scrollLeft, 500);
  paging.step(1);
  advance(1100);
  assert.equal(el.scrollLeft, 1000);
  assert.equal(paging.step(1), false);
});

test('a single panel allows native scrolling', t => {
  const { wheel } = setup(t, { count: 1 });
  assert.equal(wheel(), false);
});
