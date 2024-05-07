import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TechStackTitle } from '@app/state/knowledge/knowledge.reducer';
import { fromKnowledge } from '@app/state/knowledge';
import { AppState } from '@app/state';
import { ITech, ITechCategory } from '@modules/about/about.models';
import { selectTechstackState } from '@app/state/knowledge/knowledge.selectors';
import { TECHSTACK, TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  store$: Observable<TECHSTACKDATASTATE> = this.store.select(selectTechstackState);

  private _tech$ = new BehaviorSubject<ITechCategory[]>([]);
  readonly tech$ = this._tech$ as Observable<ITechCategory[]>;

  constructor(private readonly store: Store<AppState>) {
    this.store.dispatch(fromKnowledge.actions.GetTechstack());
    this.store$.subscribe((e) => {
      const tech: ITechCategory[] = this.convertAndSortTechStack(e.data ?? []);
      this._tech$.next(tech);
    });
  }

  convertAndSortTechStack(simpTech: TECHSTACK[]): ITechCategory[] {
    const tech: ITechCategory[] = [];

    simpTech.forEach((item: TECHSTACK) => {
      const givenDate = item.last_usage_date ? new Date(item.last_usage_date) : new Date();
      if (new Date().getFullYear() - 5 > givenDate.getFullYear()) return;
      const objectDataToPush: ITech = {
        label: item.name,
        percent: item.expertise_level,
        lastTouch: givenDate.getFullYear().toString(),
        project_count: item.project_count ?? 0,
      };
      const itemTitle = TechStackTitle[item.type];
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

    tech.forEach((item) => {
      item.data.sort((a, b) => {
        const lastTouchA = a.lastTouch ?? 0;
        const lastTouchB = b.lastTouch ?? 0;
        return lastTouchB > lastTouchA ? 1 : lastTouchB < lastTouchA ? -1 : 0;
      });
    });

    return tech;
  }
}
