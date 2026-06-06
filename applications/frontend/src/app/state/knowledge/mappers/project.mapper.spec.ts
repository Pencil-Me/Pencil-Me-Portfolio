import { createSampleProject } from '../../../../testing/knowledge.fixtures';
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

  it('should use heute when project end date is missing', () => {
    const project = convertProject({
      ...projectBasic,
      dates: [{ start_date: new Date('2022-01-01'), end_date: null as unknown as Date }],
    });

    expect(project.dates[0].end_date).toBe('heute');
  });

  it('should convert projects into categorized groups', () => {
    const projects = convertProjects([projectBasic]);

    expect(projects.length).toBe(1);
    expect(projects[0].title).toBe('Projekte als Auftragnehmer');
    expect(projects[0].data.length).toBe(1);
    expect(projects[0].data[0].label).toBe('Project 1');
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
