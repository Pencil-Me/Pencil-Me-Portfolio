/** PHP `/api2`-Mockdaten fuer Playwright (snake_case wie Live-API). */

export const mockProjectsPayload = [
  {
    uuid: 'e2e-project-1',
    type: 'CUST',
    name: 'E2E Test Project',
    position: 'Full Stack Developer',
    content: 'Playwright mock project',
    dates: [{ start_date: '2020-01-01', end_date: '2021-06-01' }],
    tech: [{ uuid: 'e2e-tech-1', name: 'Angular', expertise_level: '5', type: 'FEDEV' }],
    customers: [{ name: 'Mock GmbH', location: 'Berlin', last_used_date: '2021-05-01' }],
  },
];

export const mockTechStackPayload = [
  {
    type: 'FEDEV',
    name: 'Angular',
    expertise_level: 90,
    last_usage_date: '2024-01-01',
    flag_important: true,
    project_count: 12,
    project_dates: [],
  },
];

export const mockCustomersPayload = [
  {
    name: 'Mock GmbH',
    location: 'Berlin',
    last_used_date: '2021-05-01',
  },
];

export type MockApiMode = 'success' | 'projects-error';

export function resolveMockApiBody(path: string, mode: MockApiMode): string {
  if (mode === 'projects-error' && path.includes('all_projects')) {
    return JSON.stringify({ message: 'E2E simulated API failure' });
  }

  if (path.includes('all_projects')) {
    return JSON.stringify(mockProjectsPayload);
  }

  if (path.includes('all_techstacks')) {
    return JSON.stringify(mockTechStackPayload);
  }

  if (path.includes('all_customers')) {
    return JSON.stringify(mockCustomersPayload);
  }

  if (path.includes('get_project/')) {
    return JSON.stringify(mockProjectsPayload[0]);
  }

  return '[]';
}
