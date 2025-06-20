import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TechStackTitle } from '@app/state/knowledge/knowledge.reducer';
import { fromKnowledge } from '@app/state/knowledge';
import { AppState } from '@app/state';
import { ITech, ITechCategory } from '@modules/about/about.models';
import { selectTechstackState } from '@app/state/knowledge/knowledge.selectors';
import { DATE, TECHSTACK, TECHSTACKDATASTATE } from '@app/state/knowledge/knowledge.models';

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

  countUsageTimeInMonth(dates: DATE[]): number {
    if (dates.length === 0) return 0;

    const today = new Date();

    // Filter out entries with null start_date and set end_date to today if it is null
    const filteredDates = dates
      .filter((date) => date.start_date !== null)
      .map((date) => ({
        start_date: new Date(date.start_date),
        end_date: date.end_date ? new Date(date.end_date) : today,
      }));

    if (filteredDates.length === 0) return 0;

    // Sort dates by start_date
    const sortedDates = filteredDates.sort(
      (a, b) => a.start_date.getTime() - b.start_date.getTime(),
    );

    const mergedPeriods: DATE[] = [];
    let currentPeriod = sortedDates[0];

    for (let i = 1; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      if (date.start_date <= currentPeriod.end_date) {
        // Extend the current period if overlapping
        currentPeriod.end_date = new Date(
          Math.max(currentPeriod.end_date.getTime(), date.end_date.getTime()),
        );
      } else {
        // Push the current period and start a new one
        mergedPeriods.push(currentPeriod);
        currentPeriod = date;
      }
    }
    // Push the last period
    mergedPeriods.push(currentPeriod);

    // Calculate the total months
    let totalMonths = 0;
    mergedPeriods.forEach((period) => {
      const start = period.start_date;
      const end = period.end_date;

      const yearsDifference = end.getFullYear() - start.getFullYear();
      const monthsDifference = end.getMonth() - start.getMonth();

      totalMonths += yearsDifference * 12 + monthsDifference + 1; // +1 to include the start month
    });

    return totalMonths;
  }

  /**
   * Adds a tech item to the appropriate category in the tech categories array.
   * @param techCategories The array of tech categories.
   * @param techItem The tech item to add.
   */
  private addTechItemToCategories(techCategories: ITechCategory[], techItem: TECHSTACK): void {
    const lastUsageDate = techItem.last_usage_date
      ? new Date(techItem.last_usage_date)
      : new Date();

    if (this.isOutdatedTech(lastUsageDate)) return;

    const techData: ITech = {
      label: techItem.name,
      percent: techItem.expertise_level,
      lastTouch: lastUsageDate.getFullYear().toString(),
      project_count: techItem.project_count ?? 0,
      project_years: this.countUsageTimeInMonth([...techItem.project_dates]) / 12,
    };

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
