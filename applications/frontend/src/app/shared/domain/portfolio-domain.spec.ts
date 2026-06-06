import {
  LOAD_STATUSES,
  PROJECT_TYPES,
  TECH_STACK_TYPES,
} from './portfolio-domain';

describe('portfolio-domain', () => {
  it('should expose canonical project types', () => {
    expect(PROJECT_TYPES).toEqual(['CUST', 'PRIV', 'FEST']);
  });

  it('should expose canonical tech stack types', () => {
    expect(TECH_STACK_TYPES.length).toBe(13);
    expect(TECH_STACK_TYPES).toContain('FEDEV');
  });

  it('should expose load status values aligned with frontend LoadStatus', () => {
    expect(LOAD_STATUSES).toEqual(['PENDING', 'LOADING', 'COMPLETED', 'ERROR']);
  });
});
