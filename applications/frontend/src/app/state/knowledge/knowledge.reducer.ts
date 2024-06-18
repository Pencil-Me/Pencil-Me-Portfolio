import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';
import * as actions from './knowledge.actions';
import { CUSTOMER, KNOWLEDGESTATE, PROJECT, TECHSTACK } from '@app/state/knowledge/knowledge.models';

/**
 * Titles for different sections of the tech stack.
 */
export const TechStackTitle = {
  FEDEV: 'Frontend Development',
  BEDEV: 'Backend Development',
  FEFRAME: 'Frontend Frameworks',
  BEFRAME: 'Backend Frameworks',
  FEBT: 'Frontend Build Tools',
  DEVOPS: 'Devops',
  DB: 'Databases',
  CMS: 'CMS',
  TEST: 'Testing Frameworks',
  PROJECTTOO: 'Project Tools',
  MISC: 'Misc',
  DESIGN: 'Design',
  LANG: 'Spoken Languages',
} as { [key: string]: string };

/**
 * Titles for different project categories.
 */
export const ProjectTitle = {
  CUST: 'Projekte als Auftragnehmer',
  PRIV: 'Direktkunden und Private Projekte',
  FEST: 'Festanstellungen',
} as { [key: string]: string };

/**
 * Initial state for the knowledge feature.
 */
export const initialState: KNOWLEDGESTATE = {
  techStack: {
    loadStatus: 'PENDING',
    error: null,
    data: [],
  },
  projects: {
    loadStatus: 'PENDING',
    error: null,
    data: [],
  },
  selectedProject: {
    loadStatus: 'PENDING',
    error: null,
    data: {} as PROJECT,
  },
  customers: {
    loadStatus: 'PENDING',
    error: null,
    data: [],
  },
};

/**
 * Reducer function for the knowledge feature.
 * Handles actions and updates the state accordingly.
 */
export const knowledgeReducers = createReducer(
  initialState,

  // Projects actions
  immerOn(actions.GetProjects, (state) => {
    state.projects.loadStatus = 'LOADING';
  }),
  immerOn(actions.GetProjectsSuccess, (state, action) => {
    state.projects.loadStatus = 'COMPLETED';
    state.projects.error = null;
    state.projects.data = action.data;
  }),
  immerOn(actions.GetProjectsFailure, (state, action) => {
    state.projects.loadStatus = 'COMPLETED';
    state.projects.error = action.error;
  }),

  // Single project actions
  immerOn(actions.GetProject, (state) => {
    state.selectedProject.loadStatus = 'LOADING';
  }),
  immerOn(actions.ResetProject, (state) => {
    state.selectedProject.loadStatus = 'PENDING';
    state.selectedProject.error = null;
    state.selectedProject.data = {} as PROJECT;
  }),
  immerOn(actions.GetProjectSuccess, (state, action) => {
    state.selectedProject.loadStatus = 'COMPLETED';
    state.selectedProject.error = null;
    state.selectedProject.data = action.data;
  }),
  immerOn(actions.GetProjectFailure, (state, action) => {
    state.selectedProject.loadStatus = 'COMPLETED';
    state.selectedProject.error = action.error;
  }),

  // Tech stack actions
  immerOn(actions.GetTechstack, (state) => {
    state.techStack.loadStatus = 'LOADING';
  }),
  immerOn(actions.GetTechstackSuccess, (state, action) => {
    state.techStack.loadStatus = 'COMPLETED';
    state.techStack.error = null;
    state.techStack.data = convertTechstackDataToType(action.data);
  }),
  immerOn(actions.GetTechstackFailure, (state, action) => {
    state.techStack.loadStatus = 'COMPLETED';
    state.techStack.error = action.error;
  }),

  // Customers actions
  immerOn(actions.GetCustomers, (state) => {
    state.customers.loadStatus = 'LOADING';
  }),
  immerOn(actions.GetCustomersSuccess, (state, action) => {
    state.customers.loadStatus = 'COMPLETED';
    state.customers.error = null;
    state.customers.data = convertCustomersDataToType(action.data);
  }),
  immerOn(actions.GetCustomersFailure, (state, action) => {
    state.customers.loadStatus = 'COMPLETED';
    state.customers.error = action.error;
  }),
);

function convertCustomersDataToType(data: CUSTOMER[]): CUSTOMER[] {
  return data.map(
    (e: CUSTOMER): CUSTOMER => ({
      name: e.name,
      location: e.location,
      last_used_date: new Date(e.last_used_date),
    }),
  );
}

function convertTechstackDataToType(data: TECHSTACK[]): TECHSTACK[] {
  return data.map(
    (e: TECHSTACK): TECHSTACK => ({
      type: e.type,
      name: e.name,
      expertise_level: e.expertise_level,
      last_usage_date: e.last_usage_date ? new Date(e.last_usage_date) : undefined,
      flag_important: e.flag_important,
      project_count: e.project_count,
      project_dates: e.project_dates,
    }),
  );
}
