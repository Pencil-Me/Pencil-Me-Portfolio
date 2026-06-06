import type { ApplicationConfig } from '@angular/core';
import { inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { appEffects, appStore } from '@app/state';
import { KnowledgeBootstrapService } from '@app/state/knowledge/knowledge-bootstrap.service';
import { apiErrorInterceptor } from '@core/interceptors/api-error.interceptor';
import { DelayedPreloadStrategy } from '@core/routing/delayed-preload.strategy';

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
