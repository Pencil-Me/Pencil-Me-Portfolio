import type { Environment } from './environment.model';

/**
 * Docker Shared-Hosting-Simulation: Frontend und REST-API auf getrennten Ports/Origins.
 * Entspricht Production (Hauptdomain -> API-Subdomain), nicht dem /api2-Gateway.
 *
 * Stack: docker compose -f docker-compose.yml -f docker-compose.shared-hosting-sim.yml up --build
 */
export const environment: Environment = {
  production: true,
  API_KEY: 'secretApiFEkey',
  API_BASE_URL: 'http://localhost:3003/index.php',
  API_KEY_IN_QUERY: true,
};
