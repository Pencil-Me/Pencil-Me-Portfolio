import { knowledgeReducers } from './knowledge.reducer';
import { KnowledgeEffects } from './knowledge.effects';
import {
  // Importing action creators
  GetProjects,
  GetProjectsFailure,
  GetProjectsSuccess,
  GetProjectServiceData,
  GetProject,
  ResetProject,
  GetProjectFailure,
  GetProjectSuccess,
  GetTechstack,
  GetTechstackFailure,
  GetTechstackSuccess,
  GetCustomers,
  GetCustomersSuccess,
  GetCustomersFailure,
} from './knowledge.actions';

import {
  // Importing selector functions
  selectProjectsState,
  selectProjectState,
  selectTechstackState,
  selectCustomersState,
} from './knowledge.selectors';

// Bundle of knowledge-related actions, selectors, reducers, and effects
export const fromKnowledge = {
  // Exporting action creators
  actions: {
    GetTechstack,
    GetTechstackSuccess,
    GetTechstackFailure,
    GetProjectServiceData,
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
