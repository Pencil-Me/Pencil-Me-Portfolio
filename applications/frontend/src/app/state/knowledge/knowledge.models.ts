import type { CUSTOMER, PROJECT, TECHSTACK } from '@core/models/portfolio-api.models';
import type { LoadStatus } from '@app/shared/models/load-status.model';

export type { CUSTOMER, DATE, PROJECT, TECH, TECHSTACK } from '@core/models/portfolio-api.models';

/**
 * Type definition for the state of a single data object.
 */
export type DATASTATE<T> = {
  loadStatus: LoadStatus;
  error: string | null;
  data: T;
};

/**
 * Type definition for the state of multiple data objects.
 */
export type MULTIDATASTATE<T> = {
  loadStatus: LoadStatus;
  error: string | null;
  data: T[];
};

export type PROJECTDATASTATE = DATASTATE<PROJECT>;
export type PROJECTSDATASTATE = MULTIDATASTATE<PROJECT>;
export type CUSTOMERSDATASTATE = MULTIDATASTATE<CUSTOMER>;
export type TECHSTACKDATASTATE = MULTIDATASTATE<TECHSTACK>;

export type KNOWLEDGESTATE = {
  techStack: TECHSTACKDATASTATE;
  projects: PROJECTSDATASTATE;
  selectedProject: PROJECTDATASTATE;
  customers: CUSTOMERSDATASTATE;
};
