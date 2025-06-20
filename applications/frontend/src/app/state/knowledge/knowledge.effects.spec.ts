import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';

import { KnowledgeEffects } from './knowledge.effects';
import { KnowledgeService } from '@app/state/knowledge/knowledge.service';
import { fromKnowledge } from '@app/state/knowledge/index';
import { Action } from '@ngrx/store';
import { CUSTOMER, DATE, PROJECT, TECH, TECHSTACK } from '@app/state/knowledge/knowledge.models';

describe('KnowledgeEffects', () => {
  let actions$: Observable<Action>;
  let effects: KnowledgeEffects;
  let knowledgeService: jasmine.SpyObj<KnowledgeService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('KnowledgeService', [
      'getTechstack',
      'getProjects',
      'getProject',
      'getCustomers',
    ]);

    TestBed.configureTestingModule({
      providers: [
        KnowledgeEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: KnowledgeService, useValue: spy },
      ],
    });

    effects = TestBed.inject(KnowledgeEffects);
    knowledgeService = TestBed.inject(KnowledgeService) as jasmine.SpyObj<KnowledgeService>;
  });

  describe('getTechstackDataEffect$', () => {
    it('should return GetTechstackSuccess action with data on success', (done) => {
      const techstack: TECHSTACK[] = [
        {
          type: 'FEDEV',
          name: 'Angular',
          expertise_level: 70,
          last_usage_date: new Date('2023-02-05'),
          flag_important: false,
          project_count: 5,
          project_dates: [],
        },
      ];
      const action = fromKnowledge.actions.GetTechstack();
      const outcome = fromKnowledge.actions.GetTechstackSuccess({ data: techstack });

      actions$ = of(action);
      knowledgeService.getTechstack.and.returnValue(of(techstack));

      effects.getTechstackDataEffect$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should return GetTechstackFailure action with error on failure', (done) => {
      const error = 'Error loading techstack';
      const action = fromKnowledge.actions.GetTechstack();
      const outcome = fromKnowledge.actions.GetTechstackFailure({ error });

      actions$ = of(action);
      knowledgeService.getTechstack.and.returnValue(throwError(error));

      effects.getTechstackDataEffect$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe('getProjectsDataEffect$', () => {
    it('should return GetProjectsSuccess action with data on success', (done) => {
      const customerBasic: CUSTOMER = {
        name: 'Customer 1',
        location: 'Location 1',
        last_used_date: new Date('2021-05-01'),
      };
      const dateBasic: DATE = {
        start_date: new Date('2020-01-01'),
        end_date: new Date('2021-01-01'),
      };
      const techBasic: TECH = {
        name: 'Tech 1',
        uuid: '1',
        expertise_level: 'expertise_levelTest',
        type: 'typeTest',
      };
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
      const projects: PROJECT[] = [projectBasic];
      const action = fromKnowledge.actions.GetProjects();
      const outcome = fromKnowledge.actions.GetProjectsSuccess({ data: projects });

      actions$ = of(action);
      knowledgeService.getProjects.and.returnValue(of(projects));

      effects.getProjectsDataEffect$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should return GetProjectsFailure action with error on failure', (done) => {
      const error = 'Error loading projects';
      const action = fromKnowledge.actions.GetProjects();
      const outcome = fromKnowledge.actions.GetProjectsFailure({ error });

      actions$ = of(action);
      knowledgeService.getProjects.and.returnValue(throwError(error));

      effects.getProjectsDataEffect$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe('getProjectDataEffect$', () => {
    it('should return GetProjectSuccess action with data on success', (done) => {
      const customerBasic: CUSTOMER = {
        name: 'Customer 1',
        location: 'Location 1',
        last_used_date: new Date('2021-05-01'),
      };
      const dateBasic: DATE = {
        start_date: new Date('2020-01-01'),
        end_date: new Date('2021-01-01'),
      };
      const techBasic: TECH = {
        name: 'Tech 1',
        uuid: '1',
        expertise_level: 'expertise_levelTest',
        type: 'typeTest',
      };
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
      const project: PROJECT = { ...projectBasic };
      const action = fromKnowledge.actions.GetProject({ id: '1' });
      const outcome = fromKnowledge.actions.GetProjectSuccess({ data: project });

      actions$ = of(action);
      knowledgeService.getProject.and.returnValue(of(project));

      effects.getProjectDataEffect$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should return GetProjectFailure action with error on failure', (done) => {
      const error = 'Error loading project';
      const action = fromKnowledge.actions.GetProject({ id: '1' });
      const outcome = fromKnowledge.actions.GetProjectFailure({ error });

      actions$ = of(action);
      knowledgeService.getProject.and.returnValue(throwError(error));

      effects.getProjectDataEffect$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe('getCustomersDataEffect$', () => {
    it('should return GetCustomersSuccess action with data on success', (done) => {
      const customerBasic: CUSTOMER = {
        name: 'Customer 1',
        location: 'Location 1',
        last_used_date: new Date('2021-05-01'),
      };
      const customers: CUSTOMER[] = [customerBasic];
      const action = fromKnowledge.actions.GetCustomers();
      const outcome = fromKnowledge.actions.GetCustomersSuccess({ data: customers });

      actions$ = of(action);
      knowledgeService.getCustomers.and.returnValue(of(customers));

      effects.getCustomersDataEffect$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it('should return GetCustomersFailure action with error on failure', (done) => {
      const error = 'Error loading customers';
      const action = fromKnowledge.actions.GetCustomers();
      const outcome = fromKnowledge.actions.GetCustomersFailure({ error });

      actions$ = of(action);
      knowledgeService.getCustomers.and.returnValue(throwError(error));

      effects.getCustomersDataEffect$.subscribe((result) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });
});
