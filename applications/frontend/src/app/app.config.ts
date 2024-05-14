import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideClientHydration } from '@angular/platform-browser';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { appEffects, appStore } from '@app/state';

// Configuration for the Angular application
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Provides routing configuration
    provideHttpClient(), // Provides HTTP client for making API calls
    provideStore(appStore), // Provides NgRx store for state management
    provideEffects(appEffects), // Provides NgRx effects for handling side effects
    provideClientHydration(), // Provides client-side hydration for server-side rendering
  ],
};

/**
 * This module sets up the main application configuration.
 * - Routes are provided using the `provideRouter` function.
 * - The HTTP client is set up using `provideHttpClient` for making API calls.
 * - NgRx store and effects are configured for state management and handling side effects.
 * - Client-side hydration is enabled for server-side rendering.
 */
