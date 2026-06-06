import { Injectable } from '@angular/core';
import type { PreloadingStrategy, Route } from '@angular/router';
import type { Observable } from 'rxjs';
import { Observable as RxObservable } from 'rxjs';

/**
 * Laedt Lazy-Routes erst nach Idle, damit Initial-Bundle und Home nicht konkurrieren.
 */
@Injectable({ providedIn: 'root' })
export class DelayedPreloadStrategy implements PreloadingStrategy {
  private readonly idleTimeoutMs = 3500;

  preload(_route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return new RxObservable((subscriber) => {
      const startLoad = (): void => {
        load().subscribe({
          next: (value) => subscriber.next(value),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete(),
        });
      };

      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(startLoad, { timeout: this.idleTimeoutMs });
      } else {
        setTimeout(startLoad, this.idleTimeoutMs);
      }
    });
  }
}
