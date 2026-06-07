import type { ITech, ITechCategory } from '@modules/about/about.models';
import type { ISimpTech, ITechCategories } from '@modules/home/home.models';
import type { IProjectsCategory, IProjectTech } from '@modules/projects/projects.models';
import { TECH_STACK_TYPES, type TechStackType } from '@app/shared/domain/portfolio-domain';
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

/** DB techstack_type.id → Code (applications/db/init-scripts/dll.sql). */
const TECHSTACK_TYPE_ID_TO_CODE: Record<number, TechStackType> = {
  1: 'FEDEV',
  2: 'BEDEV',
  3: 'FEFRAME',
  4: 'BEFRAME',
  5: 'FEBT',
  6: 'DEVOPS',
  7: 'DB',
  8: 'CMS',
  9: 'TEST',
  10: 'PROJECTTOOL',
  11: 'MISC',
  12: 'DESIGN',
  13: 'LANG',
};

const TECHSTACK_TYPE_CODE_SET = new Set<string>(TECH_STACK_TYPES);

function isTechStackTypeCode(value: string): value is TechStackType {
  return TECHSTACK_TYPE_CODE_SET.has(value);
}

export function normalizeProjectTechType(type: unknown): string | undefined {
  if (typeof type === 'number' && Number.isInteger(type)) {
    return TECHSTACK_TYPE_ID_TO_CODE[type];
  }

  if (typeof type === 'string') {
    const trimmed = type.trim();
    if (trimmed.length === 0) {
      return undefined;
    }
    if (isTechStackTypeCode(trimmed)) {
      return trimmed;
    }
    const numericId = Number(trimmed);
    if (!Number.isNaN(numericId) && Number.isInteger(numericId)) {
      return TECHSTACK_TYPE_ID_TO_CODE[numericId];
    }
    return trimmed;
  }

  return undefined;
}

/** Tech-Name → Typ-Code aus all_techstacks (Fallback wenn Projekt-API nur ID liefert). */
export function buildTechStackTypeByName(techStack: TECHSTACK[]): Map<string, string> {
  const byName = new Map<string, string>();
  for (const item of techStack) {
    const typeCode = normalizeProjectTechType(item.type);
    if (typeCode) {
      byName.set(item.name, typeCode);
    }
  }
  return byName;
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
    .map((item) => ({ name: item.name, type: item.type }));
}

/** Eindeutige Tech aus allen Projekten, gruppiert fuer den Projects-Filter. */
export function collectProjectTechForFilter(categories: IProjectsCategory[]): ITechCategories[] {
  const techMap = new Map<string, IProjectTech>();

  for (const category of categories) {
    for (const project of category.data) {
      for (const tech of project.tech) {
        if (!techMap.has(tech.name)) {
          techMap.set(tech.name, tech);
        }
      }
    }
  }

  return mapProjectTechByCategory([...techMap.values()]);
}

/** Gruppiert Projekt-Tech wie Home „Technologien und Tools“ (ITechCategories). */
export function mapProjectTechByCategory(tech: IProjectTech[]): ITechCategories[] {
  if (tech.length === 0) {
    return [];
  }

  const typeOrder = new Map<string, number>(TECH_STACK_TYPES.map((type, index) => [type, index]));

  const sorted = [...tech].sort((a, b) => {
    const typeA = normalizeProjectTechType(a.type) ?? 'MISC';
    const typeB = normalizeProjectTechType(b.type) ?? 'MISC';
    const orderDiff =
      (typeOrder.get(typeA) ?? Number.MAX_SAFE_INTEGER) -
      (typeOrder.get(typeB) ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return a.name.localeCompare(b.name);
  });

  const categories: ITechCategories[] = [];
  for (const item of sorted) {
    addToTechCategory(categories, normalizeProjectTechType(item.type) ?? 'MISC', {
      label: item.name,
      lastTouch: '',
      numberOfProjects: '',
    });
  }

  return categories;
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
