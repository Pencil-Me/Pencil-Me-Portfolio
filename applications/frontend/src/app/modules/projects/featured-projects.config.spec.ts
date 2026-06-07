import {
  isFeaturedProject,
  resolveFeaturedProjects,
} from '@modules/projects/featured-projects.config';
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
          featured_rank: 1,
          featured_tag: 'Enterprise · Angular · Nx',
          featured_problem: 'Tausende Nutzer, internationale Programme',
          featured_role: 'Senior Frontend im Nx-Monorepo',
          featured_outcome: 'Release-fähige Modernisierung',
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

  it('should identify featured projects by featured_rank', () => {
    expect(isFeaturedProject(categories[0].data[0])).toBeTrue();
    expect(isFeaturedProject(categories[0].data[1])).toBeFalse();
  });

  it('should resolve featured projects by rank from API fields', () => {
    const result = resolveFeaturedProjects(categories);

    expect(result.length).toBe(1);
    expect(result[0].label).toContain('NetworX');
    expect(result[0].tag).toBe('Enterprise · Angular · Nx');
    expect(result[0].problem).toContain('internationale Programme');
    expect(result[0].role).toContain('Senior Frontend');
    expect(result[0].outcome).toContain('Release-fähige Modernisierung');
  });
});
