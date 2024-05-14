import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fromKnowledge } from '@app/state/knowledge/index';
import { catchError, map, mergeMap, of, take } from 'rxjs';
import { KnowledgeService } from '@app/state/knowledge/knowledge.service';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class KnowledgeEffects {
  constructor(
    private actions$: Actions,
    private knowledgeService: KnowledgeService,
  ) {}

  /**
   * Effect to fetch techstack data.
   */
  getTechstackDataEffect$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromKnowledge.actions.GetTechstack, fromKnowledge.actions.GetProjectServiceData),
      mergeMap(() =>
        this.knowledgeService.getTechstack().pipe(
          map((res) => fromKnowledge.actions.GetTechstackSuccess({ data: res })),
          catchError((error) => of(fromKnowledge.actions.GetTechstackFailure({ error }))),
        ),
      ),
      take(1),
    );
  });

  /**
   * Effect to fetch projects data.
   */
  getProjectsDataEffect$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromKnowledge.actions.GetProjects, fromKnowledge.actions.GetProjectServiceData),
      mergeMap(() =>
        this.knowledgeService.getProjects().pipe(
          map((res) => fromKnowledge.actions.GetProjectsSuccess({ data: res })),
          catchError((error) => of(fromKnowledge.actions.GetProjectsFailure({ error }))),
        ),
      ),
      take(1),
    );
  });

  /**
   * Effect to fetch project data.
   */
  getProjectDataEffect$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromKnowledge.actions.GetProject),
      mergeMap((arg) =>
        this.knowledgeService.getProject(arg.id).pipe(
          map((res) => fromKnowledge.actions.GetProjectSuccess({ data: res })),
          catchError((error) => of(fromKnowledge.actions.GetProjectFailure({ error }))),
        ),
      ),
    );
  });

  /**
   * Effect to fetch customers data.
   */
  getCustomersDataEffect$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromKnowledge.actions.GetCustomers),
      mergeMap(() =>
        this.knowledgeService.getCustomers().pipe(
          map((res) => fromKnowledge.actions.GetCustomersSuccess({ data: res })),
          catchError((error) => of(fromKnowledge.actions.GetCustomersFailure({ error }))),
        ),
      ),
      take(1),
    );
  });
}
