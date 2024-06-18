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
    this.initializeTechStack();
  }

  /**
   * Initializes the tech stack by dispatching the action and subscribing to the store observable.
   */
  private initializeTechStack(): void {
    this.store.dispatch(fromKnowledge.actions.GetTechstack());
    this.store$.subscribe((techStackState) => {
      const techCategories = this.convertAndSortTechStack(techStackState.data ?? []);
      this._tech$.next(techCategories);
    });
  }

  /**
   * Converts and sorts the given tech stack data into categorized and sorted tech data.
   * @param techStack The tech stack data to convert and sort.
   * @returns An array of categorized and sorted tech data.
   */
  protected convertAndSortTechStack(techStack: TECHSTACK[]): ITechCategory[] {
    const techCategories: ITechCategory[] = [];

    techStack.forEach((techItem) => {
      this.addTechItemToCategories(techCategories, techItem);
    });

    this.sortTechCategories(techCategories);

    return techCategories;
  }

  /**
   * Adds a tech item to the appropriate category in the tech categories array.
   * @param techCategories The array of tech categories.
   * @param techItem The tech item to add.
   */
  private addTechItemToCategories(techCategories: ITechCategory[], techItem: TECHSTACK): void {
    const lastUsageDate = techItem.last_usage_date ? new Date(techItem.last_usage_date) : new Date();

    let monthSum = 0;

    let currentStartDate: Date = new Date('01.01.1900');
    let currentEndDate: Date = new Date('01.01.1900');

    const techItemDates = [...techItem.project_dates];
    const sorted = techItemDates
      .sort((a, b) => {
        let aEndDate: number = new Date('01.01.1900').getTime();
        let bEndDate: number = new Date('01.01.1900').getTime();

        if (!a.start_date) aEndDate = new Date().getTime();
        if (new Date(a.start_date).getTime() > aEndDate) aEndDate = new Date(a.start_date).getTime();

        if (!b.start_date) bEndDate = new Date().getTime();
        if (new Date(b.start_date).getTime() > bEndDate) bEndDate = new Date(b.start_date).getTime();

        return aEndDate - bEndDate;
      })
    sorted.forEach(date => {
      if (currentStartDate.getTime() === new Date('01.01.1900').getTime()) currentStartDate = new Date(date.start_date);
      if (currentEndDate.getTime() === new Date('01.01.1900').getTime()) currentEndDate = date.end_date ? new Date(date.end_date) : new Date();

      if (currentEndDate.getTime() < new Date(date.start_date).getTime()) {
        monthSum += Math.max(0, (currentEndDate.getFullYear() - currentStartDate.getFullYear()) * 12 - currentStartDate.getMonth() + currentEndDate.getMonth());
        currentStartDate = new Date(date.start_date);
      }
      if (currentEndDate.getTime() < new Date(date.end_date).getTime()) currentEndDate = new Date(date.end_date) ?? new Date();
    })

    if (currentStartDate.getTime() != new Date('01.01.1900').getTime()) {
      if (currentEndDate.getTime() === new Date('01.01.1900').getTime()) currentEndDate = new Date();
      monthSum += Math.max(0, (currentEndDate.getFullYear() - currentStartDate.getFullYear()) * 12 - currentStartDate.getMonth() + currentEndDate.getMonth());
    }

    const techData: ITech = {
      label: techItem.name,
      percent: techItem.expertise_level,
      lastTouch: lastUsageDate.getFullYear().toString(),
      project_count: techItem.project_count ?? 0,
      project_years: monthSum / 12,
    };

    if (this.isOutdatedTech(lastUsageDate)) return;

    const categoryTitle = TechStackTitle[techItem.type];
    const category = techCategories.find((category) => category.title === categoryTitle);

    if (category) {
      category.data.push(techData);
    } else {
      techCategories.push({
        title: categoryTitle,
        data: [techData],
      });
    }
  }

  /**
   * Checks if a tech item is outdated.
   * @param lastUsageDate The last usage date of the tech item.
   * @returns A boolean indicating whether the tech item is outdated.
   */
  private isOutdatedTech(lastUsageDate: Date): boolean {
    const currentYear = new Date().getFullYear();
    return currentYear - lastUsageDate.getFullYear() > 7;
  }

  /**
   * Sorts the tech items within each tech category by their last touch date.
   * @param techCategories The array of tech categories to sort.
   */
  private sortTechCategories(techCategories: ITechCategory[]): void {
    techCategories.forEach((category) => {
      category.data.sort((a, b) => this.compareLastTouchDates(a.lastTouch, b.lastTouch));
    });
  }

  /**
   * Compares two last touch dates.
   * @param lastTouchA The first last touch date.
   * @param lastTouchB The second last touch date.
   * @returns A number indicating the order of the two dates.
   */
  private compareLastTouchDates(lastTouchA: string = '', lastTouchB: string = ''): number {
    const yearA = parseInt(lastTouchA, 10);
    const yearB = parseInt(lastTouchB, 10);
    return yearB - yearA;
  }
}
