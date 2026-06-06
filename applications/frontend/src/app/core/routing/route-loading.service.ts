import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter } from 'rxjs';

/**
 * Steuert einen kurzen Lade-Overlay waehrend Route-Wechseln (v. a. Lazy-Chunks).
 * Kurze Verzoegerung beim Einblenden vermeidet Flackern bei schnellen Navigationen.
 */
@Injectable({ providedIn: 'root' })
export class RouteLoadingService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly visible = signal(false);

  private activeNavigations = 0;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private shownAt = 0;

  private readonly showDelayMs = 120;
  private readonly minVisibleMs = 280;

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.onNavigationStart(event);
          return;
        }

        this.onNavigationFinished();
      });
  }

  private onNavigationStart(event: NavigationStart): void {
    if (event.navigationTrigger === 'popstate') {
      return;
    }

    this.activeNavigations += 1;

    if (this.activeNavigations !== 1 || this.showTimer !== null || this.visible()) {
      return;
    }

    this.clearHideTimer();
    this.showTimer = setTimeout(() => {
      this.showTimer = null;

      if (this.activeNavigations > 0) {
        this.shownAt = Date.now();
        this.visible.set(true);
      }
    }, this.showDelayMs);
  }

  private onNavigationFinished(): void {
    this.activeNavigations = Math.max(0, this.activeNavigations - 1);

    if (this.activeNavigations > 0) {
      return;
    }

    this.clearShowTimer();

    if (!this.visible()) {
      return;
    }

    const elapsed = Date.now() - this.shownAt;
    const remaining = Math.max(0, this.minVisibleMs - elapsed);

    this.clearHideTimer();
    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      this.visible.set(false);
    }, remaining);
  }

  private clearShowTimer(): void {
    if (this.showTimer === null) {
      return;
    }

    clearTimeout(this.showTimer);
    this.showTimer = null;
  }

  private clearHideTimer(): void {
    if (this.hideTimer === null) {
      return;
    }

    clearTimeout(this.hideTimer);
    this.hideTimer = null;
  }
}
