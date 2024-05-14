import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

/**
 * This configuration sets up server-side rendering.
 * It merges the base application configuration with the server-side specific configuration.
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(), // Provides server-side rendering capabilities
  ],
};

/**
 * Merges the main application configuration with the server-specific configuration.
 * This creates a unified configuration for both client-side and server-side rendering.
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
