import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '@app/state';
import { CUSTOMERSDATASTATE, TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';
import { fromKnowledge } from '@app/state/knowledge';
import { HomeService } from './home.service';
import { ITechCategories } from '@modules/home/home.models';

describe('HomeService', () => {
  let service: HomeService;
  let store: MockStore<AppState>;

  const initialState: AppState = {
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
      customers: {
        loadStatus: 'PENDING',
        error: null,
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
    spyOn(store, 'dispatch').and.callThrough();
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch GetTechstack and GetCustomers actions on initialization', () => {
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetTechstack());
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetCustomers());
  });

  it('should update tech$ with sorted and filtered tech stack data', (done) => {
    const techstackState: TECHSTACKDATASTATE = {
      data: [
        {
          name: 'FETech1',
          project_count: 5,
          last_usage_date: new Date('2022-01-01'),
          type: 'FEDEV',
          expertise_level: 80,
          flag_important: false,
          project_dates: [],
        },
        {
          name: 'FETech2',
          project_count: 4,
          last_usage_date: new Date('2023-01-01'),
          type: 'FEDEV',
          expertise_level: 85,
          flag_important: false,
          project_dates: [],
        },
        {
          name: 'BETech1',
          project_count: 10,
          last_usage_date: new Date('2021-01-01'),
          type: 'BEDEV',
          expertise_level: 80,
          flag_important: false,
          project_dates: [],
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

    service.tech$.subscribe((tech: ITechCategories[]) => {
      if (tech.length > 0) {
        expect(tech.length).toBe(2);
        expect(tech[0].title).toBe('Backend Development');
        expect(tech[0].data[0].label).toBe('BETech1');
        expect(tech[1].title).toBe('Frontend Development');
        expect(tech[1].data[0].label).toBe('FETech1');
        expect(tech[1].data[1].label).toBe('FETech2');
        done();
      }
    });
  });

  it('should update customers$ with filtered customer data', (done) => {
    const customersState: CUSTOMERSDATASTATE = {
      data: [
        { name: 'Customer1', last_used_date: new Date('2023-01-01'), location: 'TEST' },
        { name: 'Customer2', last_used_date: new Date('2015-01-01'), location: 'TEST' },
      ],
      loadStatus: 'COMPLETED',
      error: null,
    };

    // Update the store state directly
    store.setState({
      ...initialState,
      knowledge: {
        ...initialState.knowledge,
        customers: customersState,
      },
    });

    service.customers$.subscribe((customers: { url: string; alt: string }[]) => {
      if (customers.length > 0) {
        expect(customers.length).toBe(8);
        expect(customers).toContain(jasmine.objectContaining({ url: './assets/logos/arvato.png', alt: 'arvato Bertelsmann' }));
        done();
      }
    });
  });
});
