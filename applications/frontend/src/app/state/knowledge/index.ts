import {
  GetCustomers,
  GetCustomersFailure,
  GetCustomersSuccess,
  GetProject,
  GetProjectFailure,
  // Importing action creators
  GetProjects,
  GetProjectsFailure,
  GetProjectsSuccess,
  GetProjectSuccess,
  GetTechstack,
  GetTechstackFailure,
  GetTechstackSuccess,
  ResetProject,
} from './knowledge.actions';
import { KnowledgeEffects } from './knowledge.effects';
import { knowledgeReducers } from './knowledge.reducer';
import {
  selectCustomersState,
  // Importing selector functions
  selectProjectsState,
  selectProjectState,
  selectTechstackState,
} from './knowledge.selectors';

// Bundle of knowledge-related actions, selectors, reducers, and effects
export const fromKnowledge = {
  // Exporting action creators
  actions: {
    GetTechstack,
    GetTechstackSuccess,
    GetTechstackFailure,
    GetProjects,
    GetProjectsSuccess,
    GetProjectsFailure,
    GetProject,
    ResetProject,
    GetProjectFailure,
    GetProjectSuccess,
    GetCustomers,
    GetCustomersSuccess,
    GetCustomersFailure,
  },

  // Exporting selector functions
  selectors: {
    selectProjectsState,
    selectProjectState,
    selectTechstackState,
    selectCustomersState,
  },

  // Exporting knowledge reducers
  reducers: knowledgeReducers,

  // Exporting knowledge effects
  KnowledgeEffects,
};
