import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '@app/state';
import { ProjectsService } from '@modules/projects/projects.service';
import { TestBed } from '@angular/core/testing';
import { fromKnowledge } from '@app/state/knowledge';
import { PROJECT, PROJECTDATASTATE, PROJECTSDATASTATE, TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';
import { of } from 'rxjs';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let store: MockStore<AppState>;

  const initialState = {
    // Initialize the necessary properties in the store state
    knowledge: {
      techStack: {
        error: null,
        loadStatus: 'PENDING',
        data: [],
      },
      projects: {
        error: null,
        loadStatus: 'PENDING',
        data: [],
      },
      customers: {
        error: null,
        loadStatus: 'PENDING',
        data: [],
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }), // Provide mock store with initial state
      ],
    });
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    service = TestBed.inject(ProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch GetProjectServiceData action', () => {
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetProjectServiceData());
  });

  it('should subscribe to techstack store and update projects$ behavior subject', () => {
    const projectsData: PROJECTSDATASTATE = { error: null, loadStatus: 'PENDING', data: [] };
    spyOn(store, 'select').and.returnValue(of(projectsData));

    service.storeProjects$.subscribe((data) => {
      expect(data).toEqual(projectsData);
    });
  });

  it('should subscribe to techstack store and update project$ behavior subject', () => {
    const projectData: PROJECTDATASTATE = { error: null, loadStatus: 'PENDING', data: {} as PROJECT };
    spyOn(store, 'select').and.returnValue(of(projectData));

    service.storeProject$.subscribe((data) => {
      expect(data).toEqual(projectData);
    });
  });

  it('should subscribe to techstack store and update tech$ behavior subject', () => {
    const techData: TECHSTACKDATASTATE = { error: null, loadStatus: 'PENDING', data: [] };
    spyOn(store, 'select').and.returnValue(of(techData));

    service.storeTech$.subscribe((data) => {
      expect(data).toEqual(techData);
    });
  });
});
