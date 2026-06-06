import type { Environment } from './environment.model';

/**
 * Lokale Entwicklung: `npm start` (ng serve :4200)
 * API-Aufrufe gehen an /api2 und werden per proxy.conf.json an localhost:8080 weitergeleitet.
 * Voraussetzung: Docker-Stack mit Nginx-Gateway (docker compose up) oder API auf :8080.
 */
export const environment: Environment = {
  production: false,
  API_KEY: 'secretApiFEkey',
  API_BASE_URL: '/api2',
};
