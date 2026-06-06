function isJasmineSpy(value: unknown): value is jasmine.Spy {
  return (
    typeof value === 'function' &&
    'and' in value &&
    typeof (value as jasmine.Spy).and?.callFake === 'function'
  );
}

export function installMatchMediaSpy(getPrefersReducedMotion: () => boolean): void {
  const impl = (query: string) =>
    ({
      matches: getPrefersReducedMotion() && query.includes('reduce'),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;

  if (isJasmineSpy(window.matchMedia)) {
    window.matchMedia.and.callFake(impl);
    return;
  }

  spyOn(window, 'matchMedia').and.callFake(impl);
}

export interface IntersectionObserverSpyState {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
}

export function installIntersectionObserverSpy(state: IntersectionObserverSpyState): void {
  const impl = function (
    this: void,
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    state.callback = callback;
    state.options = options;
    return {
      observe: () => undefined,
      unobserve: () => undefined,
      disconnect: jasmine.createSpy('disconnect'),
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: () => [],
    } as IntersectionObserver;
  };

  const intersectionObserver = window.IntersectionObserver as unknown;

  if (isJasmineSpy(intersectionObserver)) {
    intersectionObserver.and.callFake(impl);
    return;
  }

  spyOn(window, 'IntersectionObserver').and.callFake(impl);
}

export function installRequestAnimationFrameSpy(): void {
  const impl = (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  };

  if (isJasmineSpy(window.requestAnimationFrame)) {
    window.requestAnimationFrame.and.callFake(impl);
    return;
  }

  spyOn(window, 'requestAnimationFrame').and.callFake(impl);
}
