import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, shareReplay } from 'rxjs';
import type { Observable } from 'rxjs';
import type { AppState } from '@app/state';
import type { ITechCategories } from '@modules/home/home.models';
import { fromKnowledge } from '@app/state/knowledge';
import { selectCustomersState, selectTechstackState } from '@app/state/knowledge/knowledge.selectors';
import type { CUSTOMERSDATASTATE } from '@app/state/knowledge/knowledge.models';
import { isLoadSuccessful } from '@app/shared/models/load-status.model';
import { mapTechStackForHome } from '@app/state/knowledge/mappers/tech-stack.mapper';
import {
  mapCustomersToLogos,
  type CustomerLogo,
} from '@app/state/knowledge/mappers/customer-logos.mapper';

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
