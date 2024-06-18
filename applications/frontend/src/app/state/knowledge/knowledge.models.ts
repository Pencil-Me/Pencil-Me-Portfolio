/**
 * Type definition for the title of a tech stack item.
 */
export type TECHTITLE =
  | ''
  | 'FEDEV'
  | 'BEDEV'
  | 'FEFRAME'
  | 'BEFRAME'
  | 'FEBT'
  | 'DEVOPS'
  | 'DB'
  | 'CMS'
  | 'TEST'
  | 'PROJECTTOOL'
  | 'MISC'
  | 'DESIGN'
  | 'LANG';

/**
 * Type definition for the title of a project item.
 */
export type PROJECTTITLE =
  | ''
  | 'FEDEV'
  | 'BEDEV'
  | 'FEFRAME'
  | 'BEFRAME'
  | 'FEBT'
  | 'DEVOPS'
  | 'DB'
  | 'CMS'
  | 'TEST'
  | 'PROJECTTOOL'
  | 'MISC'
  | 'DESIGN'
  | 'LANG';

/**
 * Type definition for a tech stack item.
 */
export type TECHSTACK = {
  type: TECHTITLE;
  name: string;
  expertise_level: number;
  last_usage_date?: Date;
  flag_important: boolean;
  project_count: number;
  project_dates: DATE[];
};

/**
 * Type definition for a customer item.
 */
export type CUSTOMER = {
  name: string;
  location: string;
  last_used_date: Date;
};

/**
 * Type definition for a date range.
 */
export type DATE = {
  start_date: Date;
  end_date: Date;
};

/**
 * Type definition for a tech item.
 */
export type TECH = {
  uuid: string;
  expertise_level: string;
  name: string;
  type: string;
};

/**
 * Type definition for a project item.
 */
export type PROJECT = {
  uuid: string;
  type: PROJECTTITLE;
  name: string;
  dates: DATE[];
  customers?: CUSTOMER[];
  location?: string;
  position?: string;
  content?: string;
  tech: TECH[];
};

/**
 * Type definition for the state of a single data object.
 */
export type DATASTATE<T> = {
  loadStatus: 'PENDING' | 'LOADING' | 'COMPLETED';
  error: object | string | null;
  data: T;
};

/**
 * Type definition for the state of multiple data objects.
 */
export type MULTIDATASTATE<T> = {
  loadStatus: 'PENDING' | 'LOADING' | 'COMPLETED';
  error: object | string | null;
  data: T[];
};

/**
 * Type definition for the state of a single project.
 */
export type PROJECTDATASTATE = DATASTATE<PROJECT>;

/**
 * Type definition for the state of multiple projects.
 */
export type PROJECTSDATASTATE = MULTIDATASTATE<PROJECT>;

/**
 * Type definition for the state of customer data.
 */
export type CUSTOMERSDATASTATE = MULTIDATASTATE<CUSTOMER>;

/**
 * Type definition for the state of tech stack data.
 */
export type TECHSTACKDATASTATE = MULTIDATASTATE<TECHSTACK>;

/**
 * Type definition for the overall state of knowledge-related data.
 */
export type KNOWLEDGESTATE = {
  techStack: TECHSTACKDATASTATE;
  projects: PROJECTSDATASTATE;
  selectedProject: PROJECTDATASTATE;
  customers: CUSTOMERSDATASTATE;
};
