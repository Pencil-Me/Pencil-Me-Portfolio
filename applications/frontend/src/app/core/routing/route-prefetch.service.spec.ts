import { TestBed } from '@angular/core/testing';

import { routeLoaders } from './route-loaders';
import { RoutePrefetchService } from './route-prefetch.service';

describe('RoutePrefetchService', () => {
  let service: RoutePrefetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutePrefetchService],
    });

    service = TestBed.inject(RoutePrefetchService);
  });

  it('prefetches a known route only once', () => {
    const loaderSpy = spyOn(routeLoaders, 'about').and.returnValue(Promise.resolve({} as never));

    service.prefetch('about');
    service.prefetch('about');

    expect(loaderSpy).toHaveBeenCalledTimes(1);
  });

  it('ignores unknown routes', () => {
    const loaderSpy = spyOn(routeLoaders, 'contact');

    service.prefetch('unknown');

    expect(loaderSpy).not.toHaveBeenCalled();
  });

  it('normalizes leading slashes', () => {
    const loaderSpy = spyOn(routeLoaders, 'projects').and.returnValue(Promise.resolve({} as never));

    service.prefetch('/projects');

    expect(loaderSpy).toHaveBeenCalledTimes(1);
  });
});
