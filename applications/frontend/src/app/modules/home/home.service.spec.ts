import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { AppState } from '@app/state';
import { TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';
import { fromKnowledge } from '@app/state/knowledge';
import { HomeService } from './home.service';

describe('HomeService', () => {
  let service: HomeService;
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
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch GetTechstack action', () => {
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetTechstack());
  });

  it('should subscribe to techstack store and update tech$ behavior subject', () => {
    const techData: TECHSTACKDATASTATE = { error: null, loadStatus: 'PENDING', data: [] };
    spyOn(store, 'select').and.returnValue(of(techData));

    service.storeTech$.subscribe((data) => {
      expect(data).toEqual(techData);
    });
  });

  it('should dispatch GetCustomers action', () => {
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetCustomers());
  });

  it('should subscribe to customers store and update customers$ behavior subject', () => {
    const customerData: TECHSTACKDATASTATE = { error: null, loadStatus: 'PENDING', data: [] };
    spyOn(store, 'select').and.returnValue(of(customerData));

    service.storeTech$.subscribe((data) => {
      expect(data).toEqual(customerData);
    });
  });
});
