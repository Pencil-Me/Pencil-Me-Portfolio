import type { IProject, IProjectsCategory } from '@modules/projects/projects.models';
import { mapProjectDates } from '@app/shared/utils/date-format';
import type { DATE, PROJECT } from '@app/state/knowledge/knowledge.models';
import { ProjectTitle } from '@app/state/knowledge/knowledge.reducer';

function formatCustomerNames(project: PROJECT): string {
  return project.customers?.map((entry) => entry.name.replace('&amp;', '&')).join(', ') ?? '';
}

function formatUniqueLocations(project: PROJECT): string {
  const locations = project.customers?.map((entry) => entry.location) ?? [];
  return [...new Set(locations)].join(', ');
}

function mapProjectTech(project: PROJECT): IProject['tech'] {
  return project.tech?.map((entry) => ({ name: entry.name, id: entry.uuid })) ?? [];
}

export function convertProject(project: PROJECT): IProject {
  return {
    id: project.uuid ?? '',
    label: project.name ?? '',
    position: project.position?.replace(/\//g, ' / ') ?? '',
    content: project.content ?? '',
    customer: formatCustomerNames(project),
    location: formatUniqueLocations(project),
    org_dates: project.dates ?? [],
    dates: mapProjectDates(project.dates),
    tech: mapProjectTech(project),
  };
}

export function convertProjects(projects: PROJECT[]): IProjectsCategory[] {
  const categories: IProjectsCategory[] = [];

  projects.forEach((item) => {
    const projectView = convertProject(item);
    const title = ProjectTitle[item.type] ?? item.type;
    const category = categories.find((entry) => entry.title === title);

    if (category) {
      category.data.push(projectView);
    } else {
      categories.push({ title, data: [projectView] });
    }
  });

  categories.forEach((category) => {
    category.data = sortProjects([...category.data]);
  });

  return categories;
}

export function sortProjects(projects: IProject[]): IProject[] {
  const sorted = [...projects];
  sorted.sort(
    (a, b) => latestProjectEndTimestamp(b.org_dates) - latestProjectEndTimestamp(a.org_dates),
  );
  return sorted;
}

function latestProjectEndTimestamp(dates: DATE[]): number {
  let latest = new Date('01.01.1900').getTime();

  for (const entry of dates) {
    if (!entry.end_date) {
      return Date.now();
    }

    const endDate = new Date(entry.end_date).getTime();
    if (endDate > latest) {
      latest = endDate;
    }
  }

  return latest;
}
