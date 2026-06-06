import type { Routes } from '@angular/router';

import { ForbiddenErrorComponent } from '@modules/error/components/forbidden-error/forbidden-error.component';
import { NotFoundErrorComponent } from '@modules/error/components/not-found-error/not-found-error.component';
import { ErrorComponent } from '@modules/error/layout/error.component';

export const errorRoutes: Routes = [
  {
    path: '',
    component: ErrorComponent,
    children: [
      { path: '', redirectTo: '404', pathMatch: 'full' },
      { path: '403', component: ForbiddenErrorComponent },
      { path: '404', component: NotFoundErrorComponent },
      { path: '**', redirectTo: '404', pathMatch: 'full' },
    ],
  },
];
