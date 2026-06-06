import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject, provideAppInitializer, type ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { apiErrorInterceptor } from '@core/interceptors/api-error.interceptor';
import { DelayedPreloadStrategy } from '@core/routing/delayed-preload.strategy';
import { appEffects, appStore } from '@app/state';
import { KnowledgeBootstrapService } from '@app/state/knowledge/knowledge-bootstrap.service';

import { routes } from './app.routes';

// Configuration for the Angular application
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(DelayedPreloadStrategy)),
    provideHttpClient(withInterceptors([apiErrorInterceptor])),
    provideStore(appStore),
    provideEffects(appEffects),
    provideAppInitializer(() => {
      inject(KnowledgeBootstrapService).ensureLoaded();
    }),
  ],
};
