import { createAction, props } from '@ngrx/store';
import { CUSTOMER, PROJECT, TECHSTACK } from '@app/state/knowledge/knowledge.models';

export enum KnowledgeActionTypes {
  // Actions for fetching techstack data
  API_GET_TECHSTACK = '[Core] GET Techstack Data',
  API_GET_TECHSTACK_SUCCESS = '[Core] GET Techstack Data Success',
  API_GET_TECHSTACK_FAILURE = '[Core] GET Techstack Data Failure',

  // Actions for fetching projects data
  API_GET_PROJECTS = '[Core] GET Projects Data',
  API_GET_PROJECTS_SUCCESS = '[Core] GET Projects Data Success',
  API_GET_PROJECTS_FAILURE = '[Core] GET Projects Data Failure',

  // Action for triggering project service data retrieval
  API_GET_PROJECT_SERVICE_DATA = '[Core] GET ProjectService Data',

  // Actions for fetching project data
  API_GET_PROJECT = '[Core] GET Project Data',
  API_RESET_PROJECT = '[Core] RESET Project Data',
  API_GET_PROJECT_SUCCESS = '[Core] GET Project Data Success',
  API_GET_PROJECT_FAILURE = '[Core] GET Project Data Failure',

  // Actions for fetching customers data
  API_GET_CUSTOMERS = '[Core] GET Customers Data',
  API_GET_CUSTOMERS_SUCCESS = '[Core] GET Customers Data Success',
  API_GET_CUSTOMERS_FAILURE = '[Core] GET Customers Data Failure',
}

// Action creators with props

// Techstack actions
export const GetTechstack = createAction(KnowledgeActionTypes.API_GET_TECHSTACK);
export const GetTechstackSuccess = createAction(
  KnowledgeActionTypes.API_GET_TECHSTACK_SUCCESS,
  props<{ data: TECHSTACK[] }>(),
);
export const GetTechstackFailure = createAction(
  KnowledgeActionTypes.API_GET_TECHSTACK_FAILURE,
  props<{ error: string }>(),
);

// Projects actions
export const GetProjectServiceData = createAction(
  KnowledgeActionTypes.API_GET_PROJECT_SERVICE_DATA,
);
export const GetProjects = createAction(KnowledgeActionTypes.API_GET_PROJECTS);
export const GetProjectsSuccess = createAction(
  KnowledgeActionTypes.API_GET_PROJECTS_SUCCESS,
  props<{ data: PROJECT[] }>(),
);
export const GetProjectsFailure = createAction(
  KnowledgeActionTypes.API_GET_PROJECTS_FAILURE,
  props<{ error: string }>(),
);

// Project actions
export const GetProject = createAction(
  KnowledgeActionTypes.API_GET_PROJECT,
  props<{ id: string }>(),
);
export const ResetProject = createAction(KnowledgeActionTypes.API_RESET_PROJECT);
export const GetProjectSuccess = createAction(
  KnowledgeActionTypes.API_GET_PROJECT_SUCCESS,
  props<{ data: PROJECT }>(),
);
export const GetProjectFailure = createAction(
  KnowledgeActionTypes.API_GET_PROJECT_FAILURE,
  props<{ error: string }>(),
);

// Customers actions
export const GetCustomers = createAction(KnowledgeActionTypes.API_GET_CUSTOMERS);
export const GetCustomersSuccess = createAction(
  KnowledgeActionTypes.API_GET_CUSTOMERS_SUCCESS,
  props<{ data: CUSTOMER[] }>(),
);
export const GetCustomersFailure = createAction(
  KnowledgeActionTypes.API_GET_CUSTOMERS_FAILURE,
  props<{ error: string }>(),
);
