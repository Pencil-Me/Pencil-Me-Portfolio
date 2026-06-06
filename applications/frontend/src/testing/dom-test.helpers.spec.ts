import {
  installIntersectionObserverSpy,
  installMatchMediaSpy,
  installRequestAnimationFrameSpy,
} from './dom-test.helpers';

describe('dom-test.helpers', () => {
  afterEach(() => {
    (window.matchMedia as jasmine.Spy)?.and?.callThrough?.();
    (window.IntersectionObserver as unknown as jasmine.Spy)?.and?.callThrough?.();
    (window.requestAnimationFrame as jasmine.Spy)?.and?.callThrough?.();
  });

  describe('installMatchMediaSpy', () => {
    it('installs matchMedia spy and respects reduced-motion query', () => {
      installMatchMediaSpy(() => true);

      expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBeTrue();
      expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBeFalse();
    });

    it('reuses existing matchMedia spy', () => {
      installMatchMediaSpy(() => false);
      installMatchMediaSpy(() => true);

      expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBeTrue();
    });
  });

  describe('installIntersectionObserverSpy', () => {
    it('captures callback and returns observer stub', () => {
      const state: { callback: IntersectionObserverCallback; options?: IntersectionObserverInit } =
        {
          callback: () => undefined,
        };
      installIntersectionObserverSpy(state);

      const observer = new IntersectionObserver(state.callback, { threshold: 0.5 });

      expect(state.options).toEqual({ threshold: 0.5 });
      expect(typeof observer.disconnect).toBe('function');
    });

    it('reuses existing IntersectionObserver spy', () => {
      const state = { callback: () => undefined };
      installIntersectionObserverSpy(state);
      installIntersectionObserverSpy(state);

      expect(window.IntersectionObserver).toBeDefined();
    });
  });

  describe('installRequestAnimationFrameSpy', () => {
    it('invokes callback synchronously', () => {
      const callback = jasmine.createSpy('rAF');
      installRequestAnimationFrameSpy();

      window.requestAnimationFrame(callback);

      expect(callback).toHaveBeenCalledWith(0);
    });

    it('reuses existing requestAnimationFrame spy', () => {
      const callback = jasmine.createSpy('rAF');
      installRequestAnimationFrameSpy();
      installRequestAnimationFrameSpy();

      window.requestAnimationFrame(callback);

      expect(callback).toHaveBeenCalledWith(0);
    });
  });
});
