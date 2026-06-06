import {
  formatProjectDate,
  formatProjectEndDate,
  formatProjectMonthYear,
  formatYear,
  mapProjectDates,
  parseDate,
  PROJECT_END_DATE_LABEL,
  yearsSince,
} from './date-format';

describe('parseDate', () => {
  it('should parse valid dates', () => {
    expect(parseDate('2024-01-15')?.getFullYear()).toBe(2024);
  });

  it('should return null for invalid dates', () => {
    expect(parseDate('invalid')).toBeNull();
  });
});

describe('formatProjectMonthYear', () => {
  it('should format ISO date strings as MMM.YYYY', () => {
    expect(formatProjectMonthYear('2024-01-15')).toBe('Jan.2024');
  });

  it('should format Date objects as MMM.YYYY', () => {
    expect(formatProjectMonthYear(new Date('2020-01-01'))).toBe('Jan.2020');
    expect(formatProjectMonthYear(new Date('2021-05-01'))).toBe('May.2021');
  });

  it('should return em dash for invalid dates', () => {
    expect(formatProjectMonthYear('not-a-date')).toBe('—');
  });
});

describe('formatProjectDate alias', () => {
  it('should match formatProjectMonthYear', () => {
    expect(formatProjectDate('2024-01-15')).toBe('Jan.2024');
  });
});

describe('formatProjectEndDate', () => {
  it('should return heute when end date is null or undefined', () => {
    expect(formatProjectEndDate(null)).toBe(PROJECT_END_DATE_LABEL);
    expect(formatProjectEndDate(undefined)).toBe(PROJECT_END_DATE_LABEL);
  });

  it('should format valid end dates', () => {
    expect(formatProjectEndDate(new Date('2023-06-15'))).toBe('Jun.2023');
  });
});

describe('formatYear', () => {
  it('should return only the calendar year', () => {
    expect(formatYear(new Date('2023-02-05'))).toBe('2023');
  });
});

describe('yearsSince', () => {
  it('should calculate full-year difference', () => {
    expect(yearsSince(new Date('2020-01-01'), new Date('2024-06-01'))).toBe(4);
  });
});

describe('mapProjectDates', () => {
  it('should map API dates to display strings', () => {
    expect(
      mapProjectDates([
        { start_date: new Date('2020-01-01'), end_date: new Date('2021-01-01') },
      ]),
    ).toEqual([{ start_date: 'Jan.2020', end_date: 'Jan.2021' }]);
  });

  it('should map missing end dates to heute', () => {
    expect(
      mapProjectDates([{ start_date: new Date('2022-01-01'), end_date: null as unknown as Date }]),
    ).toEqual([{ start_date: 'Jan.2022', end_date: 'heute' }]);
  });
});
