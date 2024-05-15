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
  private _customers$ = new BehaviorSubject<string[]>([]);
  readonly customers$ = this._customers$ as Observable<string[]>;

  constructor(private readonly store: Store<AppState>) {
    this.initializeTechStack();
    this.initializeCustomers();
  }

  /**
   * Initializes the tech stack data by dispatching the action and subscribing to the store observable.
   */
  private initializeTechStack(): void {
    this.store.dispatch(fromKnowledge.actions.GetTechstack());
    this.storeTech$.subscribe((e) => {
      const techCategories = this.processTechStack(e.data ?? []);
      this._tech$.next(techCategories);
    });
  }

  /**
   * Processes the tech stack data and returns an array of categorized technologies.
   * @param techStack - Array of tech stack data from the store.
   * @returns Array of categorized technologies.
   */
  private processTechStack(techStack: TECHSTACK[]): ITechCategories[] {
    const tech: ITechCategories[] = [];
    const sortedTech = techStack.sort((a, b) => Number(b.project_count) - Number(a.project_count));

    sortedTech.forEach((item: TECHSTACK) => {
      if (item.project_count > 0 && this.isRecentUsage(item.last_usage_date)) {
        const simpTech = this.createSimpTech(item);
        this.addTechToCategory(tech, item.type, simpTech);
      }
    });

    return tech;
  }

  /**
   * Checks if the technology was used recently (within the last 3 years).
   * @param lastUsageDate - The last usage date of the technology.
   * @returns Boolean indicating whether the technology was used recently.
   */
  private isRecentUsage(lastUsageDate?: Date): boolean {
    const usageDate = lastUsageDate ?? new Date();
    return new Date().getFullYear() - usageDate.getFullYear() <= 3;
  }

  /**
   * Creates a simplified tech object from a TECHSTACK item.
   * @param item - The TECHSTACK item.
   * @returns The simplified tech object.
   */
  private createSimpTech(item: TECHSTACK): ISimpTech {
    return {
      label: item.name,
      lastTouch: new Date(item.last_usage_date ?? new Date()).getFullYear().toString(),
      numberOfProjects: item.project_count?.toString() ?? '1',
    };
  }

  /**
   * Adds a simplified tech object to the appropriate category in the tech array.
   * @param tech - The tech categories array.
   * @param type - The type of the technology.
   * @param simpTech - The simplified tech object.
   */
  private addTechToCategory(tech: ITechCategories[], type: string, simpTech: ISimpTech): void {
    const itemTitle = TechStackTitle[type] ?? type;
    const category = tech.find((x) => x.title === itemTitle);

    if (category) {
      category.data.push(simpTech);
    } else {
      tech.push({ title: itemTitle, data: [simpTech] });
    }
  }

  /**
   * Initializes the customer data by dispatching the action and subscribing to the store observable.
   */
  private initializeCustomers(): void {
    this.store.dispatch(fromKnowledge.actions.GetCustomers());
    this.storeCustomers$.subscribe((e) => {
      const customers = this.processCustomers(e.data ?? []);
      this._customers$.next(customers);
    });
  }

  /**
   * Processes the customer data and returns an array of customer names.
   * @param customersData - Array of customer data from the store.
   * @returns Array of customer names.
   */
  private processCustomers(customersData: CUSTOMER[]): string[] {
    const customers: string[] = [];
    customersData.forEach((item: CUSTOMER) => {
      if (this.isRecentCustomer(item.last_used_date) && item.name && item.name !== 'diverse') {
        customers.push(item.name);
      }
    });
    return customers;
  }

  /**
   * Checks if the customer was used recently (within the last 7 years).
   * @param lastUsedDate - The last used date of the customer.
   * @returns Boolean indicating whether the customer was used recently.
   */
  private isRecentCustomer(lastUsedDate?: Date): boolean {
    const usageDate = lastUsedDate ?? new Date();
    return new Date().getFullYear() - usageDate.getFullYear() <= 7;
  }
}
