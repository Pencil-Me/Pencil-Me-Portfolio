import { inject, Injectable } from '@angular/core';
import { map, shareReplay, type Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import type { IProject, IProjectsCategory, IProjectTech } from '@modules/projects/projects.models';
import type { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';
import type { PROJECT } from '@app/state/knowledge/knowledge.models';
import {
  selectProjectsState,
  selectProjectState,
  selectTechstackState,
} from '@app/state/knowledge/knowledge.selectors';
import { convertProject, convertProjects } from '@app/state/knowledge/mappers/project.mapper';
import { mapTechFilterList } from '@app/state/knowledge/mappers/tech-stack.mapper';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly store = inject<Store<AppState>>(Store);

  readonly projectsState$ = this.store.select(selectProjectsState);
  readonly projectState$ = this.store.select(selectProjectState);
  readonly techState$ = this.store.select(selectTechstackState);

  readonly projects$: Observable<IProjectsCategory[]> = this.projectsState$.pipe(
    map((state) => convertProjects(state.data ?? [])),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly tech$: Observable<IProjectTech[]> = this.techState$.pipe(
    map((state) => mapTechFilterList(state.data ?? [])),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly project$: Observable<IProject> = this.projectState$.pipe(
    map((state) => convertProject(state.data ?? ({} as PROJECT))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  reloadProjects(): void {
    this.store.dispatch(fromKnowledge.actions.GetProjects());
  }

  reloadTechstack(): void {
    this.store.dispatch(fromKnowledge.actions.GetTechstack());
  }

  selectProject(id: string | undefined): void {
    if (!id) {
      this.store.dispatch(fromKnowledge.actions.ResetProject());
      return;
    }
    this.store.dispatch(fromKnowledge.actions.GetProject({ id }));
  }
}
