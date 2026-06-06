import { Injectable } from '@angular/core';

import { isPrefetchableRoute, routeLoaders, type PrefetchableRoute } from '@core/routing/route-loaders';

function normalizeRoutePath(path: string): string {
  return path.replace(/^\/+/, '').split('/')[0] ?? '';
}

function shouldPrefetchRoute(route: string, prefetched: Set<string>): route is PrefetchableRoute {
  return Boolean(route) && !prefetched.has(route) && isPrefetchableRoute(route);
}

/**
 * Laedt Route-Chunks im Hintergrund vor (Hover/Focus), damit der erste Klick schneller ist.
 */
@Injectable({ providedIn: 'root' })
export class RoutePrefetchService {
  private readonly prefetched = new Set<string>();

  prefetch(path: string): void {
    const normalized = normalizeRoutePath(path);

    if (!shouldPrefetchRoute(normalized, this.prefetched)) {
      return;
    }

    this.prefetched.add(normalized);
    void routeLoaders[normalized]().catch(() => {
      this.prefetched.delete(normalized);
    });
  }
}
