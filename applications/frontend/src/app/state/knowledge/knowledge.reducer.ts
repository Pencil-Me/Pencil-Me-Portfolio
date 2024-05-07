import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';
import * as actions from './knowledge.actions';
import { KNOWLEDGESTATE, PROJECT } from '@app/state/knowledge/knowledge.models';

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

export const ProjectTitle = {
  CUST: 'Projekte als Auftragnehmer',
  PRIV: 'Direktkunden und Private Projekte',
  FEST: 'Festanstellungen',
} as { [key: string]: string };

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

export const knowledgeReducers = createReducer(
  initialState,
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
  immerOn(actions.GetTechstack, (state) => {
    state.techStack.loadStatus = 'LOADING';
  }),
  immerOn(actions.GetTechstackSuccess, (state, action) => {
    state.techStack.loadStatus = 'COMPLETED';
    state.techStack.error = null;
    state.techStack.data = action.data;
  }),
  immerOn(actions.GetTechstackFailure, (state, action) => {
    state.techStack.loadStatus = 'COMPLETED';
    state.techStack.error = action.error;
  }),
  immerOn(actions.GetCustomers, (state) => {
    state.customers.loadStatus = 'LOADING';
  }),
  immerOn(actions.GetCustomersSuccess, (state, action) => {
    state.customers.loadStatus = 'COMPLETED';
    state.customers.error = null;
    state.customers.data = action.data;
  }),
  immerOn(actions.GetCustomersFailure, (state, action) => {
    state.customers.loadStatus = 'COMPLETED';
    state.customers.error = action.error;
  }),
);
