import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import type { ITechCategory } from '@modules/about/about.models';
import type { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';
import type { TECHSTACK } from '@app/state/knowledge/knowledge.models';
import { mapTechStackForAbout } from '@app/state/knowledge/mappers/tech-stack.mapper';

import { AboutService } from './about.service';

describe('AboutService', () => {
  let service: AboutService;
  let store: MockStore;

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
        error: null,
        loadStatus: 'PENDING',
        data: [],
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    });
    TestBed.inject(MockStore);
    store = TestBed.inject(MockStore);
    service = TestBed.inject(AboutService);
  });

  it('should expose mapped tech from store state', (done) => {
    const techStack: TECHSTACK[] = [
      {
        type: 'FEDEV',
        name: 'Angular',
        expertise_level: 80,
        last_usage_date: new Date('2024-02-05'),
        flag_important: false,
        project_count: 4,
        project_dates: [],
      },
    ];
    store.setState({
      ...initialState,
      knowledge: {
        ...initialState.knowledge,
        techStack: {
          error: null,
          loadStatus: 'COMPLETED',
          data: techStack,
        },
      },
    });

    service.tech$.subscribe((result) => {
      expect(result).toEqual(mapTechStackForAbout(techStack));
      done();
    });
  });

  it('should dispatch reload action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    service.reloadTechstack();

    expect(dispatchSpy).toHaveBeenCalledWith(fromKnowledge.actions.GetTechstack());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapTechStackForAbout', () => {
    it('should convert and sort tech stack correctly', () => {
      const simpTech: TECHSTACK[] = [
        {
          type: 'FEDEV',
          name: 'Angular',
          expertise_level: 70,
          last_usage_date: new Date('2023-02-05'),
          flag_important: false,
          project_count: 5,
          project_dates: [],
        },
        {
          type: 'FEDEV',
          name: 'Vue',
          expertise_level: 90,
          last_usage_date: new Date('2023-02-05'),
          flag_important: false,
          project_count: 6,
          project_dates: [],
        },
        {
          type: 'BEDEV',
          name: 'PHP',
          expertise_level: 85,
          last_usage_date: new Date('2024-02-05'),
          flag_important: false,
          project_count: 2,
          project_dates: [],
        },
        {
          type: 'BEDEV',
          name: 'NeedsToBeNotListed',
          expertise_level: 85,
          last_usage_date: new Date('2015-02-05'),
          flag_important: false,
          project_count: 2,
          project_dates: [],
        },
        {
          type: 'FEDEV',
          name: 'Bootstrap',
          expertise_level: 90,
          last_usage_date: new Date('2021-02-05'),
          flag_important: false,
          project_count: 10,
          project_dates: [],
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
              project_years: 0,
            },
            {
              label: 'Vue',
              percent: 90,
              lastTouch: '2023',
              project_count: 6,
              project_years: 0,
            },
            {
              label: 'Bootstrap',
              percent: 90,
              lastTouch: '2021',
              project_count: 10,
              project_years: 0,
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
              project_years: 0,
            },
          ],
        },
      ];

      const toTest: ITechCategory[] = mapTechStackForAbout(simpTech);

      expect(toTest).toEqual(expectedResult);
    });
  });
});
