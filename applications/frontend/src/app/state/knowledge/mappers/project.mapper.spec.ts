import type { PROJECT } from '@app/state/knowledge/knowledge.models';

import { createSampleCustomer, createSampleProject } from '../../../../testing/knowledge.fixtures';
import { convertProject, convertProjects, sortProjects } from './project.mapper';

describe('project.mapper', () => {
  const projectBasic = createSampleProject();

  it('should convert a single project', () => {
    const project = convertProject(projectBasic);

    expect(project.id).toBe('1');
    expect(project.label).toBe('Project 1');
    expect(project.position).toBe('Position 1');
    expect(project.customer).toBe('Customer 1');
    expect(project.tech[0].name).toBe('Tech 1');
    expect(project.dates[0].start_date).toBe('Jan.2020');
    expect(project.dates[0].end_date).toBe('Jan.2021');
  });

  it('should resolve numeric tech type ids from the API', () => {
    const project = convertProject({
      ...projectBasic,
      tech: [{ uuid: '1', name: 'Angular', expertise_level: '5', type: 3 as unknown as string }],
    });

    expect(project.tech[0].type).toBe('FEFRAME');
  });

  it('should fall back to techstack lookup by name when project type is missing', () => {
    const project = convertProject(
      {
        ...projectBasic,
        tech: [{ uuid: '1', name: 'Angular', expertise_level: '5', type: '' }],
      },
      [
        {
          type: 'FEFRAME',
          name: 'Angular',
          expertise_level: 80,
          flag_important: false,
          project_count: 2,
          project_dates: [],
        },
      ],
    );

    expect(project.tech[0].type).toBe('FEFRAME');
  });

  it('should use heute when project end date is missing', () => {
    const project = convertProject({
      ...projectBasic,
      dates: [{ start_date: new Date('2022-01-01'), end_date: null as unknown as Date }],
    });

    expect(project.dates[0].end_date).toBe('heute');
  });

  it('should derive content_short from first bullet when API field is empty', () => {
    const project = convertProject({
      ...projectBasic,
      content: '•Angular migration\n•Cypress E2E',
      content_short: '',
    });

    expect(project.content_short).toBe('Angular migration');
  });

  it('should convert projects into categorized groups', () => {
    const projects = convertProjects([projectBasic]);

    expect(projects.length).toBe(1);
    expect(projects[0].title).toBe('Projekte als Auftragnehmer');
    expect(projects[0].data.length).toBe(1);
    expect(projects[0].data[0].label).toBe('Project 1');
  });

  it('should decode HTML entities in customer names', () => {
    const project = convertProject({
      ...projectBasic,
      customers: [createSampleCustomer({ name: 'Foo &amp; Bar', location: 'Berlin' })],
    });

    expect(project.customer).toBe('Foo & Bar');
  });

  it('should deduplicate locations from multiple customers', () => {
    const project = convertProject({
      ...projectBasic,
      customers: [
        createSampleCustomer({ name: 'A', location: 'Berlin' }),
        createSampleCustomer({ name: 'B', location: 'Berlin' }),
        createSampleCustomer({ name: 'C', location: 'Hamburg' }),
      ],
    });

    expect(project.location).toBe('Berlin, Hamburg');
  });

  it('should handle missing customers and tech gracefully', () => {
    const project = convertProject({
      ...projectBasic,
      customers: undefined,
      tech: undefined as unknown as PROJECT['tech'],
    });

    expect(project.customer).toBe('');
    expect(project.location).toBe('');
    expect(project.tech).toEqual([]);
  });

  it('should format position slashes with spaces', () => {
    const project = convertProject({
      ...projectBasic,
      position: 'Lead/Dev',
    });

    expect(project.position).toBe('Lead / Dev');
  });

  it('should keep provided content_short instead of deriving from bullets', () => {
    const project = convertProject({
      ...projectBasic,
      content: '•Ignored bullet',
      content_short: 'Provided short text',
    });

    expect(project.content_short).toBe('Provided short text');
  });

  it('should merge multiple projects into the same category', () => {
    const secondProject = {
      ...projectBasic,
      uuid: '2',
      name: 'Project 2',
    };

    const categories = convertProjects([projectBasic, secondProject]);

    expect(categories.length).toBe(1);
    expect(categories[0].data.length).toBe(2);
  });

  it('should pick the latest end date when multiple ranges exist', () => {
    const project = convertProject({
      ...projectBasic,
      dates: [
        { start_date: new Date('2018-01-01'), end_date: new Date('2019-01-01') },
        { start_date: new Date('2020-01-01'), end_date: new Date('2022-06-01') },
      ],
    });

    const sorted = sortProjects([
      convertProject({
        ...projectBasic,
        uuid: 'older',
        name: 'Older',
        dates: [{ start_date: new Date('2018-01-01'), end_date: new Date('2019-01-01') }],
      }),
      project,
    ]);

    expect(sorted[0].label).toBe('Project 1');
  });

  it('should sort projects by latest end date descending', () => {
    const olderProject = convertProject({
      ...projectBasic,
      uuid: '2',
      name: 'Older',
      dates: [{ start_date: new Date('2018-01-01'), end_date: new Date('2019-01-01') }],
    });
    const newerProject = convertProject({
      ...projectBasic,
      uuid: '3',
      name: 'Newer',
      dates: [{ start_date: new Date('2022-01-01'), end_date: new Date('2023-01-01') }],
    });

    const sorted = sortProjects([olderProject, newerProject]);

    expect(sorted[0].label).toBe('Newer');
    expect(sorted[1].label).toBe('Older');
  });
});
