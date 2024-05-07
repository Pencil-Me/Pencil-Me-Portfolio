import { knowledgeReducers } from './knowledge.reducer';
import { KnowledgeEffects } from './knowledge.effects';
import {
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
import { selectProjectsState, selectProjectState, selectTechstackState, selectCustomersState } from './knowledge.selectors';

export const fromKnowledge = {
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
  selectors: {
    selectProjectsState,
    selectProjectState,
    selectTechstackState,
    selectCustomersState,
  },
  reducers: knowledgeReducers,
  KnowledgeEffects,
};
