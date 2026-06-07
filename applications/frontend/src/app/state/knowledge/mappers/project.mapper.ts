import type { IProject, IProjectsCategory } from '@modules/projects/projects.models';
import { mapProjectDates } from '@app/shared/utils/date-format';
import { deriveContentShort, normalizeProjectText } from '@app/shared/utils/project-content.util';
import type { DATE, PROJECT, TECHSTACK } from '@app/state/knowledge/knowledge.models';
import { ProjectTitle } from '@app/state/knowledge/knowledge.reducer';
import {
  buildTechStackTypeByName,
  normalizeProjectTechType,
} from '@app/state/knowledge/mappers/tech-stack.mapper';

function formatCustomerNames(project: PROJECT): string {
  return project.customers?.map((entry) => entry.name.replace('&amp;', '&')).join(', ') ?? '';
}

function formatUniqueLocations(project: PROJECT): string {
  const locations = project.customers?.map((entry) => entry.location) ?? [];
  return [...new Set(locations)].join(', ');
}

function resolveProjectTechType(
  entry: { name: string; type?: unknown },
  techStackByName: Map<string, string>,
): string | undefined {
  return (
    normalizeProjectTechType(entry.type) ??
    normalizeProjectTechType(techStackByName.get(entry.name))
  );
}

function mapProjectTech(
  project: PROJECT,
  techStackByName: Map<string, string> = new Map(),
): IProject['tech'] {
  return (
    project.tech?.map((entry) => ({
      name: entry.name,
      type: resolveProjectTechType(entry, techStackByName),
    })) ?? []
  );
}

export function convertProject(project: PROJECT, techStack: TECHSTACK[] = []): IProject {
  const techStackByName = buildTechStackTypeByName(techStack);
  const content = normalizeProjectText(project.content);
  const contentShort = normalizeProjectText(project.content_short) || deriveContentShort(content);
  const contentLong = normalizeProjectText(project.content_long);

  return {
    id: project.uuid ?? '',
    label: project.name ?? '',
    position: project.position?.replace(/\//g, ' / ') ?? '',
    content,
    content_short: contentShort,
    content_long: contentLong,
    category: ProjectTitle[project.type ?? ''] ?? project.type ?? '',
    customer: formatCustomerNames(project),
    location: formatUniqueLocations(project),
    org_dates: project.dates ?? [],
    dates: mapProjectDates(project.dates),
    tech: mapProjectTech(project, techStackByName),
    featured_rank: project.featured_rank ?? null,
    featured_tag: project.featured_tag ?? null,
    featured_problem: project.featured_problem ?? null,
    featured_role: project.featured_role ?? null,
    featured_outcome: project.featured_outcome ?? null,
  };
}

export function convertProjects(
  projects: PROJECT[],
  techStack: TECHSTACK[] = [],
): IProjectsCategory[] {
  const categories: IProjectsCategory[] = [];

  projects.forEach((item) => {
    const projectView = convertProject(item, techStack);
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
