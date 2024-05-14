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

export type TECHSTACK = {
  type: TECHTITLE;
  name: string;
  expertise_level: number;
  last_usage_date?: Date;
  flag_important: boolean;
  project_count: number;
};
export type CUSTOMER = {
  name: string;
  location: string;
  last_used_date: Date;
};
export type DATE = {
  start_date: Date;
  end_date: Date;
};
export type TECH = {
  uuid: string;
  expertise_level: string;
  name: string;
  type: string;
};
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
export type PROJECTDATASTATE = {
  loadStatus: 'PENDING' | 'LOADING' | 'COMPLETED';
  error: object | string | null;
  data: PROJECT;
};
export type PROJECTSDATASTATE = {
  loadStatus: 'PENDING' | 'LOADING' | 'COMPLETED';
  error: object | string | null;
  data: PROJECT[];
};
export type CUSTOMERSDATASTATE = {
  loadStatus: 'PENDING' | 'LOADING' | 'COMPLETED';
  error: object | string | null;
  data: CUSTOMER[];
};
export type TECHSTACKDATASTATE = {
  loadStatus: 'PENDING' | 'LOADING' | 'COMPLETED';
  error: object | string | null;
  data: TECHSTACK[];
};
export type KNOWLEDGESTATE = {
  techStack: TECHSTACKDATASTATE;
  projects: PROJECTSDATASTATE;
  selectedProject: PROJECTDATASTATE;
  customers: CUSTOMERSDATASTATE;
};
