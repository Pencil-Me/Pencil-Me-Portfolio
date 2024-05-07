import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromKnowledge } from '@app/state/knowledge';
import { AppState } from '@app/state';
import { ISimpTech, ITechCategories } from '@modules/home/home.models';
import { selectCustomersState, selectTechstackState } from '@app/state/knowledge/knowledge.selectors';
import { CUSTOMER, CUSTOMERSDATASTATE, TECHSTACK, TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';
import { TechStackTitle } from '@app/state/knowledge/knowledge.reducer';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  storeTech$: Observable<TECHSTACKDATASTATE> = this.store.select(selectTechstackState);
  storeCustomers$: Observable<CUSTOMERSDATASTATE> = this.store.select(selectCustomersState);

  private _tech$ = new BehaviorSubject<ITechCategories[]>([]);
  readonly tech$ = this._tech$ as Observable<ITechCategories[]>;
  readonly _customers$ = new BehaviorSubject<string[]>([]);
  readonly customers$ = this._customers$ as Observable<string[]>;

  constructor(private readonly store: Store<AppState>) {
    this.store.dispatch(fromKnowledge.actions.GetTechstack());
    this.storeTech$.subscribe((e) => {
      const tech: ITechCategories[] = [];
      const givenTech = [...e.data];

      givenTech.sort((a, b) => {
        if (Number(a.project_count) > Number(b.project_count)) return -1;
        if (Number(a.project_count) < Number(b.project_count)) return 1;

        return 0;
      });

      givenTech.forEach((item: TECHSTACK) => {
        if (item.project_count <= 0) return;
        const givenDate = item.last_usage_date ? new Date(item.last_usage_date) : new Date();
        if (new Date().getFullYear() - 3 > givenDate.getFullYear()) return;

        const objectDataToPush: ISimpTech = {
          label: item.name,
          lastTouch: givenDate.getFullYear().toString(),
          numberOfProjects: item.project_count?.toString() ?? 1,
        };
        const itemTitle = TechStackTitle[item.type] ?? item.type;
        const obj = tech.find((x) => x.title === itemTitle);
        const index = obj ? tech.indexOf(obj) : -1;

        if (index !== -1) {
          tech[index].data.push(objectDataToPush);
        } else {
          tech.push({
            title: itemTitle,
            data: [objectDataToPush],
          });
        }
      });

      this._tech$.next(tech);
    });

    this.store.dispatch(fromKnowledge.actions.GetCustomers());
    this.storeCustomers$.subscribe((e) => {
      if (!e.data) return;
      const customersData: CUSTOMER[] = [...e.data];
      const customers: string[] = [];
      customersData.forEach((item: CUSTOMER) => {
        if (!item.last_used_date) return;
        if (new Date().getFullYear() - 7 > new Date(item.last_used_date).getFullYear()) return;
        if (item.name && !customers.includes(item.name) && item.name !== 'diverse') customers.push(item.name);
      });

      this._customers$.next(customers);
    });
  }
}
