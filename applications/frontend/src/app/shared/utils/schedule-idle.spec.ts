import { fakeAsync, tick } from '@angular/core/testing';

import { scheduleAfterPaint, scheduleIdleWork } from './schedule-idle';

describe('schedule-idle', () => {
  let originalRaf: typeof window.requestAnimationFrame;
  let originalIdle: typeof window.requestIdleCallback | undefined;

  beforeEach(() => {
    originalRaf = window.requestAnimationFrame;
    originalIdle = window.requestIdleCallback;
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRaf;
    if (originalIdle) {
      window.requestIdleCallback = originalIdle;
    } else {
      delete (window as unknown as { requestIdleCallback?: typeof window.requestIdleCallback })
        .requestIdleCallback;
    }
  });

  it('should run work after paint via requestAnimationFrame', fakeAsync(() => {
    const work = jasmine.createSpy('work');
    spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    scheduleAfterPaint(work);
    tick(0);

    expect(work).toHaveBeenCalled();
  }));

  it('should fall back to timeout when requestAnimationFrame is unavailable', fakeAsync(() => {
    (window as unknown as { requestAnimationFrame: typeof window.requestAnimationFrame | undefined })
      .requestAnimationFrame = undefined;
    const work = jasmine.createSpy('work');

    scheduleAfterPaint(work);
    tick(0);

    expect(work).toHaveBeenCalled();
  }));

  it('should run idle work via requestIdleCallback', fakeAsync(() => {
    const work = jasmine.createSpy('work');
    spyOn(window, 'requestIdleCallback').and.callFake((callback: IdleRequestCallback) => {
      callback({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
      return 1;
    });

    scheduleIdleWork(work);
    tick(0);

    expect(work).toHaveBeenCalled();
  }));

  it('should fall back to timeout when requestIdleCallback is unavailable', fakeAsync(() => {
    (window as unknown as { requestIdleCallback: typeof window.requestIdleCallback | undefined })
      .requestIdleCallback = undefined;
    const work = jasmine.createSpy('work');

    scheduleIdleWork(work);
    tick(1);

    expect(work).toHaveBeenCalled();
  }));
});
