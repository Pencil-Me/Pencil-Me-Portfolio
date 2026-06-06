import type { DATE } from '@app/state/knowledge/knowledge.models';
import type { IProjectDate } from '@modules/projects/projects.models';

const INVALID_DATE_LABEL = '—';
export const PROJECT_END_DATE_LABEL = 'heute';

const PROJECT_MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short' });

export function parseDate(value: Date | string): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Monat + Jahr fuer Projektzeitraeume (z. B. "Jan.2024"). */
export function formatProjectMonthYear(value: Date | string): string {
  const date = parseDate(value);
  if (!date) {
    return INVALID_DATE_LABEL;
  }

  const month = PROJECT_MONTH_FORMATTER.format(date);
  return `${month}.${date.getFullYear()}`;
}

/** Alias fuer bestehende Aufrufer. */
export const formatProjectDate = formatProjectMonthYear;

export function formatProjectEndDate(value: Date | string | null | undefined): string {
  if (value == null) {
    return PROJECT_END_DATE_LABEL;
  }

  return formatProjectMonthYear(value);
}

/** Nur das Jahr — z. B. "Zuletzt: 2023" in About/Home-Tech. */
export function formatYear(value: Date | string): string {
  const date = parseDate(value);
  return date ? String(date.getFullYear()) : INVALID_DATE_LABEL;
}

export function yearsSince(value: Date | string | undefined, reference: Date = new Date()): number {
  const date = value ? parseDate(value) : reference;
  if (!date) {
    return 0;
  }

  return reference.getFullYear() - date.getFullYear();
}

export function mapProjectDates(dates: DATE[] | undefined): IProjectDate[] {
  return (
    dates?.map((entry) => ({
      start_date: formatProjectMonthYear(entry.start_date),
      end_date: formatProjectEndDate(entry.end_date),
    })) ?? []
  );
}
