import { TestBed } from '@angular/core/testing';

import { AboutService } from './about.service';
import { of } from 'rxjs';
import { TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';

describe('AboutService', () => {
  let service: AboutService;
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
    service = TestBed.inject(AboutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch GetTechstack action on creation', () => {
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetTechstack());
  });

  it('should subscribe to techstack store and update tech$ behavior subject', () => {
    const techData: TECHSTACKDATASTATE = { error: null, loadStatus: 'PENDING', data: [] };
    spyOn(store, 'select').and.returnValue(of(techData));

    service.store$.subscribe((data) => {
      expect(data).toEqual(techData);
    });
  });
});
