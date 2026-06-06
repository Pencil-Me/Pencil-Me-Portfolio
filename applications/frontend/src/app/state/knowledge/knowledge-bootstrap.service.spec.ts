import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import type { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';
import { KnowledgeBootstrapService } from './knowledge-bootstrap.service';

describe('KnowledgeBootstrapService', () => {
  let service: KnowledgeBootstrapService;
  let store: MockStore<AppState>;

  const initialState: AppState = {
    knowledge: {
      techStack: { loadStatus: 'PENDING', error: null, data: [] },
      projects: { loadStatus: 'PENDING', error: null, data: [] },
      selectedProject: {
        loadStatus: 'PENDING',
        error: null,
        data: {
          uuid: '',
          type: '',
          name: '',
          dates: [],
          customers: undefined,
          location: undefined,
          position: undefined,
          content: undefined,
          tech: [],
        },
      },
      customers: { loadStatus: 'PENDING', error: null, data: [] },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    });
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    service = TestBed.inject(KnowledgeBootstrapService);
  });

  it('should dispatch critical home data after paint and only bootstrap once', fakeAsync(() => {
    service.ensureLoaded();
    service.ensureLoaded();

    tick(16);
    tick(16);

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetTechstack());
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetCustomers());
  }));
});
