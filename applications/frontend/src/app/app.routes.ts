import { Routes } from '@angular/router';
import { BasicComponent } from '@layout/basic/basic.component';

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
      // {
      //   path: 'cv',
      //   loadComponent: () => import('@modules/cv/cv.component').then((c) => c.CvComponent),
      // },
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
