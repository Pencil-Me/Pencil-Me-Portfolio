import { knowledgeReducers, initialState } from './knowledge.reducer';
import * as actions from './knowledge.actions';
import { CUSTOMER, DATE, KNOWLEDGESTATE, PROJECT, TECH, TECHSTACK } from '@app/state/knowledge/knowledge.models';

describe('Knowledge Reducer', () => {
  let state: KNOWLEDGESTATE;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('GetProjects', () => {
    it('should handle GetProjects action', () => {
      const action = actions.GetProjects();
      const nextState = knowledgeReducers(state, action);

      expect(nextState.projects.loadStatus).toEqual('LOADING');
    });

    it('should handle GetProjectsSuccess action', () => {
      const customerBasic: CUSTOMER = { name: 'Customer 1', location: 'Location 1', last_used_date: new Date('2021-05-01') };
      const dateBasic: DATE = { start_date: new Date('2020-01-01'), end_date: new Date('2021-01-01') };
      const techBasic: TECH = { name: 'Tech 1', uuid: '1', expertise_level: 'expertise_levelTest', type: 'typeTest' };
      const projectBasic: PROJECT = {
        uuid: '1',
        name: 'Project 1',
        position: 'Position 1',
        content: 'Content 1',
        customers: [customerBasic],
        dates: [dateBasic],
        tech: [techBasic],
        type: 'FEDEV',
      };
      const projects: PROJECT[] = [{ ...projectBasic }];
      const action = actions.GetProjectsSuccess({ data: projects });
      const nextState = knowledgeReducers(state, action);

      expect(nextState.projects.loadStatus).toEqual('COMPLETED');
      expect(nextState.projects.error).toBeNull();
      expect(nextState.projects.data).toEqual(projects);
    });

    it('should handle GetProjectsFailure action', () => {
      const error = 'Error loading projects';
      const action = actions.GetProjectsFailure({ error });
      const nextState = knowledgeReducers(state, action);

      expect(nextState.projects.loadStatus).toEqual('COMPLETED');
      expect(nextState.projects.error).toEqual(error);
    });
  });

  describe('GetProject', () => {
    it('should handle GetProject action', () => {
      const action = actions.GetProject({ id: 'test_id' });
      const nextState = knowledgeReducers(state, action);

      expect(nextState.selectedProject.loadStatus).toEqual('LOADING');
    });

    it('should handle ResetProject action', () => {
      const action = actions.ResetProject();
      const nextState = knowledgeReducers(state, action);

      expect(nextState.selectedProject.loadStatus).toEqual('PENDING');
      expect(nextState.selectedProject.error).toEqual(null);
      expect(nextState.selectedProject.data).toEqual({} as PROJECT);
    });

    it('should handle GetProjectSuccess action', () => {
      const customerBasic: CUSTOMER = { name: 'Customer 1', location: 'Location 1', last_used_date: new Date('2021-05-01') };
      const dateBasic: DATE = { start_date: new Date('2020-01-01'), end_date: new Date('2021-01-01') };
      const techBasic: TECH = { name: 'Tech 1', uuid: '1', expertise_level: 'expertise_levelTest', type: 'typeTest' };
      const projectBasic: PROJECT = {
        uuid: '1',
        name: 'Project 1',
        position: 'Position 1',
        content: 'Content 1',
        customers: [customerBasic],
        dates: [dateBasic],
        tech: [techBasic],
        type: 'FEDEV',
      };
      const project: PROJECT = { ...projectBasic };
      const action = actions.GetProjectSuccess({ data: project });
      const nextState = knowledgeReducers(state, action);

      expect(nextState.selectedProject.loadStatus).toEqual('COMPLETED');
      expect(nextState.selectedProject.error).toBeNull();
      expect(nextState.selectedProject.data).toEqual(project);
    });

    it('should handle GetProjectFailure action', () => {
      const error = 'Error loading projects';
      const action = actions.GetProjectFailure({ error });
      const nextState = knowledgeReducers(state, action);

      expect(nextState.selectedProject.loadStatus).toEqual('COMPLETED');
      expect(nextState.selectedProject.error).toEqual(error);
    });
  });

  describe('GetTechstack', () => {
    it('should handle GetTechstack action', () => {
      const action = actions.GetTechstack();
      const nextState = knowledgeReducers(state, action);

      expect(nextState.techStack.loadStatus).toEqual('LOADING');
    });

    it('should handle GetTechstackSuccess action', () => {
      const techstackBasic: TECHSTACK = {
        type: 'FEDEV',
        name: 'Angular',
        expertise_level: 70,
        last_usage_date: new Date('2023-02-05'),
        flag_important: false,
        project_count: 5,
        project_dates: [],
      };
      const techstack: TECHSTACK[] = [{ ...techstackBasic }];
      const action = actions.GetTechstackSuccess({ data: techstack });
      const nextState = knowledgeReducers(state, action);

      expect(nextState.techStack.loadStatus).toEqual('COMPLETED');
      expect(nextState.techStack.error).toBeNull();
      expect(nextState.techStack.data).toEqual(techstack);
    });

    it('should handle GetTechstackFailure action', () => {
      const error = 'Error loading projects';
      const action = actions.GetTechstackFailure({ error });
      const nextState = knowledgeReducers(state, action);

      expect(nextState.techStack.loadStatus).toEqual('COMPLETED');
      expect(nextState.techStack.error).toEqual(error);
    });
  });

  describe('GetCustomers', () => {
    it('should handle GetCustomers action', () => {
      const action = actions.GetCustomers();
      const nextState = knowledgeReducers(state, action);

      expect(nextState.customers.loadStatus).toEqual('LOADING');
    });

    it('should handle GetCustomersSuccess action', () => {
      const customersBasic: CUSTOMER = { name: 'Customer 1', location: 'Location 1', last_used_date: new Date('2021-05-01') };
      const customers: CUSTOMER[] = [{ ...customersBasic }];
      const action = actions.GetCustomersSuccess({ data: customers });
      const nextState = knowledgeReducers(state, action);

      expect(nextState.customers.loadStatus).toEqual('COMPLETED');
      expect(nextState.customers.error).toBeNull();
      expect(nextState.customers.data).toEqual(customers);
    });

    it('should handle GetCustomersFailure action', () => {
      const error = 'Error loading projects';
      const action = actions.GetCustomersFailure({ error });
      const nextState = knowledgeReducers(state, action);

      expect(nextState.customers.loadStatus).toEqual('COMPLETED');
      expect(nextState.customers.error).toEqual(error);
    });
  });
});
