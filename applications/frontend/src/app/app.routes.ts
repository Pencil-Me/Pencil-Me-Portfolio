import type { Routes } from '@angular/router';
import { BasicComponent } from '@layout/basic/basic.component';
import { SeoGuard } from '@core/guards/seo.guard';
import { routeLoaders } from '@core/routing/route-loaders';
import { HomeComponent } from '@modules/home/home.component';

// Route configurations for the application
export const routes: Routes = [
  {
    path: '',
    component: BasicComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [SeoGuard],
        data: {
          title: 'Start – Pencil&Me',
          description:
            'Portfolio von Johannes Kromer: Über 20 Jahre Frontend-Entwicklung aus Berlin – digitale Produkte, UI/UX und Projekte von Enterprise bis IoT.',
          keywords:
            'Johannes Kromer, Frontend-Entwickler, Portfolio, Pencil&Me, Berlin, Angular, UI/UX',
          ogTitle: 'Johannes Kromer – Frontend-Entwickler aus Berlin | Pencil&Me',
          ogDescription:
            'Portfolio von Johannes Kromer: Über 20 Jahre Frontend-Entwicklung aus Berlin – digitale Produkte, UI/UX und Projekte von Enterprise bis IoT.',
          ogUrl: 'https://www.pencil-me.de/home',
          ogType: 'website',
        },
      },
      {
        path: 'contact',
        loadComponent: routeLoaders.contact,
        canActivate: [SeoGuard],
        data: {
          title: 'Kontakt – Pencil&Me',
          description:
            'Schreib mir für allgemeine Anfragen oder eine Projektanfrage. Freelance Frontend-Entwicklung aus Berlin – ich melde mich zeitnah zurück.',
          keywords:
            'Kontakt, Projektanfrage, Johannes Kromer, Frontend-Entwickler, Pencil&Me, Berlin',
          ogTitle: 'Kontakt – Pencil&Me',
          ogDescription:
            'Schreib mir für allgemeine Anfragen oder eine Projektanfrage. Freelance Frontend-Entwicklung aus Berlin – ich melde mich zeitnah zurück.',
          ogUrl: 'https://www.pencil-me.de/contact',
          ogType: 'website',
        },
      },
      {
        path: 'contact/:type',
        loadComponent: routeLoaders.contact,
      },
      {
        path: 'about',
        loadComponent: routeLoaders.about,
        canActivate: [SeoGuard],
        data: {
          title: 'Über mich – Pencil&Me',
          description:
            'Web- und Mobile-Entwickler mit über 20 Jahren Erfahrung: Arbeitsweise, Tech-Skills und Hintergrund – von Agentur über Konzern bis Einzelprojekte.',
          keywords:
            'Über mich, Johannes Kromer, Frontend-Entwickler, Tech-Skills, Pencil&Me, Berlin',
          ogTitle: 'Über mich – Pencil&Me',
          ogDescription:
            'Web- und Mobile-Entwickler mit über 20 Jahren Erfahrung: Arbeitsweise, Tech-Skills und Hintergrund – von Agentur über Konzern bis Einzelprojekte.',
          ogUrl: 'https://www.pencil-me.de/about',
          ogType: 'website',
        },
      },
      {
        path: 'projects',
        loadComponent: routeLoaders.projects,
        canActivate: [SeoGuard],
        data: {
          title: 'Projekte – Pencil&Me',
          description:
            'Über 90 Referenzprojekte in E-Commerce, Versicherung, IoT und Enterprise-Frontend – filterbar nach Technologie, mit Tech-Stack und Details.',
          keywords:
            'Projekte, Portfolio, Johannes Kromer, Frontend, Angular, E-Commerce, IoT, Pencil&Me',
          ogTitle: 'Projekte – Pencil&Me',
          ogDescription:
            'Über 90 Referenzprojekte in E-Commerce, Versicherung, IoT und Enterprise-Frontend – filterbar nach Technologie, mit Tech-Stack und Details.',
          ogUrl: 'https://www.pencil-me.de/projects',
          ogType: 'website',
        },
      },
      {
        path: 'projects/:id',
        loadComponent: routeLoaders['project-details'],
      },
      {
        path: 'impressum',
        loadComponent: routeLoaders.impressum,
      },
      {
        path: 'datenschutz',
        loadComponent: routeLoaders.datenschutz,
      },
      {
        path: 'error',
        loadChildren: () => import('@modules/error/error.routes').then((m) => m.errorRoutes),
      },
      { path: '**', redirectTo: 'error', pathMatch: 'full' },
    ],
  },
];

/**
 * This module defines the main routes for the application.
 * - The default route redirects to 'home'.
 * - Each route lazily loads its associated component.
 * - The 'projects/:id' route displays project details based on the project ID.
 * - The wildcard route '**' redirects to the 'error' module for undefined paths.
 */
