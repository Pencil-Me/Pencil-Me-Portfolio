import type { Environment } from './environment.model';

/**
 * Production-Deployment (öffentliche API).
 * Build: npm run build:prod
 *
 * API_KEY vor Deploy setzen (nicht committen) — Vorlage: environment.example.ts
 */
export const environment: Environment = {
  production: true,
  API_KEY: 'REPLACE_BEFORE_DEPLOY',
  API_BASE_URL: 'https://api.pencil-me.eu/index.php',
};
