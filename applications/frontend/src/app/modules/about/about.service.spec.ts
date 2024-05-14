import { TestBed } from '@angular/core/testing';

import { AboutService } from './about.service';
import { of } from 'rxjs';
import { TECHSTACK, TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';
import { ITechCategory } from '@modules/about/about.models';

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

  describe('convertAndSortTechStack', () => {
    it('should convert and sort tech stack correctly', () => {
      const simpTech: TECHSTACK[] = [
        {
          type: 'FEDEV',
          name: 'Angular',
          expertise_level: 70,
          last_usage_date: new Date('2023-02-05'),
          flag_important: false,
          project_count: 5,
        },
        {
          type: 'FEDEV',
          name: 'Vue',
          expertise_level: 90,
          last_usage_date: new Date('2023-02-05'),
          flag_important: false,
          project_count: 6,
        },
        {
          type: 'BEDEV',
          name: 'PHP',
          expertise_level: 85,
          last_usage_date: new Date('2024-02-05'),
          flag_important: false,
          project_count: 2,
        },
        {
          type: 'BEDEV',
          name: 'NeedsToBeNotListed',
          expertise_level: 85,
          last_usage_date: new Date('2015-02-05'),
          flag_important: false,
          project_count: 2,
        },
        {
          type: 'FEDEV',
          name: 'Bootstrap',
          expertise_level: 90,
          last_usage_date: new Date('2021-02-05'),
          flag_important: false,
          project_count: 10,
        },
      ];

      const expectedResult: ITechCategory[] = [
        {
          title: 'Frontend Development',
          data: [
            {
              label: 'Angular',
              percent: 70,
              lastTouch: '2023',
              project_count: 5,
            },
            {
              label: 'Vue',
              percent: 90,
              lastTouch: '2023',
              project_count: 6,
            },
            {
              label: 'Bootstrap',
              percent: 90,
              lastTouch: '2021',
              project_count: 10,
            },
          ],
        },
        {
          title: 'Backend Development',
          data: [
            {
              label: 'PHP',
              percent: 85,
              lastTouch: '2024',
              project_count: 2,
            },
          ],
        },
      ];

      const toTest: ITechCategory[] = service.convertAndSortTechStack(simpTech);

      expect(toTest).toEqual(expectedResult); // Make sure the result matches the expected result
    });
  });
});
