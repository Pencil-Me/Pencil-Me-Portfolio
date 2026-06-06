import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';

import { RouteLoadingService } from './route-loading.service';

describe('RouteLoadingService', () => {
  let service: RouteLoadingService;
  let events$: Subject<unknown>;
  let router: { events: Subject<unknown> };

  beforeEach(() => {
    events$ = new Subject();
    router = { events: events$ };

    TestBed.configureTestingModule({
      providers: [RouteLoadingService, { provide: Router, useValue: router }],
    });

    service = TestBed.inject(RouteLoadingService);
  });

  afterEach(() => {
    events$.complete();
  });

  it('shows overlay after delay when navigation starts', fakeAsync(() => {
    events$.next(new NavigationStart(1, '/about', 'imperative'));

    expect(service.visible()).toBeFalse();

    tick(120);

    expect(service.visible()).toBeTrue();
  }));

  it('hides overlay after navigation ends', fakeAsync(() => {
    events$.next(new NavigationStart(1, '/about', 'imperative'));
    tick(120);
    expect(service.visible()).toBeTrue();

    events$.next(new NavigationEnd(1, '/about', '/about'));
    tick(280);

    expect(service.visible()).toBeFalse();
  }));

  it('does not show overlay for browser back/forward', fakeAsync(() => {
    events$.next(new NavigationStart(1, '/about', 'popstate'));
    tick(200);

    expect(service.visible()).toBeFalse();
  }));

  it('clears overlay on navigation error', fakeAsync(() => {
    events$.next(new NavigationStart(1, '/about', 'imperative'));
    tick(120);
    events$.next(new NavigationError(1, '/about', 'failed'));
    tick(280);

    expect(service.visible()).toBeFalse();
  }));

  it('clears overlay on navigation cancel', fakeAsync(() => {
    events$.next(new NavigationStart(1, '/about', 'imperative'));
    tick(120);
    events$.next(new NavigationCancel(1, '/about', ''));
    tick(280);

    expect(service.visible()).toBeFalse();
  }));
});
