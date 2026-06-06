import { TestBed } from '@angular/core/testing';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollService);
  });

  it('should calculate distance to bottom', () => {
    spyOnProperty(document.body, 'scrollHeight', 'get').and.returnValue(2000);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(800);
    spyOnProperty(window, 'scrollY', 'get').and.returnValue(300);

    expect(service.calculateDistanceToBottom()).toBe(900);
  });

  it('should scroll to top smoothly', () => {
    const scrollToSpy = spyOn(window, 'scrollTo');

    service.scrollToTop();

    expect(scrollToSpy).toHaveBeenCalled();
    const options = scrollToSpy.calls.mostRecent().args[0] as ScrollToOptions;
    expect(options.top).toBe(0);
    expect(options.behavior).toBe('smooth');
  });

  it('should return scroll position from window.scrollY', () => {
    spyOnProperty(window, 'scrollY', 'get').and.returnValue(420);

    expect(service.getScrollPosition()).toBe(420);
  });

  it('should fall back to documentElement.scrollTop', () => {
    spyOnProperty(window, 'scrollY', 'get').and.returnValue(0);
    spyOnProperty(document.documentElement, 'scrollTop', 'get').and.returnValue(180);

    expect(service.getScrollPosition()).toBe(180);
  });

  it('should return zero progress when page is not scrollable', () => {
    spyOnProperty(document.documentElement, 'scrollHeight', 'get').and.returnValue(800);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(800);
    spyOn(service, 'getScrollPosition').and.returnValue(0);

    expect(service.getScrollProgress()).toBe(0);
  });

  it('should clamp scroll progress between 0 and 1', () => {
    spyOnProperty(document.documentElement, 'scrollHeight', 'get').and.returnValue(1800);
    spyOnProperty(window, 'innerHeight', 'get').and.returnValue(800);
    spyOn(service, 'getScrollPosition').and.returnValue(500);

    expect(service.getScrollProgress()).toBe(0.5);
  });

  it('should scroll to element when it exists', () => {
    const element = document.createElement('section');
    element.id = 'target-section';
    spyOn(document, 'getElementById').and.returnValue(element);
    const scrollIntoViewSpy = spyOn(element, 'scrollIntoView');

    service.scrollToElement('target-section');

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should ignore missing scroll targets', () => {
    spyOn(document, 'getElementById').and.returnValue(null);

    expect(() => service.scrollToElement('missing')).not.toThrow();
  });
});
