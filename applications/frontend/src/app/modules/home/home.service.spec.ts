import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import type { ITechCategories } from '@modules/home/home.models';
import type { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';
import type { CUSTOMERSDATASTATE, TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';

import {
  createHomeTechStackFixture,
  createMockAppState,
} from '../../../testing/knowledge.fixtures';
import { HomeService } from './home.service';

describe('HomeService', () => {
  let service: HomeService;
  let store: MockStore<AppState>;

  const initialState = createMockAppState();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    });
    store = TestBed.inject(MockStore);
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update tech$ with sorted and filtered tech stack data', (done) => {
    const techstackState: TECHSTACKDATASTATE = {
      data: createHomeTechStackFixture(),
      loadStatus: 'COMPLETED',
      error: null,
    };

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

  it('should update customers$ with logos for known API customers sorted by last usage', (done) => {
    const customersState: CUSTOMERSDATASTATE = {
      data: [
        {
          name: 'DERMALOG Identification Systems GmbH',
          last_used_date: new Date('2020-01-01'),
          location: 'Hamburg',
        },
        {
          name: 'arvato Bertelsmann',
          last_used_date: new Date('2023-01-01'),
          location: 'Gütersloh',
        },
        { name: 'OneStep GmbH', last_used_date: new Date('2024-01-01'), location: 'Berlin' },
      ],
      loadStatus: 'COMPLETED',
      error: null,
    };

    store.setState({
      ...initialState,
      knowledge: {
        ...initialState.knowledge,
        customers: customersState,
      },
    });

    service.customers$.subscribe((customers) => {
      if (customers.length > 0) {
        expect(customers.length).toBe(2);
        expect(customers[0]).toEqual(
          jasmine.objectContaining({ url: './assets/logos/arvato.png', alt: 'arvato Bertelsmann' }),
        );
        expect(customers[1]).toEqual(
          jasmine.objectContaining({ url: './assets/logos/dermalog.png', alt: 'Dermalog' }),
        );
        done();
      }
    });
  });

  it('should dispatch GetTechstack on reloadTechstack', () => {
    spyOn(store, 'dispatch');
    service.reloadTechstack();
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetTechstack());
  });

  it('should dispatch GetCustomers on reloadCustomers', () => {
    spyOn(store, 'dispatch');
    service.reloadCustomers();
    expect(store.dispatch).toHaveBeenCalledWith(fromKnowledge.actions.GetCustomers());
  });
});
