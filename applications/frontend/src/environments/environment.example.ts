import type { Environment } from './environment.model';

/**
 * Vorlage fuer eigene Overrides.
 * Kopiere nach environment.production.ts und passe API_KEY / API_BASE_URL an.
 */
export const environment: Environment = {
  production: true,
  API_KEY: 'XXXXXXX_SECRET_KEY',
  API_BASE_URL: 'https://api.example.com/index.php',
};
