import { inject, Injectable } from '@angular/core';
import { map, shareReplay, type Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import type { ITechCategory } from '@modules/about/about.models';
import type { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';
import { selectTechstackState } from '@app/state/knowledge/knowledge.selectors';
import { mapTechStackForAbout } from '@app/state/knowledge/mappers/tech-stack.mapper';

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
