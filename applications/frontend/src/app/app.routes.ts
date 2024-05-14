import { Routes } from '@angular/router';
import { BasicComponent } from '@layout/basic/basic.component';

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
      },
      {
        path: 'contact',
        loadComponent: () => import('@modules/contact/contact.component').then((c) => c.ContactComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('@modules/about/about.component').then((c) => c.AboutComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('@modules/projects/projects.component').then((c) => c.ProjectsComponent),
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
