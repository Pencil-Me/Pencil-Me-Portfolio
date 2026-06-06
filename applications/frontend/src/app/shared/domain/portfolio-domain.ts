/**
 * Synchron zu applications/shared/domain/portfolio-domain.json halten.
 */
export const PROJECT_TYPES = ['CUST', 'PRIV', 'FEST'] as const;
export const TECH_STACK_TYPES = [
  'FEDEV',
  'BEDEV',
  'FEFRAME',
  'BEFRAME',
  'FEBT',
  'DEVOPS',
  'DB',
  'CMS',
  'TEST',
  'PROJECTTOOL',
  'MISC',
  'DESIGN',
  'LANG',
] as const;
export const LOAD_STATUSES = ['PENDING', 'LOADING', 'COMPLETED', 'ERROR'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type TechStackType = (typeof TECH_STACK_TYPES)[number];
export type DomainLoadStatus = (typeof LOAD_STATUSES)[number];

export type TECHTITLE = '' | TechStackType;
export type PROJECTTITLE = '' | ProjectType;
