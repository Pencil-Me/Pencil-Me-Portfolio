import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import {
  GetCustomers,
  GetCustomersFailure,
  GetCustomersSuccess,
  GetProject,
  GetProjectFailure,
  GetProjectSuccess,
  GetProjects,
  GetProjectsFailure,
  GetProjectsSuccess,
  GetTechstack,
  GetTechstackFailure,
  GetTechstackSuccess,
} from './knowledge.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { KnowledgeService } from '@app/state/knowledge/knowledge.service';
import { mapApiError } from '@app/shared/utils/api-error.util';
import type { Observable } from 'rxjs';
import type { Action } from '@ngrx/store';

@Injectable()
export class KnowledgeEffects {
  private actions$ = inject(Actions);
  private knowledgeService = inject(KnowledgeService);

  /**
   * Effect to fetch techstack data.
   */
  getTechstackDataEffect$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(GetTechstack),
      mergeMap(() =>
        this.knowledgeService.getTechstack().pipe(
          map((res) => GetTechstackSuccess({ data: res })),
          catchError((error) => of(GetTechstackFailure({ error: mapApiError(error) }))),
        ),
      ),
    );
  });

  /**
   * Effect to fetch projects data.
   */
  getProjectsDataEffect$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(GetProjects),
      mergeMap(() =>
        this.knowledgeService.getProjects().pipe(
          map((res) => GetProjectsSuccess({ data: res })),
          catchError((error) => of(GetProjectsFailure({ error: mapApiError(error) }))),
        ),
      ),
    );
  });

  /**
   * Effect to fetch project data.
   */
  getProjectDataEffect$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(GetProject),
      mergeMap((arg) =>
        this.knowledgeService.getProject(arg.id).pipe(
          map((res) => GetProjectSuccess({ data: res })),
          catchError((error) => of(GetProjectFailure({ error: mapApiError(error) }))),
        ),
      ),
    );
  });

  /**
   * Effect to fetch customers data.
   */
  getCustomersDataEffect$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(GetCustomers),
      mergeMap(() =>
        this.knowledgeService.getCustomers().pipe(
          map((res) => GetCustomersSuccess({ data: res })),
          catchError((error) => of(GetCustomersFailure({ error: mapApiError(error) }))),
        ),
      ),
    );
  });
}
