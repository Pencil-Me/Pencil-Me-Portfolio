import { inject, Injectable } from '@angular/core';
import { map, shareReplay, type Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import type { ITechCategories } from '@modules/home/home.models';
import { isLoadSuccessful } from '@app/shared/models/load-status.model';
import type { AppState } from '@app/state';
import { fromKnowledge } from '@app/state/knowledge';
import type { CUSTOMERSDATASTATE } from '@app/state/knowledge/knowledge.models';
import {
  selectCustomersState,
  selectTechstackState,
} from '@app/state/knowledge/knowledge.selectors';
import {
  mapCustomersToLogos,
  type CustomerLogo,
} from '@app/state/knowledge/mappers/customer-logos.mapper';
import { mapTechStackForHome } from '@app/state/knowledge/mappers/tech-stack.mapper';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly store = inject<Store<AppState>>(Store);

  readonly techState$ = this.store.select(selectTechstackState);
  readonly customersState$ = this.store.select(selectCustomersState);

  readonly tech$: Observable<ITechCategories[]> = this.techState$.pipe(
    map((state) => mapTechStackForHome(state.data ?? [])),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly customers$: Observable<CustomerLogo[]> = this.customersState$.pipe(
    map((state) => this.resolveCustomerLogos(state)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  reloadTechstack(): void {
    this.store.dispatch(fromKnowledge.actions.GetTechstack());
  }

  reloadCustomers(): void {
    this.store.dispatch(fromKnowledge.actions.GetCustomers());
  }

  private resolveCustomerLogos(state: CUSTOMERSDATASTATE): CustomerLogo[] {
    if (!isLoadSuccessful(state.loadStatus)) {
      return [];
    }

    return mapCustomersToLogos(state.data ?? []);
  }
}
