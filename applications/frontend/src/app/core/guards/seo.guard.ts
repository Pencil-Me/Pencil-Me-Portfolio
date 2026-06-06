import { Injectable, inject } from '@angular/core';
import type { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

type RouteSeoData = {
  title?: string | ((route: ActivatedRouteSnapshot) => string);
  description?: string | ((route: ActivatedRouteSnapshot) => string);
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: string;
};

function resolveRouteValue<T>(
  value: T | ((route: ActivatedRouteSnapshot) => T) | undefined,
  route: ActivatedRouteSnapshot,
): T | undefined {
  if (typeof value === 'function') {
    return (value as (route: ActivatedRouteSnapshot) => T)(route);
  }

  return value;
}

function applySeoMeta(meta: Meta, routeData: RouteSeoData, route: ActivatedRouteSnapshot): void {
  const description = resolveRouteValue(routeData.description, route);

  meta.updateTag({
    name: 'description',
    content: description || 'Pencil&Me - das Portfolio von Johannes Kromer',
  });

  if (routeData.keywords) {
    meta.updateTag({ name: 'keywords', content: routeData.keywords });
  }

  const openGraphTags: Array<[keyof RouteSeoData, string]> = [
    ['ogTitle', 'og:title'],
    ['ogDescription', 'og:description'],
    ['ogUrl', 'og:url'],
    ['ogType', 'og:type'],
  ];

  for (const [key, property] of openGraphTags) {
    const content = routeData[key];
    if (typeof content === 'string') {
      meta.updateTag({ property, content });
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class SeoGuard implements CanActivate {
  private meta = inject(Meta);
  private title = inject(Title);

  canActivate(next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const routeData = next.data as RouteSeoData;
    const title = resolveRouteValue(routeData.title, next);

    this.title.setTitle(title || 'Pencil&Me');
    applySeoMeta(this.meta, routeData, next);

    return true;
  }
}
