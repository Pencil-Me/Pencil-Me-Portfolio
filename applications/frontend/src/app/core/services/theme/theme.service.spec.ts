import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-bs-theme');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle between light and dark', () => {
    service.init();
    const initial = service.theme();

    service.toggle();
    expect(service.theme()).not.toBe(initial);
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe(service.theme());
  });

  it('should persist theme preference', () => {
    service.init();
    service.toggle();
    expect(localStorage.getItem('pm-theme')).toBe(service.theme());
  });

  it('should restore stored theme from localStorage', () => {
    localStorage.setItem('pm-theme', 'dark');

    service.init();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });

  it('should prefer system dark mode when no preference is stored', () => {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    } as MediaQueryList);

    service.init();

    expect(service.theme()).toBe('dark');
  });

  it('should toggle back to the previous theme', () => {
    service.init();
    const initial = service.theme();

    service.toggle();
    service.toggle();

    expect(service.theme()).toBe(initial);
  });
});
