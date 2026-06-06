import type { ITech, ITechCategory } from '@modules/about/about.models';
import type { ISimpTech, ITechCategories } from '@modules/home/home.models';
import type { IProjectTech } from '@modules/projects/projects.models';
import { formatYear, parseDate, yearsSince } from '@app/shared/utils/date-format';
import type { DATE, TECHSTACK } from '@app/state/knowledge/knowledge.models';
import { TechStackTitle } from '@app/state/knowledge/knowledge.reducer';

/** Home zeigt Tech mit Nutzung in den letzten N Jahren. */
export const HOME_RECENT_USAGE_YEARS = 5;

/** About blendet Tech aus, das laenger als N Jahre nicht genutzt wurde. */
export const ABOUT_MAX_IDLE_YEARS = 7;

function resolveTechCategoryTitle(type: string): string {
  return TechStackTitle[type] ?? type;
}

export function isRecentUsageForHome(
  lastUsageDate: Date | undefined,
  maxYears = HOME_RECENT_USAGE_YEARS,
): boolean {
  return yearsSince(lastUsageDate ?? new Date()) <= maxYears;
}

export function isOutdatedTechForAbout(
  lastUsageDate: Date,
  maxIdleYears = ABOUT_MAX_IDLE_YEARS,
): boolean {
  return yearsSince(lastUsageDate) > maxIdleYears;
}

/**
 * Home-Ansicht: nach project_count sortiert, nur aktuelle Tech mit Projekten.
 */
export function mapTechStackForHome(techStack: TECHSTACK[]): ITechCategories[] {
  const tech: ITechCategories[] = [];
  const sortedTech = [...techStack].sort(
    (a, b) => Number(b.project_count) - Number(a.project_count),
  );

  sortedTech.forEach((item) => {
    if (item.project_count > 0 && isRecentUsageForHome(item.last_usage_date)) {
      const simpTech = createHomeSimpTech(item);
      addToTechCategory(tech, item.type, simpTech);
    }
  });

  return tech;
}

/**
 * About-Ansicht: Prozent, Projektjahre, Sortierung nach lastTouch (absteigend).
 */
export function mapTechStackForAbout(techStack: TECHSTACK[]): ITechCategory[] {
  const techCategories: ITechCategory[] = [];

  techStack.forEach((techItem) => {
    const lastUsageDate = parseDate(techItem.last_usage_date ?? new Date());
    if (!lastUsageDate || isOutdatedTechForAbout(lastUsageDate)) {
      return;
    }

    const techData: ITech = {
      label: techItem.name,
      percent: techItem.expertise_level,
      lastTouch: formatYear(lastUsageDate),
      project_count: techItem.project_count ?? 0,
      project_years: countUsageTimeInMonth([...techItem.project_dates]) / 12,
    };

    addToTechCategory(techCategories, techItem.type, techData);
  });

  techCategories.forEach((category) => {
    category.data.sort((a, b) => compareLastTouchYears(a.lastTouch, b.lastTouch));
  });

  return techCategories;
}

/** Projects-Filter: alphabetisch sortierte Tech-Namen. */
export function mapTechFilterList(techStack: TECHSTACK[]): IProjectTech[] {
  return [...techStack]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({ name: item.name }));
}

function countUsageTimeInMonth(dates: DATE[]): number {
  if (dates.length === 0) {
    return 0;
  }

  const today = new Date();
  const filteredDates = dates
    .filter((date) => date.start_date !== null)
    .map((date) => ({
      start_date: new Date(date.start_date),
      end_date: date.end_date ? new Date(date.end_date) : today,
    }));

  if (filteredDates.length === 0) {
    return 0;
  }

  const sortedDates = filteredDates.sort((a, b) => a.start_date.getTime() - b.start_date.getTime());

  const mergedPeriods: { start_date: Date; end_date: Date }[] = [];
  let currentPeriod = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    if (date.start_date <= currentPeriod.end_date) {
      currentPeriod.end_date = new Date(
        Math.max(currentPeriod.end_date.getTime(), date.end_date.getTime()),
      );
    } else {
      mergedPeriods.push(currentPeriod);
      currentPeriod = date;
    }
  }
  mergedPeriods.push(currentPeriod);

  let totalMonths = 0;
  mergedPeriods.forEach((period) => {
    const yearsDifference = period.end_date.getFullYear() - period.start_date.getFullYear();
    const monthsDifference = period.end_date.getMonth() - period.start_date.getMonth();
    totalMonths += yearsDifference * 12 + monthsDifference + 1;
  });

  return totalMonths;
}

function createHomeSimpTech(item: TECHSTACK): ISimpTech {
  return {
    label: item.name,
    lastTouch: formatYear(item.last_usage_date ?? new Date()),
    numberOfProjects: item.project_count?.toString() ?? '1',
  };
}

function addToTechCategory<T>(
  categories: { title: string; data: T[] }[],
  type: string,
  item: T,
): void {
  const title = resolveTechCategoryTitle(type);
  const category = categories.find((entry) => entry.title === title);

  if (category) {
    category.data.push(item);
  } else {
    categories.push({ title, data: [item] });
  }
}

function compareLastTouchYears(lastTouchA = '', lastTouchB = ''): number {
  return parseInt(lastTouchB, 10) - parseInt(lastTouchA, 10);
}
