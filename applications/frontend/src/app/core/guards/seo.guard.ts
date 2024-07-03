import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoGuard implements CanActivate {

  constructor(private meta: Meta, private title: Title) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const routeData = next.data;

    const title = typeof routeData['title'] === 'function' ? routeData['title'](next) : routeData['title'];
    const description = typeof routeData['description'] === 'function' ? routeData['description'](next) : routeData['description'];

    this.title.setTitle(title || 'Pencil&Me');

    this.meta.updateTag({ name: 'description', content: description || 'Pencil&Me - das Portfolio von Johannes Kromer' });

    if (routeData['keywords']) {
      this.meta.updateTag({ name: 'keywords', content: routeData['keywords'] });
    }

    if (routeData['ogTitle']) {
      this.meta.updateTag({ property: 'og:title', content: routeData['ogTitle'] });
    }

    if (routeData['ogDescription']) {
      this.meta.updateTag({ property: 'og:description', content: routeData['ogDescription'] });
    }

    if (routeData['ogUrl']) {
      this.meta.updateTag({ property: 'og:url', content: routeData['ogUrl'] });
    }

    if (routeData['ogType']) {
      this.meta.updateTag({ property: 'og:type', content: routeData['ogType'] });
    }

    return true;
  }
}
