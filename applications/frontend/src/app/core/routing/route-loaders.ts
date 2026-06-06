import type { Type } from '@angular/core';

type RouteComponentLoader = () => Promise<Type<unknown>>;

function lazyRoute(
  importFn: () => Promise<Record<string, Type<unknown>>>,
  exportName: string,
): RouteComponentLoader {
  return () => importFn().then((module) => module[exportName]);
}

/** Zentrale Lazy-Load-Funktionen fuer Routes und Prefetch (Home ist eager). */
export const routeLoaders = {
  contact: lazyRoute(() => import('@modules/contact/contact.component'), 'ContactComponent'),
  about: lazyRoute(() => import('@modules/about/about.component'), 'AboutComponent'),
  projects: lazyRoute(() => import('@modules/projects/projects.component'), 'ProjectsComponent'),
  'project-details': lazyRoute(
    () => import('@modules/projects/details/details.component'),
    'ProjectDetailsComponent',
  ),
  impressum: lazyRoute(
    () => import('@modules/impressum/impressum.component'),
    'ImpressumComponent',
  ),
  datenschutz: lazyRoute(
    () => import('@modules/datenschutz/datenschutz.component'),
    'DatenschutzComponent',
  ),
} satisfies Record<string, RouteComponentLoader>;

export type PrefetchableRoute = keyof typeof routeLoaders;

const prefetchableRoutes = new Set<string>(Object.keys(routeLoaders));

export function isPrefetchableRoute(path: string): path is PrefetchableRoute {
  return prefetchableRoutes.has(path);
}
