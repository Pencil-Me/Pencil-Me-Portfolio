import { Routes } from '@angular/router';
import { BasicComponent } from '@layout/basic/basic.component';
import { SeoGuard } from '@core/guards/seo.guard';

// Route configurations for the application
export const routes: Routes = [
  {
    path: '',
    component: BasicComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('@modules/home/home.component').then((c) => c.HomeComponent),
        canActivate: [SeoGuard],
        data: {
          title: 'Home - Pencil&Me',
          description: 'Willkommen auf der Startseite von Pencil&Me. Hier finden Sie das Portfolio von Johannes Kromer.',
          keywords: 'Portfolio, Pencil&Me, Johannes Kromer, Startseite',
          ogTitle: 'Home - Pencil&Me',
          ogDescription: 'Willkommen auf der Startseite von Pencil&Me. Hier finden Sie das Portfolio von Johannes Kromer.',
          ogUrl: 'https://www.pencil-me.de/home',
          ogType: 'website',
        },
      },
      {
        path: 'contact',
        loadComponent: () => import('@modules/contact/contact.component').then((c) => c.ContactComponent),
        canActivate: [SeoGuard],
        data: {
          title: 'Kontakt - Pencil&Me',
          description: 'Kontaktieren Sie Johannes Kromer, Freelance Frontend Developer bei Pencil&Me.',
          keywords: 'Kontakt, Pencil&Me, Johannes Kromer, Frontend Developer',
          ogTitle: 'Kontakt - Pencil&Me',
          ogDescription: 'Kontaktieren Sie Johannes Kromer, Freelance Frontend Developer bei Pencil&Me.',
          ogUrl: 'https://www.pencil-me.de/contact',
          ogType: 'website',
        },
      },
      {
        path: 'contact/:type',
        loadComponent: () => import('@modules/contact/contact.component').then((c) => c.ContactComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('@modules/about/about.component').then((c) => c.AboutComponent),
        canActivate: [SeoGuard],
        data: {
          title: 'Über Mich - Pencil&Me',
          description: 'Erfahren Sie mehr über Johannes Kromer und Pencil&Me, sein Portfolio und seine Projekte.',
          keywords: 'Über uns, Pencil&Me, Johannes Kromer, Projekte',
          ogTitle: 'Über Uns - Pencil&Me',
          ogDescription: 'Erfahren Sie mehr über Johannes Kromer und Pencil&Me, sein Portfolio und seine Projekte.',
          ogUrl: 'https://www.pencil-me.de/about',
          ogType: 'website',
        },
      },
      {
        path: 'projects',
        loadComponent: () => import('@modules/projects/projects.component').then((c) => c.ProjectsComponent),
        canActivate: [SeoGuard],
        data: {
          title: 'Projekte - Pencil&Me',
          description: 'Entdecken Sie die Projekte von Johannes Kromer bei Pencil&Me.',
          keywords: 'Projekte, Pencil&Me, Johannes Kromer, Portfolio',
          ogTitle: 'Projekte - Pencil&Me',
          ogDescription: 'Entdecken Sie die Projekte von Johannes Kromer bei Pencil&Me.',
          ogUrl: 'https://www.pencil-me.de/projects',
          ogType: 'website',
        },
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('@modules/projects/details/details.component').then((c) => c.ProjectDetailsComponent),
      },
      {
        path: 'impressum',
        loadComponent: () => import('@modules/impressum/impressum.component').then((c) => c.ImpressumComponent),
      },
      {
        path: 'datenschutz',
        loadComponent: () => import('@modules/datenschutz/datenschutz.component').then((c) => c.DatenschutzComponent),
      },
      {
        path: 'error',
        loadChildren: () => import('@modules/error/error.module').then((m) => m.ErrorModule),
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
