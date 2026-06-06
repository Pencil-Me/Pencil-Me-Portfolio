import type { Environment } from './environment.model';

/**
 * Lokaler Docker-Stack (docker compose up).
 * Frontend wird ueber Nginx :8080 ausgeliefert — API gleiche Origin unter /api2.
 * Build: npm run build:docker (wird im Frontend-Dockerfile verwendet).
 */
export const environment: Environment = {
  production: true,
  API_KEY: 'apikey123',
  API_BASE_URL: '/api2',
};
