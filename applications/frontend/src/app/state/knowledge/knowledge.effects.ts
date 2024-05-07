import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fromKnowledge } from '@app/state/knowledge/index';
import { catchError, map, mergeMap, of, take } from 'rxjs';
import { KnowledgeService } from '@app/state/knowledge/knowledge.service';

@Injectable()
export class KnowledgeEffects {
  constructor(
    private actions$: Actions,
    private knowledgeService: KnowledgeService,
  ) {}

  getTechstackDataEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromKnowledge.actions.GetTechstack, fromKnowledge.actions.GetProjectServiceData),
      mergeMap(() => {
        return this.knowledgeService.getTechstack().pipe(
          map((res) => {
            return fromKnowledge.actions.GetTechstackSuccess({
              data: res,
            });
          }),
          catchError((error) => of(fromKnowledge.actions.GetTechstackFailure({ error: error }))),
        );
      }),
      take(1),
    );
  });

  getProjectsDataEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromKnowledge.actions.GetProjects, fromKnowledge.actions.GetProjectServiceData),
      mergeMap(() => {
        return this.knowledgeService.getProjects().pipe(
          map((res) => {
            return fromKnowledge.actions.GetProjectsSuccess({
              data: res,
            });
          }),
          catchError((error) => of(fromKnowledge.actions.GetProjectsFailure({ error: error }))),
        );
      }),
      take(1),
    );
  });

  getProjectDataEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromKnowledge.actions.GetProject),
      mergeMap((arg) => {
        return this.knowledgeService.getProject(arg.id).pipe(
          map((res) => {
            return fromKnowledge.actions.GetProjectSuccess({
              data: res,
            });
          }),
          catchError((error) => of(fromKnowledge.actions.GetProjectFailure({ error: error }))),
        );
      }),
    );
  });

  getCustomersDataEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromKnowledge.actions.GetCustomers),
      mergeMap(() => {
        return this.knowledgeService.getCustomers().pipe(
          map((res) => {
            return fromKnowledge.actions.GetCustomersSuccess({
              data: res,
            });
          }),
          catchError((error) => of(fromKnowledge.actions.GetCustomersFailure({ error: error }))),
        );
      }),
      take(1),
    );
  });
}
