import { resolveFeaturedProjects } from '@modules/projects/featured-projects.config';
import type { IProjectsCategory } from '@modules/projects/projects.models';

describe('resolveFeaturedProjects', () => {
  const categories: IProjectsCategory[] = [
    {
      title: 'Test',
      data: [
        {
          id: '1',
          label: 'NetworX, als zentrales Verwaltungstool',
          position: 'Senior Frontend-Entwickler',
          customer: 'arvato',
          location: 'Hannover',
          content: '',
          org_dates: [],
          dates: [],
          tech: [{ name: 'Angular' }],
        },
        {
          id: '2',
          label: 'Anderes Projekt',
          position: '',
          customer: '',
          location: '',
          content: '',
          org_dates: [],
          dates: [],
          tech: [],
        },
      ],
    },
  ];

  it('should resolve configured highlights in order', () => {
    const result = resolveFeaturedProjects(categories);

    expect(result.length).toBe(1);
    expect(result[0].label).toContain('NetworX');
    expect(result[0].tag).toBe('Enterprise · Angular');
    expect(result[0].problem).toContain('Internationales Verwaltungstool');
  });
});
