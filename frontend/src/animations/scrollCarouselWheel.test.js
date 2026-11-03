import test from 'node:test';
import assert from 'node:assert/strict';
import { createWheelStepper } from './scrollCarouselWheel.js';

const wheelEvent = (deltaY, extra = {}) => ({ deltaX: 0, deltaY, deltaMode: 0, ...extra });

test('scrolls through all four panels and releases the page at each end', () => {
  const wheel = createWheelStepper();
  let index = 0;
  for (let step = 1; step <= 3; step++) {
    const result = wheel.step(wheelEvent(120), index, 4, step * 1000, 800);
    assert.equal(result.preventScroll, true);
    assert.equal(result.index, step);
    index = result.index;
  }
  assert.deepEqual(wheel.step(wheelEvent(120), 3, 4, 4000, 800), { preventScroll: false, index: 3 });
  for (let step = 1; step <= 3; step++) {
    const result = wheel.step(wheelEvent(-120), index, 4, 4000 + step * 1000, 800);
    assert.equal(result.preventScroll, true);
    index = result.index;
  }
  assert.equal(index, 0);
  assert.deepEqual(wheel.step(wheelEvent(-120), 0, 4, 8000, 800), { preventScroll: false, index: 0 });
});

test('trackpad momentum cannot skip slides or escape immediately after reaching the final slide', () => {
  const wheel = createWheelStepper();
  assert.equal(wheel.step(wheelEvent(120), 2, 4, 0, 800).index, 3);
  for (let time = 20; time < 900; time += 20) {
    assert.deepEqual(wheel.step(wheelEvent(12), 3, 4, time, 800), { preventScroll: true, index: 3 });
  }
  assert.equal(wheel.step(wheelEvent(60), 3, 4, 1000, 800).preventScroll, false);
});

test('small trackpad deltas accumulate; reversing direction cancels the old accumulation', () => {
  const wheel = createWheelStepper();
  assert.equal(wheel.step(wheelEvent(20), 1, 4, 0, 800).index, 1);
  assert.equal(wheel.step(wheelEvent(20), 1, 4, 30, 800).index, 1);
  assert.equal(wheel.step(wheelEvent(-20), 1, 4, 60, 800).index, 1);
  assert.equal(wheel.step(wheelEvent(-30), 1, 4, 90, 800).index, 0);
});

test('normalizes line and page based wheel events', () => {
  for (const event of [wheelEvent(3, { deltaMode: 1 }), wheelEvent(1, { deltaMode: 2 })]) {
    assert.equal(createWheelStepper().step(event, 0, 4, 0, 800).index, 1);
  }
});

test('allows zoom, horizontal scrolling, and scrolling on a single slide', () => {
  const wheel = createWheelStepper();
  for (const extra of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { deltaX: 200 }]) {
    assert.equal(wheel.step(wheelEvent(120, extra), 1, 4, 0, 800).preventScroll, false);
  }
  assert.equal(wheel.step(wheelEvent(120), 0, 1, 0, 800).preventScroll, false);
  assert.equal(wheel.step(wheelEvent(0), 0, 4, 0, 800).preventScroll, false);
});

test('leaving the panel resets any pending wheel lock', () => {
  const wheel = createWheelStepper();
  wheel.step(wheelEvent(120), 0, 4, 0, 800);
  wheel.reset();
  assert.equal(wheel.step(wheelEvent(120), 1, 4, 100, 800).index, 2);
});
