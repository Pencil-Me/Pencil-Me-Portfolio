import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import type { LoadStatus } from '@app/shared/models/load-status.model';
import type { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';
import type {
  CUSTOMERSDATASTATE,
  PROJECTDATASTATE,
  PROJECTSDATASTATE,
  TECHSTACK,
  TECHSTACKDATASTATE,
} from '@app/state/knowledge/knowledge.models';
import { convertProject, convertProjects } from '@app/state/knowledge/mappers/project.mapper';

import {
  createHomeTechStackFixture,
  createSampleCustomer,
  createSampleProject,
} from '../../../testing/knowledge.fixtures';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let store: MockStore<AppState>;

  const stateBasics: {
    loadStatus: LoadStatus;
    error: string | null;
  } = {
    loadStatus: 'COMPLETED',
    error: null,
  };
  const projectBasic = createSampleProject();

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
    project_dates: [],
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
    data: [createSampleCustomer()],
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
      expect(projects[0].title).toBe('Projekte als Auftragnehmer');
      done();
    });
  });

  it('should update tech$ with sorted tech data', (done) => {
    const techstackState: TECHSTACKDATASTATE = {
      data: createHomeTechStackFixture(),
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
    const projects = convertProjects(mockProjectsData.data);
    expect(projects.length).toBe(1);
    expect(projects[0].title).toBe('Projekte als Auftragnehmer');
    expect(projects[0].data.length).toBe(1);
    expect(projects[0].data[0].label).toBe('Project 1');
  });

  it('should convert a single project correctly', () => {
    const project = convertProject(mockProjectData.data);
    expect(project.id).toBe('1');
    expect(project.label).toBe('Project 1');
    expect(project.position).toBe('Position 1');
  });

  it('should dispatch GetProjects on reloadProjects', () => {
    service.reloadProjects();
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetProjects());
  });

  it('should dispatch GetTechstack on reloadTechstack', () => {
    service.reloadTechstack();
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetTechstack());
  });
});
