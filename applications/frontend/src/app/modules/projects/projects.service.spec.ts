import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '@app/state';
import { ProjectsService } from './projects.service';
import { TestBed } from '@angular/core/testing';
import { fromKnowledge } from '@app/state/knowledge';
import {
  CUSTOMER,
  CUSTOMERSDATASTATE,
  DATE,
  PROJECT,
  PROJECTDATASTATE,
  PROJECTSDATASTATE,
  TECH,
  TECHSTACK,
  TECHSTACKDATASTATE,
} from '@app/state/knowledge/knowledge.models';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let store: MockStore<AppState>;

  const stateBasics: {
    loadStatus: 'PENDING' | 'LOADING' | 'COMPLETED';
    error: object | string | null;
  } = {
    loadStatus: 'COMPLETED',
    error: null,
  };
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

  const mockProjectsData: PROJECTSDATASTATE = {
    ...stateBasics,
    data: [projectBasic],
  };

  const mockProjectData: PROJECTDATASTATE = {
    ...stateBasics,
    data: projectBasic,
  };

  const techstackBasic: TECHSTACK = {
    type: 'BEDEV',
    name: 'Tech 1',
    expertise_level: 80,
    flag_important: false,
    project_count: 5,
  };
  const mockTechstackData: TECHSTACKDATASTATE = {
    ...stateBasics,
    data: [
      { ...techstackBasic, name: 'Tech 1' },
      { ...techstackBasic, name: 'Tech 2' },
    ],
  };

  const mockCustomersData: CUSTOMERSDATASTATE = {
    ...stateBasics,
    data: [customerBasic],
  };

  const initialState: AppState = {
    knowledge: {
      techStack: mockTechstackData,
      projects: mockProjectsData,
      selectedProject: mockProjectData,
      customers: mockCustomersData,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }), // Provide mock store with initial state
      ],
    });
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch').and.callThrough();
    service = TestBed.inject(ProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch GetProjectServiceData action on initialization', () => {
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetProjectServiceData());
  });

  it('should update projects$ with converted project categories', (done) => {
    const projectsState: PROJECTSDATASTATE = {
      data: [
        {
          ...projectBasic,
          name: 'Project 1',
        },
        {
          ...projectBasic,
          name: 'Project 2',
        },
      ],
      loadStatus: 'COMPLETED',
      error: null,
    };

    // Update the store state directly
    store.setState({
      ...initialState,
      knowledge: {
        ...initialState.knowledge,
        projects: projectsState,
      },
    });

    service.projects$.subscribe((projects) => {
      expect(projects.length).toBe(1);
      expect(projects[0].title).toBe('FEDEV');
      done();
    });
  });

  it('should update tech$ with sorted tech data', (done) => {
    const techstackState: TECHSTACKDATASTATE = {
      data: [
        {
          name: 'FETech1',
          project_count: 5,
          last_usage_date: new Date('2022-01-01'),
          type: 'FEDEV',
          expertise_level: 80,
          flag_important: false,
        },
        {
          name: 'FETech2',
          project_count: 4,
          last_usage_date: new Date('2023-01-01'),
          type: 'FEDEV',
          expertise_level: 85,
          flag_important: false,
        },
        {
          name: 'BETech1',
          project_count: 10,
          last_usage_date: new Date('2021-01-01'),
          type: 'BEDEV',
          expertise_level: 80,
          flag_important: false,
        },
      ],
      loadStatus: 'COMPLETED',
      error: null,
    };

    // Update the store state directly
    store.setState({
      ...initialState,
      knowledge: {
        ...initialState.knowledge,
        techStack: techstackState,
      },
    });

    service.tech$.subscribe((techs) => {
      expect(techs.length).toBe(3);
      expect(techs[0].name).toBe('BETech1');
      expect(techs[1].name).toBe('FETech1');
      expect(techs[2].name).toBe('FETech2');
      done();
    });
  });

  it('should update project$ with converted project data', (done) => {
    const projectState: PROJECTDATASTATE = {
      data: {
        ...projectBasic,
        name: 'Project 1',
      },
      loadStatus: 'COMPLETED',
      error: null,
    };

    // Update the store state directly
    store.setState({
      ...initialState,
      knowledge: {
        ...initialState.knowledge,
        selectedProject: projectState,
      },
    });

    service.project$.subscribe((project) => {
      expect(project.id).toBe('1');
      expect(project.label).toBe('Project 1');
      done();
    });
  });

  it('should dispatch GetProject with project ID', () => {
    service.selectProject('1');
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetProject({ id: '1' }));
  });

  it('should dispatch ResetProject when no ID is provided', () => {
    service.selectProject(undefined);
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.ResetProject());
  });

  it('should convert projects correctly', () => {
    const projects = service.convertProjects(mockProjectsData.data);
    expect(projects.length).toBe(1);
    expect(projects[0].title).toBe('FEDEV');
    expect(projects[0].data.length).toBe(1);
    expect(projects[0].data[0].label).toBe('Project 1');
  });

  it('should convert a single project correctly', () => {
    const project = service.convertProject(mockProjectData.data as any);
    expect(project.id).toBe('1');
    expect(project.label).toBe('Project 1');
    expect(project.position).toBe('Position 1');
  });
});
