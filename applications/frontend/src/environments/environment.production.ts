import type { Environment } from './environment.model';

/**
 * Production-Deployment (öffentliche API).
 * Build: npm run build:prod
 */
export const environment: Environment = {
  production: true,
  API_KEY: 'apikey123',
  API_BASE_URL: 'https://api.pencil-me.eu/index.php',
};
