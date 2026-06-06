import { Injectable, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import type { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import type { AppState } from '@app/state';
import type { ITechCategory } from '@modules/about/about.models';
import { selectTechstackState } from '@app/state/knowledge/knowledge.selectors';
import { mapTechStackForAbout } from '@app/state/knowledge/mappers/tech-stack.mapper';
import { fromKnowledge } from '@app/state/knowledge';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private readonly store = inject<Store<AppState>>(Store);

  readonly techState$ = this.store.select(selectTechstackState);

  readonly tech$: Observable<ITechCategory[]> = this.techState$.pipe(
    map((state) => mapTechStackForAbout(state.data ?? [])),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  reloadTechstack(): void {
    this.store.dispatch(fromKnowledge.actions.GetTechstack());
  }
}
