import type { Environment } from './environment.model';

/**
 * Vorlage fuer eigene Overrides.
 * Kopiere Werte nach environment.production.ts vor Prod-Build.
 *
 * URL-Formate:
 * - Lokal/Docker: `/api2` (relativ, gleiche Origin hinter Nginx)
 * - Production: `https://<host>/index.php` (PHP Front-Controller)
 */
export const environment: Environment = {
  production: true,
  API_KEY: 'XXXXXXX_SECRET_KEY',
  API_BASE_URL: 'https://api.pencil-me.eu/index.php',
};
