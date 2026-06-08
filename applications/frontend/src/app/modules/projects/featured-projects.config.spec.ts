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

  it('should treat null or zero featured_rank as not featured', () => {
    const base = categories[0].data[1];
    expect(isFeaturedProject({ ...base, featured_rank: null })).toBeFalse();
    expect(isFeaturedProject({ ...base, featured_rank: 0 })).toBeFalse();
    expect(isFeaturedProject({ ...base, featured_rank: -1 })).toBeFalse();
  });

  it('should sort featured projects by rank ascending', () => {
    const rankedCategories: IProjectsCategory[] = [
      {
        title: 'Test',
        data: [
          { ...categories[0].data[0], id: '3', featured_rank: 3 },
          { ...categories[0].data[0], id: '1', label: 'Rank 1', featured_rank: 1 },
          { ...categories[0].data[0], id: '2', label: 'Rank 2', featured_rank: 2 },
        ],
      },
    ];

    const result = resolveFeaturedProjects(rankedCategories);

    expect(result.map((project) => project.featured_rank)).toEqual([1, 2, 3]);
  });

  it('should default missing featured copy fields to empty strings', () => {
    const sparseCategories: IProjectsCategory[] = [
      {
        title: 'Test',
        data: [
          {
            ...categories[0].data[0],
            featured_tag: null,
            featured_problem: null,
            featured_role: null,
            featured_outcome: null,
          },
        ],
      },
    ];

    const result = resolveFeaturedProjects(sparseCategories);

    expect(result[0].tag).toBe('');
    expect(result[0].problem).toBe('');
    expect(result[0].role).toBe('');
    expect(result[0].outcome).toBe('');
  });
});
