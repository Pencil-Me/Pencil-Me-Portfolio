import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'pm-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly theme = signal<ThemeMode>('light');

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.apply(this.resolveInitialTheme(), false);
  }

  toggle(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const next: ThemeMode = this.theme() === 'light' ? 'dark' : 'light';
    this.apply(next, true);
  }

  private resolveInitialTheme(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(theme: ThemeMode, persist: boolean): void {
    this.theme.set(theme);
    this.document.documentElement.setAttribute('data-bs-theme', theme);
    this.document.documentElement.style.colorScheme = theme;

    const meta = this.document.querySelector('meta[name="theme-color"]');
    const themeColor = getComputedStyle(this.document.documentElement)
      .getPropertyValue('--pm-theme-color')
      .trim();

    if (themeColor) {
      meta?.setAttribute('content', themeColor);
    }

    if (persist) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }
}
