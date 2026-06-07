import type { ITechCategory } from '@modules/about/about.models';
import type { TECHSTACK } from '@app/state/knowledge/knowledge.models';

import { createTechStackMapperFixture } from '../../../../testing/knowledge.fixtures';
import {
  ABOUT_MAX_IDLE_YEARS,
  collectProjectTechForFilter,
  HOME_RECENT_USAGE_YEARS,
  isOutdatedTechForAbout,
  isRecentUsageForHome,
  mapProjectTechByCategory,
  mapTechFilterList,
  mapTechStackForAbout,
  mapTechStackForHome,
  normalizeProjectTechType,
} from './tech-stack.mapper';

describe('tech-stack.mapper', () => {
  const homeFixture: TECHSTACK[] = createTechStackMapperFixture();

  describe('mapTechStackForHome', () => {
    it('should group by category and sort by project_count within insertion order', () => {
      const result = mapTechStackForHome(homeFixture);

      expect(result.length).toBe(2);
      expect(result[0].title).toBe('Backend Development');
      expect(result[0].data[0].label).toBe('BETech1');
      expect(result[1].title).toBe('Frontend Development');
      expect(result[1].data.map((item) => item.label)).toEqual(['FETech1', 'FETech2']);
    });

    it(`should exclude tech older than ${HOME_RECENT_USAGE_YEARS} years`, () => {
      expect(
        mapTechStackForHome(homeFixture)
          .flatMap((c) => c.data)
          .some((t) => t.label === 'OldTech'),
      ).toBeFalse();
    });

    it('should exclude tech without projects and use unknown category titles', () => {
      const recentDate = new Date();
      const result = mapTechStackForHome([
        {
          type: 'CUSTOM' as TECHSTACK['type'],
          name: 'Rust',
          expertise_level: 80,
          last_usage_date: recentDate,
          flag_important: false,
          project_count: 2,
          project_dates: [],
        },
        {
          type: 'FEDEV',
          name: 'NoProjects',
          expertise_level: 50,
          last_usage_date: recentDate,
          flag_important: false,
          project_count: 0,
          project_dates: [],
        },
      ]);

      expect(result).toEqual([
        {
          title: 'CUSTOM',
          data: [
            { label: 'Rust', lastTouch: String(recentDate.getFullYear()), numberOfProjects: '2' },
          ],
        },
      ]);
    });

    it('should respect custom recent usage window', () => {
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

      expect(isRecentUsageForHome(threeYearsAgo, 5)).toBeTrue();
      expect(isRecentUsageForHome(threeYearsAgo, 2)).toBeFalse();
    });
  });

  describe('mapTechStackForAbout', () => {
    it('should convert, filter outdated tech and sort by lastTouch descending', () => {
      const aboutFixture: TECHSTACK[] = [
        {
          type: 'FEDEV',
          name: 'Angular',
          expertise_level: 70,
          last_usage_date: new Date('2023-02-05'),
          flag_important: false,
          project_count: 5,
          project_dates: [],
        },
        {
          type: 'FEDEV',
          name: 'Vue',
          expertise_level: 90,
          last_usage_date: new Date('2023-02-05'),
          flag_important: false,
          project_count: 6,
          project_dates: [],
        },
        {
          type: 'BEDEV',
          name: 'PHP',
          expertise_level: 85,
          last_usage_date: new Date('2024-02-05'),
          flag_important: false,
          project_count: 2,
          project_dates: [],
        },
        {
          type: 'BEDEV',
          name: 'NeedsToBeNotListed',
          expertise_level: 85,
          last_usage_date: new Date('2015-02-05'),
          flag_important: false,
          project_count: 2,
          project_dates: [],
        },
        {
          type: 'FEDEV',
          name: 'Bootstrap',
          expertise_level: 90,
          last_usage_date: new Date('2021-02-05'),
          flag_important: false,
          project_count: 10,
          project_dates: [],
        },
      ];

      const expectedResult: ITechCategory[] = [
        {
          title: 'Frontend Development',
          data: [
            {
              label: 'Angular',
              percent: 70,
              lastTouch: '2023',
              project_count: 5,
              project_years: 0,
            },
            {
              label: 'Vue',
              percent: 90,
              lastTouch: '2023',
              project_count: 6,
              project_years: 0,
            },
            {
              label: 'Bootstrap',
              percent: 90,
              lastTouch: '2021',
              project_count: 10,
              project_years: 0,
            },
          ],
        },
        {
          title: 'Backend Development',
          data: [
            {
              label: 'PHP',
              percent: 85,
              lastTouch: '2024',
              project_count: 2,
              project_years: 0,
            },
          ],
        },
      ];

      expect(mapTechStackForAbout(aboutFixture)).toEqual(expectedResult);
    });

    it(`should filter tech idle for more than ${ABOUT_MAX_IDLE_YEARS} years`, () => {
      const idleDate = new Date();
      idleDate.setFullYear(idleDate.getFullYear() - (ABOUT_MAX_IDLE_YEARS + 1));

      expect(isOutdatedTechForAbout(idleDate)).toBeTrue();
      expect(isRecentUsageForHome(idleDate)).toBeFalse();
    });

    it('should merge overlapping project periods into project_years', () => {
      const result = mapTechStackForAbout([
        {
          type: 'FEDEV',
          name: 'TypeScript',
          expertise_level: 90,
          last_usage_date: new Date('2024-06-01'),
          flag_important: false,
          project_count: 3,
          project_dates: [
            { start_date: new Date('2020-01-01'), end_date: new Date('2020-06-01') },
            { start_date: new Date('2020-04-01'), end_date: new Date('2021-01-01') },
            { start_date: null as unknown as Date, end_date: new Date('2019-01-01') },
          ],
        },
      ]);

      expect(result[0]?.data[0]?.project_years).toBeGreaterThan(0);
    });

    it('should skip tech with invalid last usage date', () => {
      expect(
        mapTechStackForAbout([
          {
            type: 'FEDEV',
            name: 'InvalidDateTech',
            expertise_level: 50,
            last_usage_date: new Date('invalid'),
            flag_important: false,
            project_count: 1,
            project_dates: [],
          },
        ]),
      ).toEqual([]);
    });

    it('should append to existing categories', () => {
      const recentDate = new Date('2024-02-05');
      const stack: TECHSTACK[] = [
        {
          type: 'FEDEV',
          name: 'Angular',
          expertise_level: 70,
          last_usage_date: recentDate,
          flag_important: false,
          project_count: 5,
          project_dates: [],
        },
        {
          type: 'FEDEV',
          name: 'React',
          expertise_level: 60,
          last_usage_date: recentDate,
          flag_important: false,
          project_count: 2,
          project_dates: [],
        },
      ];

      const result = mapTechStackForAbout(stack);

      expect(result.length).toBe(1);
      expect(result[0]?.data.map((item) => item.label)).toEqual(['Angular', 'React']);
    });
  });

  describe('mapTechFilterList', () => {
    it('should return alphabetically sorted tech names', () => {
      const result = mapTechFilterList(homeFixture);

      expect(result.map((item) => item.name)).toEqual([
        'BETech1',
        'FETech1',
        'FETech2',
        'NoProjects',
        'OldTech',
      ]);
    });
  });

  describe('normalizeProjectTechType', () => {
    it('should map numeric type ids and string codes', () => {
      expect(normalizeProjectTechType(3)).toBe('FEFRAME');
      expect(normalizeProjectTechType('3')).toBe('FEFRAME');
      expect(normalizeProjectTechType('FEDEV')).toBe('FEDEV');
    });
  });

  describe('mapProjectTechByCategory', () => {
    it('should group tech by category title in canonical order', () => {
      const result = mapProjectTechByCategory([
        { name: 'Docker', type: 'DEVOPS' },
        { name: 'Angular', type: 'FEFRAME' },
        { name: 'TypeScript', type: 'FEDEV' },
        { name: 'Node.js', type: 'BEDEV' },
      ]);

      expect(result.map((group) => group.title)).toEqual([
        'Frontend Development',
        'Backend Development',
        'Frontend Frameworks',
        'Devops',
      ]);
      expect(result[0]?.data.map((item) => item.label)).toEqual(['TypeScript']);
      expect(result[2]?.data.map((item) => item.label)).toEqual(['Angular']);
    });

    it('should sort items alphabetically within each group', () => {
      const result = mapProjectTechByCategory([
        { name: 'Vue', type: 'FEFRAME' },
        { name: 'Angular', type: 'FEFRAME' },
      ]);

      expect(result[0]?.data.map((item) => item.label)).toEqual(['Angular', 'Vue']);
    });

    it('should return empty array for no tech', () => {
      expect(mapProjectTechByCategory([])).toEqual([]);
    });

    it('should tolerate non-string type values without throwing', () => {
      const result = mapProjectTechByCategory([
        { name: 'Angular', type: 'FEFRAME' },
        { name: 'Legacy', type: 3 as unknown as string },
      ]);

      expect(result.length).toBe(1);
      expect(result[0]?.title).toBe('Frontend Frameworks');
      expect(result[0]?.data.map((item) => item.label)).toEqual(['Angular', 'Legacy']);
    });
  });

  describe('collectProjectTechForFilter', () => {
    it('should collect unique tech from all projects and group by category', () => {
      const result = collectProjectTechForFilter([
        {
          title: 'Cat A',
          data: [
            {
              id: '1',
              label: 'P1',
              tech: [
                { name: 'Angular', type: 'FEFRAME' },
                { name: 'TypeScript', type: 'FEDEV' },
              ],
              position: '',
              customer: '',
              location: '',
              content: '',
              org_dates: [],
              dates: [],
            },
          ],
        },
        {
          title: 'Cat B',
          data: [
            {
              id: '2',
              label: 'P2',
              tech: [
                { name: 'Angular', type: 'FEFRAME' },
                { name: 'Docker', type: 'DEVOPS' },
              ],
              position: '',
              customer: '',
              location: '',
              content: '',
              org_dates: [],
              dates: [],
            },
          ],
        },
      ]);

      const labels = result.flatMap((group) => group.data.map((item) => item.label));
      expect(labels.sort()).toEqual(['Angular', 'Docker', 'TypeScript']);
      expect(result.find((group) => group.title === 'Frontend Frameworks')?.data.length).toBe(1);
    });

    it('should return empty array when no projects have tech', () => {
      expect(
        collectProjectTechForFilter([
          {
            title: 'Empty',
            data: [
              {
                id: '1',
                label: 'P1',
                tech: [],
                position: '',
                customer: '',
                location: '',
                content: '',
                org_dates: [],
                dates: [],
              },
            ],
          },
        ]),
      ).toEqual([]);
    });
  });
});
