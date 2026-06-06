import type { Type } from '@angular/core';

type RouteComponentLoader = () => Promise<Type<unknown>>;

/** Zentrale Lazy-Load-Funktionen fuer Routes und Prefetch (Home ist eager). */
export const routeLoaders = {
  contact: () => import('@modules/contact/contact.component').then((c) => c.ContactComponent),
  about: () => import('@modules/about/about.component').then((c) => c.AboutComponent),
  projects: () => import('@modules/projects/projects.component').then((c) => c.ProjectsComponent),
  'project-details': () =>
    import('@modules/projects/details/details.component').then((c) => c.ProjectDetailsComponent),
  impressum: () => import('@modules/impressum/impressum.component').then((c) => c.ImpressumComponent),
  datenschutz: () =>
    import('@modules/datenschutz/datenschutz.component').then((c) => c.DatenschutzComponent),
} satisfies Record<string, RouteComponentLoader>;

export type PrefetchableRoute = keyof typeof routeLoaders;

const prefetchableRoutes = new Set<string>(Object.keys(routeLoaders));

export function isPrefetchableRoute(path: string): path is PrefetchableRoute {
  return prefetchableRoutes.has(path);
}
